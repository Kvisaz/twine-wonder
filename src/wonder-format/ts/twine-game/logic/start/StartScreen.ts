import {ITwinePassage} from '../../../abstract/TwineModels';
import {PRELOAD_PAGE_TEMPLATE, WONDER} from '../../../Constants';
import {IStartScreenOptions} from './StartScreenInterfaces';
import {WonderButtonCommand} from '../LogicConstants';

const defaultStartScreenOptions: IStartScreenOptions = {
    newGame: 'New Game',
    continue: 'Continue',
    continueOff: false,
    title: 'Welcome to game',
    text: 'Choice your destiny:'
}


export class StartScreen {
    private options: IStartScreenOptions;
    private readonly passage: ITwinePassage;

    constructor() {
        this.passage = {
            pid: WONDER.startScreenId,
            position: '',
            name: WONDER.startScreenId,
            tags: WONDER.startScreenId,
            size: '',
            content: PRELOAD_PAGE_TEMPLATE
        }

        this.options = {
            ...defaultStartScreenOptions
        }
    }

    userOptions(options: Partial<IStartScreenOptions>){
        console.log('StartScreen userOptions....')
        this.options = {
            ...defaultStartScreenOptions,
            ...options
        }
    }

    onGameStateLoaded(hasPreviousSave: boolean) {
        console.log('StartScreen onGameStateLoaded....');
        const previousContinueOff = this.options.continueOff == true;
        const continueOff = previousContinueOff || !hasPreviousSave;
        this.options = {
            ...this.options,
            continueOff: continueOff
        }
        this.setup(this.options);
    }

    private setup(options: Partial<IStartScreenOptions>) {
        console.log('StartScreen setup....')
        this.passage.content = this.createContent(options);
    }

    getPassage() {
        return this.passage;
    }

    /****************
     * PRIVATE
     ***************/
    private createContent(options: Partial<IStartScreenOptions>): string {
        const title = this.getTitleCode(options);
        const text = this.getTextCode(options);
        const buttonNewGame = this.getNewGameButtonCode(options);
        const buttonContinue = options.continueOff == true ? '' : this.getContinueButtonCode(options);

        return title + text + buttonContinue + buttonNewGame;
    }

    private getString(str: string, def: string): string {
        return str == null ? def.trim() : str;
    }

    private getButtonCode(title: string, id: string, command: WonderButtonCommand): string {
        return `<div id="${id}" class="${WONDER.buttonClass}" data-command="${command}">${title}</div>`;
    }

    private getNewGameButtonCode(options: Partial<IStartScreenOptions>): string {
        const text = this.getString(options.newGame, 'New Game');
        return this.getButtonCode(text, WONDER.newGameBtId, WonderButtonCommand.newGame);
    }

    private getContinueButtonCode(options: Partial<IStartScreenOptions>): string {
        const text = this.getString(options.continue, 'Continue');
        return this.getButtonCode(text, WONDER.continueBtId, WonderButtonCommand.continue);
    }

    private getTitleCode(options: Partial<IStartScreenOptions>): string {
        const text = this.getString(options.title, '');
        if (text.length == 0) return '';
        else return `<h1>${text}</h1>`
    }

    private getTextCode(options: Partial<IStartScreenOptions>): string {
        const text = this.getString(options.text, '');
        if (text.length == 0) return '';
        else return `<p>${text}</p>`
    }
}
