export abstract class EntityGrid {
    constructor() {}

    abstract rememberCurrentPageBeforeGridAction(action: EntityGridAction);
    abstract restoreCurrentPage();
    abstract setInstance(gridRef: unknown);
}

export enum EntityGridAction {
    EntityAdd = 1,
    EntityEdit = 2,
    EntityDelete = 3,
}
