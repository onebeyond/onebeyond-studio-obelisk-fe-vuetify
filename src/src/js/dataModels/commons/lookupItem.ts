import type ILookupItem from "@js/dataModels/commons/ILookupItem";

export default class LookupItem<T> implements ILookupItem<T> {
    id: T;
    name: string = "";

    constructor(id: T, name: string) {
        this.id = id;
        this.name = name;
    }
}
