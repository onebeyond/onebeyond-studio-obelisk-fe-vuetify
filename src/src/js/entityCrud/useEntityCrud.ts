import type { EntityUpdateStrategy, ConstructorParams } from "@js/entityCrud/entityUpdateStrategy";
import type { Entity, EntityBuilder } from "@js/dataModels/entity";
import type EntityApiClient from "@js/api/entityApiClient";
import { ref } from "vue";
import useGlobalNotification from "@js/composables/useGlobalNotification";

export type OverridableFunctions<T> = {
    onDeleteEntityButtonClickedOverride?: (id: T) => void;
    onEntityUpdatedOverride?: () => void;
    onEntityDeletedOverride?: () => void;
    onEntityLoadedOverride?: () => void;
};

export default function useEntityCrud<TEntity extends Entity<T>, T>(
    provideEntityBuilder: EntityBuilder<TEntity, T>,
    entityApiClient: EntityApiClient<TEntity, T>,
    entityUpdateStrategyBuilder: (params: ConstructorParams<TEntity, T>) => EntityUpdateStrategy<TEntity, T>,
    overridableFunctions?: OverridableFunctions<T>,
) {
    const entity = ref(new provideEntityBuilder()); //An entity being added/edited

    const isSaving = ref(false);
    const isLoading = ref(false);
    const isEditingEntityInline = ref(false);
    const showEntity = ref(false);
    const showDeleteEntity = ref(false);
    const { onError } = useGlobalNotification();
    //You can define how your page is going to react on add/edit
    //(create an entity in a modal or on a sep page) using EntityUpdateStrategy class
    const entityUpdateStrategy = entityUpdateStrategyBuilder({
        entity,
        onEntityLoaded,
        provideEntityBuilder,
        showEntity,
        entityApiClient,
        onEntityUpdated,
        isEditingEntityInline,
        isMobile,
        onError,
    });

    // Can override in case of a custom url needed
    function provideGridUrl(): string {
        return entityApiClient.apiUrl;
    }

    //Note! addClick and addEntity are both moved to addClick.
    //entityUpdateStrategy will define how to react on a "Add Entity" button click
    function onAddEntityButtonClicked(): void {
        entityUpdateStrategy.doAdd();
    }

    async function onEditEntityButtonClicked(id: T): Promise<void> {
        return await entityUpdateStrategy.doEdit(id);
    }

    function onViewEntityDetailsButtonClicked(id: any): void {
        entityUpdateStrategy.doViewDetails(id);
    }

    function onDeleteEntityButtonClicked(id: T): void {
        showDeleteEntity.value = true;
        entity.value.id = id;

        if (overridableFunctions?.onDeleteEntityButtonClickedOverride) {
            overridableFunctions.onDeleteEntityButtonClickedOverride(id);
        }
    }

    function onDeleteEntityCancelled(): void {
        showDeleteEntity.value = false;
    }

    //Note, this is former returnToList button
    function onBackButtonClicked(): void {
        entityUpdateStrategy.doReturn();
    }

    function closeEntityModal(): void {
        showEntity.value = false;
        isEditingEntityInline.value = false;
    }

    function onEntityLoaded(): void {
        //This event handler will be called after:
        // (1) a new entity is created(when we add a new entity)
        // (2) an entity is retrieved from server (when we edit an entity)
        //Please override it if you need to perform any additional operations on this event
        if (overridableFunctions?.onEntityLoadedOverride) {
            overridableFunctions.onEntityLoadedOverride();
        }
    }

    function onEntityUpdated(): void {
        //This event handler will be called after an entity (a new or an existing one) is sucessfully saved on server.
        showEntity.value = false;
        isEditingEntityInline.value = false;

        if (overridableFunctions?.onEntityUpdatedOverride) {
            overridableFunctions.onEntityUpdatedOverride();
        }
    }

    function onEntityDeleted(): void {
        //This event handler will be called after an entity is sucessfully deleted on server.
        if (overridableFunctions?.onEntityDeletedOverride) {
            overridableFunctions.onEntityDeletedOverride();
        }
    }

    async function fetchData(id: T): Promise<void> {
        try {
            isLoading.value = true;
            entity.value = await entityApiClient.getEntity(id);
            onEntityLoaded();
        } catch (e) {
            onError(e);
        } finally {
            isLoading.value = false;
        }
    }

    async function saveEntity(): Promise<void> {
        entity.value.trimProperties();
        try {
            isSaving.value = true;
            entity.value.isNew
                ? (entity.value.id = await entityApiClient.addEntity(entity.value))
                : await entityApiClient.updateEntity(entity.value);

            entityUpdateStrategy.doEntitySaved();
        } catch (e) {
            onError(e);
        } finally {
            isSaving.value = false;
        }
    }

    async function deleteEntity(): Promise<void> {
        showDeleteEntity.value = false;

        try {
            await entityApiClient.deleteEntity(entity.value.id);
            onEntityDeleted();
        } catch (e) {
            onError(e);
        }
    }

    //This method returns true is a page is displayed on a modal device (or a small resolution screen)
    function isMobile(): boolean {
        const isMobileCheckDiv = document.getElementById("isMobileCheckDiv") as Element;

        if (isMobileCheckDiv === null) {
            throw new Error("Unable to detect if the app is in mobile mode: cannot find div#isMobileCheckDiv");
        }

        return window.getComputedStyle(isMobileCheckDiv).display !== "none";
    }

    return {
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
        isMobile,
    };
}
