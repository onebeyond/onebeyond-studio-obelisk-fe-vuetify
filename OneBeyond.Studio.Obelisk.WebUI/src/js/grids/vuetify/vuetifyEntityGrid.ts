import { EntityGrid, EntityGridAction } from "../entityGrid";
import { DataAdaptor } from "./dataAdaptor";

//This interface represents functionality of a vue-tables-2 ServerTable control we're using at the moment
export interface VueGrid {
    page: number;
    refresh(): void;
}

//encapsulates all the logic related to the grid vue component we're currently using in the template (vue-server-grid)
export class VuetifyEntityGrid extends EntityGrid {
    protected _instance: VueGrid | null; //This is an instance of the backing grid, e.g. vue server grid
    public data: Array<any> = [];
    public count: number = 0;
    public isLoading: boolean = false;
    public currentPage: number = 1; //Currently selected page
    public currentOrderByField: string = "";
    public currentOrderByDescending: boolean = false;

    private readonly _columns: object[] = []; //List of columns to be displayed
    private _dataAdaptor: DataAdaptor | null;
    private _previousPage: number = 1; // used to return to the correct grid page after an entity was added/edited/deleted

    query = {
        limit: 10,
        page: this.currentPage,
        orderBy: "",
        ascending: ""
    };

    search: any;

    constructor(columns: object[], isGlobalSearch: boolean) {
        super();

        this._instance = null; //Note, we set instance separately, when the vue component is mounted already;
        this._dataAdaptor = null;

        this._columns = this._columns.concat(columns);
        this._columns.push({ text: "", value: "actions" });

        if (isGlobalSearch) {
            this.search = {};
        } else {
            this.search = "";
        }
    }

    public setInstance(instance: any): void {
        this._instance = instance;
    }

    public get columns(): object[] {
        return this._columns;
    }

    public get instance(): VueGrid {
        if (this._instance == null) {
            throw new Error("Grid instance is not set");
        }
        return this._instance;
    }

    public rememberCurrentPageBeforeGridAction(gridAction: EntityGridAction): void {
        switch (gridAction) {
            case EntityGridAction.EntityAdd:
                this._previousPage = 1;
                break;
            case EntityGridAction.EntityEdit:
                this._previousPage = this.instance.page;
                break;
            case EntityGridAction.EntityDelete:
                this._previousPage = 1;
                break;
        }
    }

    public async restoreCurrentPage(): Promise<void> {
        //this.currentPage = this._previousPage;
        this.query.page = this._previousPage;
        await this.refresh();
    }

    public initDataAdaptor(apiUrl: string, errorCallback: Function): void {
        this._dataAdaptor = new DataAdaptor(apiUrl, errorCallback);
    }

    public async refresh(): Promise<void> {
        try {
            this.isLoading = true;
            const response = await this._dataAdaptor?.executeApi(this.query, this.search);
            this.data = response.data;
            this.count = response.count;
        } finally {
            this.isLoading = false;
        }
    }

    public async changePage(): Promise<void> {
        this.query.page = this.currentPage;
        await this.refresh();
    }

    public async changePageItemCount(count: number): Promise<void> {
        if (this.query.limit !== count) {
            this.query.limit = count < 0 ? null : count; // Set to null when "All" option is selected
            await this.refresh();
        }
    }

    public async changeOrderByField(column: string): Promise<void> {
        this.currentOrderByField = column;
        this.query.orderBy = column;
        await this.refresh();
    }

    public async changeOrderByDirection(sortDesc: boolean): Promise<void> {
        this.currentOrderByDescending = sortDesc;
        this.query.ascending = sortDesc ? "desc" : "";
        await this.refresh();
    }
}
