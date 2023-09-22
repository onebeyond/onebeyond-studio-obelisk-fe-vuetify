<template>
    <v-select
        :key="column.key"
        v-model="modelValue"
        :items="column.filterType == FilterType.SimpleBoolean ? booleanArray : column.valueAccessor"
        :label="column.title"
        multiple
        persistent-hint
        item-value="id"
        item-title="name"
        :autofocus="true"
        @update:model-value="addFilter()"
    >
        <template v-slot:prepend-item>
            <v-list-item title="Select All" @click="toggleList()">
                <template v-slot:prepend>
                    <v-checkbox-btn
                        :color="checkSomeItems() ? 'indigo-darken-4' : undefined"
                        :indeterminate="
                            checkSomeItems() &&
                            !checkAllItems(
                                column.filterType == FilterType.SimpleBoolean ? booleanArray : column.valueAccessor,
                            )
                        "
                        :model-value="
                            checkAllItems(
                                column.filterType == FilterType.SimpleBoolean ? booleanArray : column.valueAccessor,
                            )
                        "
                    />
                </template>
            </v-list-item>
        </template>
    </v-select>
</template>

<script setup lang="ts">
    import { toRef, ref } from "vue";
    import { Column, FilterType } from "@js/grids/vuetify/types";
    import type LookupItem from "@js/dataModels/commons/lookupItem";

    const props = defineProps({
        column: {
            type: Column,
            require: true,
        },
    });
    const column = toRef(props, "column");
    const modelValue = ref(null);
    const emit = defineEmits(["addFilter"]);
    const updateKey = ref(0);
    const booleanArray = [
        { id: 1, name: "Yes" },
        { id: 0, name: "No" },
    ];

    function addFilter() {
        emit("addFilter", column.value!.filterType, column.value!.key, modelValue.value);
    }

    function toggleList() {
        const items = column.value.filterType == FilterType.SimpleBoolean ? booleanArray : column.value.valueAccessor;
        if (modelValue.value != null && modelValue.value.length == items.length) {
            modelValue.value = null;
            updateKey.value++;
        } else {
            const data = items.map((i) => i.id);
            modelValue.value = data;
        }
        emit("addFilter", column.value!.filterType, column.value!.key, modelValue.value);
    }

    function checkSomeItems(): boolean {
        return modelValue.value == null ? false : modelValue.value.length > 0;
    }

    function checkAllItems(items: Array<LookupItem<T>>): boolean {
        return modelValue.value == null ? false : modelValue.value.length == items.length;
    }
</script>
