import type { Entity, EntityBuilder } from "@js/dataModels/entity";
import { EntityGrid, EntityGridAction } from "@js/grids/entityGrid";
import type EntityApiClient from "@js/api/entityApiClient";
import { useRouter } from "vue-router";
import type { Ref } from "vue";

export type ConstructorParams<TEntity extends Entity<T>, T> = {
    entity: any;
    onEntityLoaded: () => void;
    provideEntityBuilder: EntityBuilder<TEntity, T>;
    showEntity: Ref<boolean>;
    entityApiClient: any;
    onError: (any) => void;
    onEntityUpdated: () => void;
    isEditingEntityInline: Ref<boolean>;
    isMobile: () => boolean;
};

//This is the base class for entity create/update behaviour. You can create your own versions of create/update behaviour deriving from it.
export abstract class EntityUpdateStrategy<TEntity extends Entity<T>, T> {
    entity: Ref<TEntity>;
    onEntityLoaded: () => void;
    provideEntityBuilder: EntityBuilder<TEntity, T>;
    showEntity: Ref<boolean>;
    entityApiClient: EntityApiClient<TEntity, T>;
    onError: (any) => void;
    onEntityUpdated: () => void;
    isEditingEntityInline: Ref<boolean>;
    isMobile: () => boolean;

    $router = useRouter();

    constructor(params: ConstructorParams<TEntity, T>) {
        this.entity = params.entity;
        this.onEntityLoaded = params.onEntityLoaded;
        this.provideEntityBuilder = params.provideEntityBuilder;
        this.showEntity = params.showEntity;
        this.entityApiClient = params.entityApiClient;
        this.onError = params.onError;
        this.onEntityUpdated = params.onEntityUpdated;
        this.isEditingEntityInline = params.isEditingEntityInline;
        this.isMobile = params.isMobile;
    }

    public abstract doAdd(): void; //Reaction to user clicked on Add entity button
    public abstract doEdit(entityId: T): Promise<void>; //Reaction to user clicked on Edit entity button
    public abstract doViewDetails(entityId: T): void; //Reaction to user clicked on View entity details button
    public abstract doEntitySaved(): void; //Reaction on entity saved
    public abstract doReturn(); //Reaction on "Back"button
}

export abstract class EntityUpdateStrategyWithGrid<
    TEntity extends Entity<T>,
    T,
    TGrid extends EntityGrid,
> extends EntityUpdateStrategy<TEntity, T> {
    entityGrid: TGrid;

    constructor(params: ConstructorParams<TEntity, T>, entityGrid: TGrid) {
        super(params);
        this.entityGrid = entityGrid;
    }
}

export class EntityUpdateUsingModal<TEntity extends Entity<T>, T> extends EntityUpdateStrategy<TEntity, T> {
    public doAdd(): void {
        this.entity.value = new this.provideEntityBuilder();
        this.onEntityLoaded();
        this.showEntity.value = true;
    }

    public async doEdit(entityId: any): Promise<void> {
        try {
            this.entity.value = await this.entityApiClient.getEntity(entityId);
            this.onEntityLoaded();
            this.showEntity.value = true;
        } catch (e) {
            this.onError(e);
        }
    }

    public doViewDetails(entityId: any): void {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        //Do nothing? Or the reaction should be the same as doEdit?
    }

    public doEntitySaved(): void {
        this.onEntityUpdated();
    }

    public doReturn() {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        //Do nothing? Or should we close the add/edit modal window here?
    }
}

//Add/Update entity in a modal
export class EntityUpdateUsingModalAndGrid<
    TEntity extends Entity<T>,
    T,
    TGrid extends EntityGrid,
> extends EntityUpdateUsingModal<TEntity, T> {
    entityGrid: TGrid;

    constructor(params: ConstructorParams<TEntity, T>, entityGrid: TGrid) {
        super(params);
        this.entityGrid = entityGrid;
    }

    public doAdd(): void {
        super.doAdd();
        this.entityGrid.rememberCurrentPageBeforeGridAction(EntityGridAction.EntityAdd);
    }

    public async doEdit(entityId: any): Promise<void> {
        await super.doEdit(entityId);
        this.entityGrid.rememberCurrentPageBeforeGridAction(EntityGridAction.EntityEdit);
    }
}

// Can mix and match modal behaviour with separate page behaviour
export class EntityUpdateUsingSeparatePage<TEntity extends Entity<T>, T> extends EntityUpdateUsingModal<TEntity, T> {
    public readonly listView?: string;
    public readonly addView?: string;
    public readonly editView?: string;
    public readonly detailsView?: string;

    constructor(
        superParams: ConstructorParams<TEntity, T>,
        paths?: {
            listView?: string;
            addView?: string;
            editView?: string;
            detailsView?: string;
        },
    ) {
        super(superParams);

        this.listView = paths?.listView;
        this.addView = paths?.addView;
        this.editView = paths?.editView;
        this.detailsView = paths?.detailsView;
    }

    public doAdd(): void {
        if (this.addView) {
            this.$router.push({
                name: this.addView,
                params: { id: this.provideEntityBuilder.idDefault() as any },
            });
        } else {
            super.doAdd();
        }
    }

    public async doEdit(entityId: any): Promise<void> {
        if (this.editView) {
            this.$router.push({ name: this.editView, params: { id: entityId } });
        } else {
            await super.doEdit(entityId);
        }
    }

    public doViewDetails(entityId: any): void {
        if (this.detailsView) {
            this.$router.push({ name: this.detailsView, params: { id: entityId } });
        } else {
            super.doViewDetails(entityId);
        }
    }

    public doEntitySaved(): void {
        super.doEntitySaved();
        this.doReturn();
    }

    public doReturn() {
        if (this.listView) {
            this.$router.push({ name: this.listView });
        }
    }
}

export class EntityUpdateUsingSeparatePageAndGrid<
    TEntity extends Entity<T>,
    T,
    TGrid extends EntityGrid,
> extends EntityUpdateUsingSeparatePage<TEntity, T> {
    entityGrid: TGrid;

    constructor(
        params: ConstructorParams<TEntity, T>,
        entityGrid: TGrid,
        paths?: {
            listView?: string;
            addView?: string;
            editView?: string;
            detailsView?: string;
        },
    ) {
        super(params, paths);
        this.entityGrid = entityGrid;
    }

    public doAdd(): void {
        super.doAdd();
        this.entityGrid.rememberCurrentPageBeforeGridAction(EntityGridAction.EntityAdd);
    }

    public async doEdit(entityId: any): Promise<void> {
        await super.doEdit(entityId);
        this.entityGrid.rememberCurrentPageBeforeGridAction(EntityGridAction.EntityEdit);
    }
}

//Add/Update entity in a grid inline
export class EntityUpdateUsingInlineGrid<
    TEntity extends Entity<T>,
    T,
    TGrid extends EntityGrid,
> extends EntityUpdateUsingModalAndGrid<TEntity, T, TGrid> {
    public doAdd(): void {
        super.doAdd();
        this.isEditingEntityInline.value = !this.isMobile();
    }

    public async doEdit(entityId: any): Promise<void> {
        await super.doEdit(entityId);
        this.isEditingEntityInline.value = !this.isMobile();
    }
}
