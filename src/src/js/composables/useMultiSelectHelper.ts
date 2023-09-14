import { ref, type Ref } from "vue";

export default function useMultiSelectHelper<TEntity, TLookup, TLookupId>(
    lookupTrackingPropName: string,
    entityPropName: string,
) {
    const items: Ref<TLookup[]> = ref([]);
    const selectedItems: Ref<TLookup[]> = ref([]);
    const isLoading = ref<boolean>(false);
    const select = (item: TLookup, entity: TEntity) => onSelect(item, entity);
    const remove = (item: TLookup, entity: TEntity) => onRemove(item, entity);
    const resetSelectedItems = () => (selectedItems.value = []);

    function setDataSource(data: TLookup[]): void {
        items.value = data;
    }

    function onSelect(item: TLookup, entity: TEntity): void {
        (entity[entityPropName] as TLookupId[]).push(item[lookupTrackingPropName]);
    }

    function onRemove(item: TLookup, entity: TEntity): void {
        const index = (entity[entityPropName] as TLookupId[]).indexOf(item[lookupTrackingPropName]);

        if (index !== -1) {
            (entity[entityPropName] as TLookupId[]).splice(index, 1);
        }
    }

    function startLoading(): void {
        isLoading.value = true;
    }

    function endLoading(): void {
        isLoading.value = false;
    }

    function selectItems(ids: TLookupId[]): void {
        const toSelect = items.value.filter((item) => ids.includes(item[lookupTrackingPropName]));

        selectedItems.value.push(...toSelect);
    }

    return {
        items,
        selectedItems,
        isLoading,
        select,
        remove,
        resetSelectedItems,
        startLoading,
        endLoading,
        setDataSource,
        selectItems,
    };
}
