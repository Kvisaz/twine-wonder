export class GameState {

}

export class GameConfig {
    uiParams: VisibleParams = [];
}

/**
 *  UI parameters
 *  - full parameter names and css selectors
 */
export type VisibleParams = Array<VisibleParameter>;

export class VisibleParameter {
    constructor(
        public name: string,
        public selector: string
    ) {
    }
}