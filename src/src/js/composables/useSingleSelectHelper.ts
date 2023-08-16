import { ref, type Ref } from "vue";

export default function useSingleSelectHelper<TEntity, TLookup, TLookupId>(
    lookupTrackingPropName: string,
    entityPropName: string
) {
    type CallbackMethod = () => void;
    const items: Ref<TLookup[]> = ref([]);
    const selectedItem: Ref<TLookup | null> = ref(null);
    const isLoading = ref<boolean>(false);
    const select = (item: TLookup, entity: TEntity, callback?: CallbackMethod) => onSelect(item, entity, callback);
    const remove = (entity: TEntity, callback?: CallbackMethod) => onRemove(entity, callback);
    const resetSelectedItem = () => (selectedItem.value = null);

    function setDataSource(data: TLookup[]): void {
        items.value = data;
    }

    function onSelect(item: TLookup, entity: TEntity, callback?: CallbackMethod): void {
        (entity[entityPropName] as TLookupId) = item[lookupTrackingPropName];

        if (callback) {
            callback();
        }
    }

    function onRemove(entity: TEntity, callback?: CallbackMethod): void {
        (entity[entityPropName] as TLookupId | null) = null;

        if (callback) {
            callback();
        }
    }

    function startLoading(): void {
        isLoading.value = true;
    }

    function endLoading(): void {
        isLoading.value = false;
    }

    function selectItem(id: TLookupId): void {
        selectedItem.value = items.value.find((x) => x[lookupTrackingPropName] === id) ?? null;
    }

    return {
      items,
      selectedItem,
      isLoading,
      select,
      remove,
      resetSelectedItem,
      startLoading,
      endLoading,
      setDataSource,
      selectItem,
  };
}
