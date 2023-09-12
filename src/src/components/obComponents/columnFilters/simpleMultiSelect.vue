<template>
    <v-select
        :key="column.key"
        v-model="modelValue"
        :items="column.filterType == filterType.SimpleBoolean ? booleanArray : column.valueAccessor"
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
                        :color="checkSomeItems(column.key) ? 'indigo-darken-4' : undefined"
                        :indeterminate="
                            checkSomeItems(column.key) &&
                            !checkAllItems(
                                column.key,
                                column.filterType == filterType.SimpleBoolean ? booleanArray : column.valueAccessor,
                            )
                        "
                        :model-value="
                            checkAllItems(
                                column.key,
                                column.filterType == filterType.SimpleBoolean ? booleanArray : column.valueAccessor,
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

    const props = defineProps({
        column: {
            type: Column,
            require: true,
        },
    });
    const column = toRef(props, "column");
    const filterType = FilterType;
    const modelValue = ref(null);
    const emit = defineEmits(["addFilter"]);
    const updateKey = ref(0);
    const booleanArray = [
        { id: 1, name: "Yes" },
        { id: 0, name: "No" },
    ];

    function addFilter() {
        console.log(modelValue.value);
        emit("addFilter", column.value!.filterType, column.value!.key, modelValue.value);
    }

    function toggleList() {
        console.log(2);
        console.log(items);
        const items = column.value.filterType == filterType.SimpleBoolean ? booleanArray : column.value.valueAccessor;
        if (modelValue.value != null && modelValue.value.length == items.length) {
            modelValue.value = null;
            updateKey.value++;
        } else {
            const data = items.map((i) => i.id);
            modelValue.value = data;
        }
        emit("addFilter", column.value!.filterType, column.value!.key, modelValue.value);
    }

    function checkSomeItems(key: string): boolean {
        return modelValue.value == null ? false : modelValue.value.length > 0;
    }

    function checkAllItems(key: string, items: any): boolean {
        return modelValue.value == null ? false : modelValue.value.length == items.length;
    }
</script>
