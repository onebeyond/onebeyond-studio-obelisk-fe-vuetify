import { EntityGrid, EntityGridAction } from "@js/grids/entityGrid";
import type { EntityUpdateStrategyWithGrid, ConstructorParams } from "@js/entityCrud/entityUpdateStrategy";

import type { Entity, EntityBuilder } from "@js/dataModels/entity";
import type EntityApiClient from "@js/api/entityApiClient";
import { onMounted, ref, type Ref } from "vue";
import type ObVuetifyGrid from "@components/obComponents/grids/obVuetifyGrid.vue";
import useEntityCrud, { type OverridableFunctions } from "./useEntityCrud";

export default function useEntityGridCrud<TEntity extends Entity<T>, T, TGrid extends EntityGrid>(
    provideEntityBuilder: EntityBuilder<TEntity, T>,
    entityApiClient: EntityApiClient<TEntity, T>,
    tGrid: TGrid,
    gridComponent: Ref<InstanceType<typeof ObVuetifyGrid> | null>,
    entityUpdateStrategyBuilder: (
        params: ConstructorParams<TEntity, T>,
        entityGrid: TGrid,
    ) => EntityUpdateStrategyWithGrid<TEntity, T, TGrid>,
    overridableFunctions?: OverridableFunctions<T>,
) {
    const {
        entity,
        entityUpdateStrategy,
        isSaving,
        isLoading,
        isEditingEntityInline,
        showEntity,
        showDeleteEntity,

        provideGridUrl,
        onAddEntityButtonClicked,
        onEditEntityButtonClicked,
        onViewEntityDetailsButtonClicked,
        onDeleteEntityButtonClicked,
        onDeleteEntityCancelled,
        onBackButtonClicked,
        closeEntityModal,
        onEntityUpdated,
        onEntityDeleted,
        fetchData,
        saveEntity,
        deleteEntity,
        onError,
        alertVisible,
        isMobile,
    } = useEntityCrud(
        provideEntityBuilder,
        entityApiClient,
        getEntityUpdateStrategyBuilder(),
        provideOverridenFunctions(),
    );

    const gridInstance = ref<any>();

    function getEntityUpdateStrategyBuilder() {
        return (params: ConstructorParams<TEntity, T>) => entityUpdateStrategyBuilder(params, tGrid);
    }

    function provideOverridenFunctions() {
        return {
            onDeleteEntityButtonClickedOverride,
            onEntityUpdatedOverride,
            onEntityDeletedOverride,
            onEntityLoadedOverride: overridableFunctions?.onEntityLoadedOverride,
        };
    }

    onMounted(async (): Promise<void> => {
        setGridInstance();
    });

    function setGridInstance(): void {
        tGrid.setInstance(getGridReference());
        gridInstance.value = getGridReference();
    }

    function getGridReference(): any {
        const gridReference = gridComponent.value?.entityGridRef;
        if (gridReference) {
            return gridReference;
        }
        throw new Error("No grid reference found");
    }

    function onDeleteEntityButtonClickedOverride(id: T): void {
        tGrid.rememberCurrentPageBeforeGridAction(EntityGridAction.EntityDelete);
        showDeleteEntity.value = true;
        entity.value.id = id;

        if (overridableFunctions?.onDeleteEntityButtonClickedOverride) {
            overridableFunctions.onDeleteEntityButtonClickedOverride(id);
        }
    }

    function onEntityUpdatedOverride(): void {
        //This event handler will be called after an entity (a new or an existing one) is sucessfully saved on server.
        tGrid.restoreCurrentPage();
        showEntity.value = false;
        isEditingEntityInline.value = false;

        if (overridableFunctions?.onEntityUpdatedOverride) {
            overridableFunctions.onEntityUpdatedOverride();
        }
    }

    function onEntityDeletedOverride(): void {
        //This event handler will be called after an entity is sucessfully deleted on server.
        tGrid.restoreCurrentPage();

        if (overridableFunctions?.onEntityDeletedOverride) {
            overridableFunctions.onEntityDeletedOverride();
        }
    }

    return {
        tGrid,
        entityApiClient,
        entity,
        entityUpdateStrategy,
        isSaving,
        isLoading,
        isEditingEntityInline,
        showEntity,
        showDeleteEntity,

        provideGridUrl,
        onAddEntityButtonClicked,
        onEditEntityButtonClicked,
        onViewEntityDetailsButtonClicked,
        onDeleteEntityButtonClicked,
        onDeleteEntityCancelled,
        onBackButtonClicked,
        closeEntityModal,
        onEntityUpdated,
        onEntityDeleted,
        fetchData,
        saveEntity,
        deleteEntity,
        onError,
        alertVisible,
        isMobile,
    };
}
