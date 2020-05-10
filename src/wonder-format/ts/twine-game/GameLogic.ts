import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData, PreloadPageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {UserScriptApi} from '../runtime/UserScriptApi';
import {WonderHistory} from './logic/WonderHistory';
import {AppState, IAppState, IUserState, UserState} from './AppState';
import {RUNTIME_STORE, STORE, STORY_STORE} from './Stores';
import {parseTwineData} from '../parser/TwineParser';
import {StateRepository} from './logic/repository/StateRepository';
import {IRunTimeCommand} from '../abstract/WonderInterfaces';
import {UserScriptCommand} from '../runtime/UserScriptCommands';
import {Collections} from './logic/collections/Collections';
import {AudioPlayer} from './logic/AudioPlayer';
import {Preprocessor} from './logic/preprocessor/Preprocessor';
import {PreprocessPosition} from './logic/preprocessor/PreprocessorInterfaces';

const gameSavePrefix = 'w-game-';
const userSavePrefix = 'w-user-';
const userSaveSlot = 'data';

export class GameLogic {
    private readonly gameConfig;
    private readonly history: WonderHistory;
    private readonly collections: Collections;
    private readonly preprocessor: Preprocessor;
    private readonly stateRepo: StateRepository;
    private readonly audioPlayer: AudioPlayer;
    private readonly userScriptApi: UserScriptApi;

    private isAutoSave = true;
    private isAutoLoad = true;
    private isLoading = false; // заказана загрузка
    private gameSaveName = 'default';

    constructor() {
        this.gameConfig = new GameConfig();
        this.history = new WonderHistory();
        this.collections = new Collections();
        this.preprocessor = new Preprocessor();
        this.stateRepo = new StateRepository();
        this.audioPlayer = new AudioPlayer();
        this.userScriptApi = new UserScriptApi();

        // @ts-ignore
        window.w = this.userScriptApi;
        // @ts-ignore
        window.Wonder = window.w;

        STORE.state = new AppState();
        STORE.user = new UserState();
        STORY_STORE.story = null;

        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onClick(id))
            .sub(GameEvents.onBackClick, (message) => this.onBackClick())
    }

    start() {
        this.showPreloader()
            .then(() => this.startParsing())
            .then(story => this.onStoryLoad(story))
            .then(() => this.preloadUserState())
            .then(userState => this.onUserStateLoad(userState))
            .then(() => this.preloadGameState())
            .then(gameState => this.onPreloadState(gameState))
            .then(() => this.startGame(STORY_STORE.story, STORE.state))
    }

    private showPreloader(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('preloading...');
            const preloadViewData = new PreloadPageViewData();
            this.startPage(preloadViewData);
            resolve()
        });
    }

    private startParsing(): Promise<ITwineStory> {
        return new Promise((resolve, reject) => {
            console.log('startParsing...');
            const story = parseTwineData();
            resolve(story);
        });
    }

    private onStoryLoad(story: ITwineStory): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('onStoryLoad...', story);
            STORY_STORE.story = story;
            this.preprocessor.beforeStoryLoad();
            this.exeScript(story.script, STORE.state.gameVars);
            this.execUserScriptCommands();
            this.collections.onStoryReady();
            resolve();
        })
    }

    private preloadUserState(): Promise<IUserState> {
        return new Promise((resolve, reject) => {
            console.log('preloadUserState...');
            const slot = userSavePrefix + userSaveSlot;
            this.stateRepo.load(
                slot,
                data => resolve(data),
                e => {
                    console.warn('preloadUserState error ' + e);
                    resolve(null)
                }
            )
        })
    }

    private onUserStateLoad(state: IUserState): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('onUserStateLoad...', state);
            if (state != null) STORE.user = state;
            console.log('onUserStateLoad...  STORE.user', STORE.user);
            resolve();
        })
    }

    private preloadGameState(): Promise<IAppState> {
        return new Promise((resolve, reject) => {
            console.log('preloadGameState...');
            this.stateRepo.load(
                this.getGameSaveName(),
                state => resolve(state),
                message => {
                    console.warn('preloadGameState error' + message);
                    resolve(null)
                }
            )
        })
    }

    private onPreloadState(state: IAppState): Promise<void> {
        return new Promise((resolve, reject) => {
            if (state != null) {
                RUNTIME_STORE.hasSave = true;
            }
            if (this.isAutoLoad) {
                this.updateGameState(state);
            }
            resolve();
        })
    }

    private updateGameState(state: IAppState) {
        if (state == null) return;
        STORE.state = {
            ...STORE.state,
            ...state
        }
        this.collections.onStateUpdate();
    }

    private onGameStateLoad(state: IAppState) {
        console.log('onGameStateLoad...', state);
        this.updateGameState(state);
        this.startGame(STORY_STORE.story, STORE.state);
    }

    /*********
     * LOGIC
     *********/
    private getStartPage(story: ITwineStory, state: IAppState): string {
        const hPages = state.history.pages;
        const lastPage = hPages[hPages.length - 1];
        return lastPage != null ? lastPage : story.startPassageName;
    }

    private startGame(story: ITwineStory, state: IAppState) {
        this.onClick(this.getStartPage(story, state));
    }

    private startPage(pageViewData: PageViewData) {
        EventBus.emit(GameEvents.preparePassage, pageViewData);
    }

    private onPassagePrepared(passage: ITwinePassage) {
        this.audioPlayer.musicCheck(passage.name);
        EventBus.emit(GameEvents.showPassage, passage);
    }

    private onClick(name: string) {
        console.log('onClick', name);
        // копия для иммутабельности
        const passage = Object.assign({}, STORY_STORE.story.passageHash[name]);

        this.collections.onPassage(passage);
        this.history.add(name); // текущий узел идёт в историю

        this.preprocessor.exec(passage);
        // тут могут быть вызваны команды
        // - load
        // - restart
        const viewData = this.execPassage(passage);
        this.autoSave();
        this.startPage(viewData);
    }


    private onBackClick() {
        this.history.pop(); // текущий узел уходит из истории
        const name = this.history.getLast();
        this.onClick(name);
    }

    /*********
     * helpers
     *********/

    // выполнить скрипт, забинденный на game
    private exeScript(script: string, context: object) {
        let result = null;

        try {
            const func = new Function(script).bind(context); // создаю функцию из строки
            result = func(); // исполняю функцию
        } catch (e) {
            // todo сделать вывод без консоли, оповещение
            // м.б. запись в историю ошибок
            // потому что сейчас весь консольный лог в продакшене чистится
            console.warn(' Wonder - UserScript error:' + e)
        }

        return result;
    }

    /**
     * Формирует viewPassage для отображения
     * + исполняет логику
     * @param name
     */
    private execPassage(passage: ITwinePassage): PageViewData {

        this.execScripts(passage);
        this.execUserScriptCommands();

        return new PageViewData(
            passage,
            STORE.state.gameVars,
            this.gameConfig,
            this.history.canGoBack(passage.name),
            STORE.state.history.pagesHash,
            STORY_STORE.story.passageHash
        );
    }

    /**
     * Исполнить скрипты и вывести их результат, если нужно
     * @param viewPassage
     */
    private execScripts(viewPassage: ITwinePassage) {
        console.log(`${viewPassage.name} execScripts........`);

        const context = STORE.state.gameVars;

        this.clearRunTimeTextBuffer(); // очищаем буффер рантаймовых текстов

        // ищем строки, которые должны исполняться
        viewPassage.content = viewPassage.content
            .replace(REGEXP.exeScript,
                (match, catched) => {
                    let command = catched.trim();
                    const isInline = command[0] == WONDER.inlineStart;
                    if (isInline) command = "return " + command.substring(1);
                    const result = this.exeScript(command, context);

                    const textBuffer: string = this.getRunTimeTextsFromBuffer();
                    const render = isInline ? result : textBuffer;
                    return render;
                });
        console.log(`....... /execScripts`);
    }

    /********************
     *  STATE MANAGEMENT
     *******************/


    /********
     *  inline texts
     *********/
    private getRunTimeTextsFromBuffer() {
        const textBuffer = RUNTIME_STORE.textBuffer;
        let texts = '';
        while (textBuffer.length > 0) {
            texts += textBuffer.shift();
        }
        return texts;
    }

    private clearRunTimeTextBuffer() {
        RUNTIME_STORE.textBuffer = [];
    }

    /**************************
     *  userScriptApi commands
     *********************/
    private execUserScriptCommands() {
        console.log('execUserScriptCommands...');
        const commands = RUNTIME_STORE.commands;
        while (commands.length > 0) {
            this.execSingleUserCommand(commands.shift())
        }
    }

    private execSingleUserCommand(command: IRunTimeCommand) {
        console.log('...command', command.name, command.data);
        switch (command.name) {
            case UserScriptCommand.enableExternalApi:
                this.stateRepo.enableExternalApi(command.data)
                break;
            case UserScriptCommand.saveSlot:
                const saveName = command.data != null ? command.data : '_default'
                this.saveName(saveName);
                break;
            case UserScriptCommand.autoSave:
                this.isAutoSave = command.data === true;
                break;
            case UserScriptCommand.autoLoad:
                this.isAutoLoad = command.data === true;
                break;
            case UserScriptCommand.save:
                if (this.isStatePreload()) return;
                else this.saveGameState();
                break;
            case UserScriptCommand.load:
                if (this.isStatePreload()) return;
                else {
                    this.isLoading = true;
                    then(() => this.loadGameState());
                }
                break;
            case UserScriptCommand.collectionRule:
                this.collections.addRule(command.data)
                break;
            case UserScriptCommand.music:
                this.audioPlayer.music(
                    command.data.url,
                    command.data.volume);
                break;
            case UserScriptCommand.musicFor:
                this.audioPlayer.musicFor(
                    command.data.hashName,
                    command.data.url,
                    command.data.volume);
                break;
            case UserScriptCommand.sound:
                this.audioPlayer.sound(
                    command.data.url,
                    command.data.volume);
                break;
            case UserScriptCommand.musicStop:
                this.audioPlayer.stop();
                break;
            case UserScriptCommand.start:
                setTimeout(() => {
                    this.restart(command.data.name);
                }, command.data.delay);
                break;
            case UserScriptCommand.pageAdd:
                this.preprocessor.addRule({
                    tag: command.data.tag,
                    text: command.data.text,
                    text2: '',
                    position: PreprocessPosition.end
                })
                break;
            case UserScriptCommand.pageBefore:
                this.preprocessor.addRule({
                    tag: command.data.tag,
                    text: command.data.text,
                    text2: '',
                    position: PreprocessPosition.start
                })
                break;
            case UserScriptCommand.pageWrap:
                this.preprocessor.addRule({
                    tag: command.data.tag,
                    text: command.data.text,
                    text2: command.data.text2,
                    position: PreprocessPosition.around
                })
                break;
            default:
                console.warn('unhandled userScriptApi command:: ', command.name, command.data);
        }
    }

    isStatePreload(): boolean {
        return STORE.state == null
            || STORE.state.history == null
            || STORE.state.history.pages == null
            || STORE.state.history.pages.length == 0;
    }

    /**************************
     *  save/load functions
     *********************/
    private saveName(saveName: string) {
        if (saveName != null) this.gameSaveName = saveName;
        console.log('saveName ' + saveName)
    }

    private saveGameState() {
        this.stateRepo.save(
            this.getGameSaveName(),
            STORE.state,
            messageHandler,
            messageHandler
        )
    }

    private saveUserState() {
        this.stateRepo.save(
            this.getUserSaveName(),
            STORE.user,
            messageHandler,
            messageHandler
        )
    }

    private loadGameState() {
        this.isLoading = true;
        this.stateRepo.load(
            this.getGameSaveName(),
            state => {
                this.isLoading = false;
                this.onGameStateLoad(state)
            },
            (e) => {
                this.isLoading = false;
                console.warn('loadGameState error ::' + e);
            }
        )
    }

    private getGameSaveName(): string {
        return gameSavePrefix + this.gameSaveName;
    }

    private getUserSaveName(): string {
        return userSavePrefix + userSaveSlot;
    }

    private autoSave() {
        if (!this.isAutoSave) return;
        if (this.isLoading) return;

        console.log('auto saving.......', STORE.state, STORE.user);
        this.saveGameState();
        this.saveUserState();
    }

    /**************************
     *  рестарт
     *  - сбрасывает переменные к началу
     *  - сбрасывает историю страниц, включая посещенные
     *  - оставляет коллекции
     *********************/
    private restart(name: string) {
        const reState: IAppState = new AppState();
        // - сбрасывает переменные к началу
        this.exeScript(STORY_STORE.story.script, reState.gameVars);

        console.log('reState', reState);

        // - обновляем стейт
        this.updateGameState(reState);

        //... переходим к странице
        const startName = name != null ? name : STORY_STORE.story.startPassageName;
        this.onClick(startName);

    }

    /**************************
     *  ..
     *********************/
}

// используется для уменьшения нагрузки
function then(fn: Function) {
    setTimeout(fn, 0);
}

function messageHandler(message: string) {
    console.log(message)
}
