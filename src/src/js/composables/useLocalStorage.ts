import { watch, type Ref, ref } from "vue";
import LocalAppStorage from "@js/stores/localAppStorage";
import { plainToInstance, type ClassConstructor } from "class-transformer";

export default function useLocalStorage<T>(key: string, initialValue: T, entity: ClassConstructor<T> | null = null) {
    const storedData: Ref<T> = load();

    watch(storedData, write, { deep: true });

    function load(): Ref<T> {
        const value = LocalAppStorage.getValueForKey(key) ?? "";

        if (value) {
            const instance = entity ? plainToInstance(entity, JSON.parse(value)) : JSON.parse(value);

            return ref(instance) as Ref<T>;
        } else {
            return ref(initialValue) as Ref<T>;
        }
    }

    function write() {
        if (storedData.value) {
            LocalAppStorage.setValueForKey(key, JSON.stringify(storedData.value));
        } else {
            LocalAppStorage.removeValueForKey(key);
        }
    }

    return storedData;
}
