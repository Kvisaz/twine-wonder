/**
 *  Preprocessor
 *  обрабатывает страницу до запуска скриптов
 *  так можно модифицировать любой пассаж
 */
import {IPreprocessRule, IPreprocessRuleMap, PreprocessPosition} from './PreprocessorInterfaces';
import {ITwinePassage} from '../../../abstract/TwineModels';

export class Preprocessor {
    private rulesMap: IPreprocessRuleMap;

    // начало истории - обнуляем скрипты
    beforeStoryLoad() {
        this.rulesMap = {};
    }

    addRule(rule: IPreprocessRule) {
        this.getRules(rule.tag).push(rule);
    }

    // контент модифицируется, поэтому обязательно брать копию
    exec(passageCopy: ITwinePassage) {
        console.log('preprocessing....');
        const tags = this.getTags(passageCopy);
        tags.forEach(tag => {
            const rules = this.getRules(tag);
            rules.forEach(rule => this.useRule(passageCopy, rule));

        })
    }

    private initTag(tag: string) {
        if (this.rulesMap[tag] == null) {
            this.rulesMap[tag] = [];
        }
    }

    private getRules(tag: string): Array<IPreprocessRule> {
        this.initTag(tag);
        return this.rulesMap[tag];
    }

    private getTags(passage: ITwinePassage): Array<string> {
        return passage.tags.split(' ');
    }

    private useRule(passage: ITwinePassage, rule: IPreprocessRule) {
        const text2 = rule.text2 != null ? rule.text2 : '';
        switch (rule.position) {
            case PreprocessPosition.start:
                passage.content = rule.text + passage.content;
                break;
            case PreprocessPosition.end:
                passage.content = passage.content + rule.text;
                break;
            case PreprocessPosition.around:
                passage.content = rule.text + passage.content + text2;
                break;
            default:
                console.warn('unknown PreprocessPosition - ' + rule.position);
        }
    }
}
