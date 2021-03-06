import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData, PreloadPageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {UserScriptApi} from './logic/userscript/UserScriptApi';
import {WonderHistory} from './logic/WonderHistory';
import {AppState, IAppState, IUserState, UserState} from './AppState';
import {RUNTIME_STORE, STORE, STORY_STORE} from './Stores';
import {parseTwineData} from '../parser/TwineParser';
import {StateRepository} from './logic/repository/StateRepository';
import {IRunTimeCommand} from '../abstract/WonderInterfaces';
import {UserScriptCommand} from './logic/userscript/UserScriptCommands';
import {Collections} from './logic/collections/Collections';
import {AudioPlayer} from './logic/AudioPlayer';
import {Preprocessor} from './logic/preprocessor/Preprocessor';
import {PreprocessPosition} from './logic/preprocessor/PreprocessorInterfaces';
import {PostMessageApi} from './logic/PostMessageApi';
import {
    GameMenuButtonDelay,
    PassageType,
    SaveNameAuto,
    SaveNameDefault,
    SavePrefixGame,
    SavePrefixGameAuto,
    SavePrefixUser,
    WonderButtonCommand
} from './logic/LogicConstants';
import {IPassagePreparedCallback, IWonderButtonData} from './logic/LogicInterfaces';
import {StartScreen} from './logic/start/StartScreen';
import {GameMenu} from './logic/menu/GameMenu';
import {PostMessages} from './PostMessages';
import {
    BrowserMenuButtons,
    DesktopMenuButtons,
    MenuGameButtonLabel,
    MenuGamTitleLabel
} from './logic/menu/GameMenuConstants';
import {IKvisazLibButton, IKvisazLibDialogOptions} from 'kvisaz-dialog/src/kvisaz';
import {Strings} from '../../Strings';
import {UserStateUtils} from './UserStateUtils';
import {GameMenuCSS} from './logic/menu/GameMenuCSS';

export class GameLogic {
    private readonly gameConfig;
    private readonly history: WonderHistory;
    private readonly collections: Collections;
    private readonly preprocessor: Preprocessor;
    private readonly postMessageApi: PostMessageApi;
    private readonly stateRepo: StateRepository;
    private readonly audioPlayer: AudioPlayer;
    private readonly userScriptApi: UserScriptApi;

    private defaultGameVars = {}; // дефолтные переменные в начале игры, после загрузки истории и выполнения её скрипта

    private isUserSaveDisabledFlag = false; // запрет на сейвы
    private isLoading = false; // заказана загрузка
    private gameSaveName = SaveNameDefault;

    private screenType: PassageType;
    private onScreenPrepareCallback: IPassagePreparedCallback;

    private readonly startScreen: StartScreen;
    private readonly gameMenu: GameMenu;
    private gameMenuButtons: Array<IWonderButtonData>;
    private isDesktop = false;

    constructor() {
        console.log('GameLogic constructor.....')
        this.gameConfig = new GameConfig();
        this.startScreen = new StartScreen();
        this.gameMenu = new GameMenu();
        this.history = new WonderHistory();
        this.collections = new Collections();
        this.preprocessor = new Preprocessor();
        this.postMessageApi = new PostMessageApi();
        this.stateRepo = new StateRepository(this.postMessageApi);
        this.audioPlayer = new AudioPlayer();
        this.userScriptApi = new UserScriptApi(this.postMessageApi);

        this.gameMenuButtons = BrowserMenuButtons;

        // @ts-ignore
        window.w = this.userScriptApi;
        // @ts-ignore
        window.Wonder = window.w;

        STORE.state = null;
        STORE.user = null;
        STORY_STORE.story = null;

        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, passage: ITwinePassage) => this.onPassagePrepared(passage))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onClick(id))
            .sub(GameEvents.onBackClick, (message) => this.onBackClick())
            .sub(GameEvents.onButtonClick, (message, dataset) => this.onButtonClick(dataset))
    }

    start(name?: string) {
        this.showPreloader()
            .then(preloadPassage => this.startParsing(preloadPassage))
            .then(story => this.onStoryLoad(story))
            .then(() => this.preloadUserState())
            .then(userState => this.initUserState(userState))
            .then(() => this.preloadGameState())
            .then(gameState => this.initGameState(gameState))
            .then(() => this.showStartScreen());
    }

    private showPreloader(): Promise<ITwinePassage> {
        return new Promise((resolve, reject) => {
            console.log('preloading...');
            this.isUserSaveDisabledFlag = true;
            const preloadViewData = new PreloadPageViewData();
            this.screenType = PassageType.preload;
            this.onScreenPrepareCallback = resolve;
            this.startPage(preloadViewData);
        });
    }

    private startParsing(preloadPassage: ITwinePassage): Promise<ITwineStory> {
        return new Promise((resolve, reject) => {
            console.log('startParsing...', preloadPassage);
            const story = parseTwineData();
            resolve(story);
        });
    }

    private onStoryLoad(story: ITwineStory): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('onStoryLoad...', story);
            STORY_STORE.story = story;
            resolve();
        })
    }


    private preloadUserState(): Promise<IUserState> {
        return new Promise((resolve, reject) => {
            console.log('preloadUserState...');

            STORE.user = new UserState(); // создаем пустую юзердату
            this.execStoryScript(); // исп

            this.stateRepo.load(
                this.getUserDataSaveName(),
                data => resolve(data),
                e => {
                    console.warn('preloadUserState error ' + e);
                    resolve(null)
                }
            )
        })
    }

    private initUserState(state: IUserState): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('initUserState...', state);
            if (state != null) {
                STORE.user = {
                    ...STORE.user,
                    ...state
                }

                UserStateUtils.restoreCollectedAsVisited(STORE.user);
            }
            console.log('initUserState...  STORE.user', STORE.user);

            this.collections.onUserStateReady(STORY_STORE.story, STORE.user.visitedPageMap);
            resolve();
        })
    }

    private preloadGameState(): Promise<IAppState> {
        return new Promise((resolve, reject) => {
            console.log('preloadGameState...');
            this.stateRepo.load(
                this.getGameAutoSaveName(),
                state => resolve(state),
                message => {
                    console.warn('preloadGameState error' + message);
                    resolve(null)
                }
            )
        })
    }

    private initGameState(state: IAppState): Promise<void> {
        return new Promise((resolve, reject) => {
            const hasSave = state != null;
            RUNTIME_STORE.hasSave = hasSave;
            this.startScreen.onGameStateLoaded(hasSave);

            STORE.state = new AppState();
            STORE.state.gameVars = JSON.parse(JSON.stringify(this.defaultGameVars));

            resolve();
        })
    }

    private updateGameState(state: IAppState) {
        if (state == null) return;
        STORE.state = state;
        this.collections.onStateUpdate();
    }

    private onGameStateLoad(state: IAppState) {
        console.log('onGameStateLoad...', state);
        this.updateGameState(state);
        this.startTwineGame();
    }

    private execStoryScript() {
        this.preprocessor.beforeInitUserScript();
        this.exeScript(STORY_STORE.story.script, this.defaultGameVars);
        this.execUserScriptCommands();
    }

    /***********************
     * Show Start Screen
     ***********************/
    private showStartScreen() {
        console.log('start screen..........');
        this.screenType = PassageType.startScreen;
        this.startPage({
            passage: this.startScreen.getPassage(),
            canGoBack: false,
            config: this.gameConfig,
            gameVars: STORE.state.gameVars,
            visitedPagesMap: {},
            pagesMap: {}
        });

        setTimeout(() => {
            this.gameMenu.setup({
                windowOptions: this.getMenuOptions()
            })
        }, GameMenuButtonDelay)
    }

    /***********************
     * Start Twine Game
     ***********************/
    private getStartPage(story: ITwineStory, state: IAppState): string {
        const lastPage = this.history.getLastExisting();
        return lastPage != null ? lastPage : story.startPassageName;
    }

    private startTwineGame(name?: string) {
        this.screenType = PassageType.game;
        let startName = name != null ? name : this.getStartPage(STORY_STORE.story, STORE.state)
        this.isUserSaveDisabledFlag = false;
        this.onClick(startName);
    }

    private startPage(pageViewData: PageViewData) {
        EventBus.emit(GameEvents.preparePassage, pageViewData);
    }

    /******************************
     *  Страница готова к показу
     ****************************/
    private onPassagePrepared(passage: ITwinePassage) {
        console.log(`.................................... ${passage.name} ...prepared`,);
        const SCREEN = this.screenType;
        switch (SCREEN) {
            case PassageType.preload:
                this.onScreenPrepareCallback(passage);
                break;
            case PassageType.startScreen:
                //
                break;
            case PassageType.game:
                this.onGameScreenPrepareCallback(passage);
                break;
            default:
                console.warn('unknown screenType ' + SCREEN);
        }
        EventBus.emit(GameEvents.showPassage, passage);
    }

    private onGameScreenPrepareCallback(passage: ITwinePassage) {
        this.autoSave(); // обязательно тут, чтобы проверять флаги лоадинга и сейва
        this.audioPlayer.musicCheck(passage.name);
    }

    /******************************
     *  Реакция на клик пользователя
     ****************************/

    private onClick(name: string) {
        console.log('onClick', name);
        // копия для иммутабельности
        const passage = JSON.parse(JSON.stringify(STORY_STORE.story.passageHash[name]));

        this.collections.onPassage(passage);
        this.history.add(name); // текущий узел идёт в историю
        STORE.user.visitedPageMap[name] = true; // помечаем общую посещаемость

        this.preprocessor.exec(passage);
        // тут могут быть вызваны команды
        // - load
        // - restart
        const viewData = this.execPassage(passage);
        this.startPage(viewData);
    }


    private onBackClick() {
        this.history.pop(); // текущий узел уходит из истории
        const name = this.history.getLast();
        this.onClick(name);
    }

    private onButtonClick(dataset: IWonderButtonData) {
        console.log('onButtonClick ', dataset);
        const COMMAND: WonderButtonCommand = dataset.command;
        if (COMMAND == WonderButtonCommand.newGame) {
            this.startTwineGame();
            return;
        }

        if (COMMAND == WonderButtonCommand.continue) {
            this.loadGameState(this.getGameAutoSaveName());
            return;
        }

        if (COMMAND == WonderButtonCommand.restart) {
            this.restartAsync(dataset.name, dataset.delay)
            return;
        }
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
        console.log('...command', command.name);
        switch (command.name) {
            case UserScriptCommand.enableExternalApi:
                this.isDesktop = command.data == true;
                this.stateRepo.enableExternalApi(command.data)
                break;
            case UserScriptCommand.saveSlot:
                const saveName = command.data != null ? command.data : '_default'
                this.saveName(saveName);
                break;
            case UserScriptCommand.save:
                if (this.isUserSaveDisabled()) return;
                else this.saveGameState(command.data);
                break;
            case UserScriptCommand.load:
                // todo make button
                /*if (this.isStatePreloading()) return;
                else {
                    this.isLoading = true;
                    this.loadGameState();
                }*/
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
                this.restartAsync(command.data.name, command.data.delay);
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
            case UserScriptCommand.startPage:
                this.startScreen.userOptions(command.data);
                break;
            default:
                console.warn('unhandled userScriptApi command:: ', command.name, command.data);
        }
    }

    isUserSaveDisabled(): boolean {
        return this.isUserSaveDisabledFlag;
    }

    /**************************
     *  save/load functions
     *********************/
    private saveName(saveName: string) {
        if (saveName != null) this.gameSaveName = saveName;
        console.log('saveName ' + saveName)
    }

    private saveGameState(saveName?: string) {
        if (saveName == null) saveName = this.getGameSaveName();
        this.stateRepo.save(
            saveName,
            STORE.state,
            messageHandler,
            messageHandler
        )
    }

    private saveUserState() {
        console.log('--------- saveUserState on', this.history.getLast());
        this.stateRepo.save(
            this.getUserDataSaveName(),
            STORE.user,
            messageHandler,
            messageHandler
        )
    }

    private loadGameState(saveName: string) {
        this.isLoading = true;
        this.stateRepo.load(
            saveName,
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

    private getGameName(): string {
        return STORY_STORE.story.name;
    }

    private getGameSaveName(): string {
        return SavePrefixGame + this.getGameName() + '-' + this.gameSaveName;
    }

    private getGameAutoSaveName(): string {
        return SavePrefixGameAuto + this.getGameName() + '-' + SaveNameAuto;
    }

    private getUserDataSaveName(): string {
        return SavePrefixUser + this.getGameName() + '-' + SaveNameDefault;
    }

    private autoSave() {
        if (this.isLoading) return;

        console.log('auto saving.......', this.history.getLast(), STORE.state, STORE.user);
        const autoSaveName = this.getGameAutoSaveName();
        this.saveGameState(autoSaveName);
        this.saveUserState();
    }

    /**************************
     *  restart
     *********************/
    private restartAsync(name: string, delay: string) {
        const DELAY = delay != null ? parseInt(delay) : 0;
        setTimeout(() => this.restart(name), DELAY);
    }

    private restart(name: string) {
        STORE.state.gameVars = JSON.parse(JSON.stringify(this.defaultGameVars));
        STORE.state.history.pages = [];
        STORE.state.history.pagesHash = {};
        this.startTwineGame(name);
    }


    /**************************
     *  GameMenu
     *********************/
    private getMenuOptions(): IKvisazLibDialogOptions {
        if (this.isDesktop) return this.getDesktopMenuOptions();
        else return this.getBrowserMenuOptions();
    }

    private getMenuCommonOptions(): Partial<IKvisazLibDialogOptions> {
        return {
            addClass: GameMenuCSS.winClass,
            title: Strings.settingsTitle
        }
    }

    private getBrowserMenuOptions(): IKvisazLibDialogOptions {
        return {
            ...this.getMenuCommonOptions(),
            buttons: [
                {
                    text: Strings.settingsContinue,
                    callback: () => {
                        console.log(`click ${Strings.settingsContinue}`);
                    },
                },
                {
                    text: Strings.settingsRestart,
                    callback: () => {
                        console.log(`click ${Strings.settingsRestart}`);
                        this.restartAsync(null, '' + 0);
                    },
                    warning: Strings.settingsRestartWarning
                }
            ]
        }
    }

    private getDesktopMenuOptions(): IKvisazLibDialogOptions {
        const options = this.getBrowserMenuOptions();
        const desktopButtons: Array<IKvisazLibButton> = [
            {
                text: Strings.settingsFullScreen,
                callback: () => {
                    console.log(`click ${Strings.settingsFullScreen}`);
                    this.postMessageApi.send(PostMessages.fullScreen, null);
                }
            },
            {
                text: Strings.settingsExit,
                callback: () => {
                    console.log(`click ${Strings.settingsExit}`);
                    this.postMessageApi.send(PostMessages.close, null);
                },
                warning: Strings.settingsExitWarning
            }
        ]

        options.buttons = [
            ...options.buttons,
            ...desktopButtons
        ]

        return options;
    }

    /**************************
     *  ..
     *********************/
}

function messageHandler(message: string) {
    console.log(message)
}
