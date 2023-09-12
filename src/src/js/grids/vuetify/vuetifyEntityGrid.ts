import { EntityGrid, EntityGridAction } from "../entityGrid";
import { DataAdaptor } from "./dataAdaptor";
import type { CrudAction, Command, Column, Query, VuetifyGrid, Filter } from "@js/grids/vuetify/types";

//encapsulates all the logic related to the grid vue component we're currently using in the template
export class VuetifyEntityGrid extends EntityGrid {
    protected _instance: VuetifyGrid | null; //This is an instance of the backing grid, e.g. vue server grid
    public data: unknown[] = [];
    public count: number = 0;
    public isLoading: boolean = false;
    public currentOrderByField: string = "";
    public currentOrderByDescending: boolean = false;
    public commands: Command[] = [];
    public hasGlobalSearchEnabled: boolean = false;
    public hasColumnComplexFilter: boolean = false;
    public hasColumnSimpleFilter: boolean = false;
    public query: Query = {
        limit: 10,
        page: 1,
        orderBy: [],
    };
    public extraFilters: Filter[] = [];

    public search: string = "";

    private readonly _columns: Column[] = [];
    private _dataAdaptor: DataAdaptor | null;
    private _previousPage: number = 1; // used to return to the correct grid page after an entity was added/edited/deleted
    private _hasActionColumn = false;
    private refreshMethod: Function | null = null;

    constructor() {
        super();

        this._instance = null; //Note, we set instance separately, when the vue component is mounted already;
        this._dataAdaptor = null;
    }

    public setInstance(instance: unknown): void {
        this._instance = instance as VuetifyGrid;
    }

    public get columns(): Column[] {
        const columns = [...this._columns];

        if (this._hasActionColumn) {
            columns.push({ title: "", key: "actions", sortable: false });
        }

        return columns;
    }

    public get instance(): VuetifyGrid {
        if (this._instance == null) {
            throw new Error("Grid instance is not set");
        }
        return this._instance;
    }

    public addColumn(column: Column): VuetifyEntityGrid {
        this._columns.push(column);

        return this;
    }

    public enableColumnComplexFilter(): VuetifyEntityGrid {
        this.hasColumnComplexFilter = true;
        return this;
    }

    public enableColumnSimpleFilter(): VuetifyEntityGrid {
        this.hasColumnSimpleFilter = true;
        return this;
    }

    public enableGlobalSearch(): VuetifyEntityGrid {
        this.hasGlobalSearchEnabled = true;
        return this;
    }

    public rememberCurrentPageBeforeGridAction(gridAction: EntityGridAction): void {
        switch (gridAction) {
            case EntityGridAction.EntityAdd:
                this._previousPage = 1;
                break;
            case EntityGridAction.EntityEdit:
                this._previousPage = this.query.page;
                break;
            case EntityGridAction.EntityDelete:
                this._previousPage = 1;
                break;
        }
    }

    public async restoreCurrentPage(): Promise<void> {
        this.query.page = this._previousPage;

        if (this.refreshMethod) {
            this.refreshMethod();
        }
    }

    public initDataAdaptor(apiUrl: string, errorCallback: Function): void {
        this._dataAdaptor = new DataAdaptor(apiUrl, errorCallback);
    }

    public async refresh(): Promise<void> {
        try {
            this.isLoading = true;
            const response = await this._dataAdaptor?.executeApi(this.query, this.search, this.extraFilters);
            this.data = response.data;

            if (response) {
                this.data = response.data;
                this.count = response.count;
            }
        } finally {
            this.isLoading = false;
        }
    }

    public setEditBehaviour(editAction: CrudAction): VuetifyEntityGrid {
        this._hasActionColumn = true;

        this.commands.push({
            buttonIcon: "mdi-pencil",
            buttonLabel: "Edit",
            action: editAction,
        });

        return this;
    }

    public setDeleteBehaviour(deleteAction: CrudAction): VuetifyEntityGrid {
        this._hasActionColumn = true;

        this.commands.push({
            buttonIcon: "mdi-trash-can",
            buttonLabel: "Delete",
            action: deleteAction,
        });

        return this;
    }

    public setViewDetailsBehaviour(viewAction: CrudAction): VuetifyEntityGrid {
        this._hasActionColumn = true;

        this.commands.push({
            buttonIcon: "mdi-eye",
            buttonLabel: "View",
            action: viewAction,
        });

        return this;
    }

    public setInitialSorting(key: string, direction: "asc" | "desc"): VuetifyEntityGrid {
        this.query.orderBy.push({
            key: key,
            order: direction,
        });

        return this;
    }

    public addCustomCommand(command: Command) {
        this._hasActionColumn = true;

        this.commands.push(command);
    }

    public setRefreshMethod(refresh: Function) {
        this.refreshMethod = refresh;
    }
}
