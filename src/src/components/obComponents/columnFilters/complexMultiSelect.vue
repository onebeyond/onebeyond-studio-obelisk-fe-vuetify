<template>
    <v-menu offset-y :close-on-content-click="false" v-if="column.allowFiltering" :key="updateKey">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
                <v-icon small :color="modelValue != null ? 'primary' : ''"> mdi-filter-variant </v-icon>
            </v-btn>
        </template>
        <v-card>
            <div style="background-color: white; width: 280px">
                <template v-if="column.filterType == FilterType.ComplexMultiSelectCheckbox">
                    <v-row no-gutters>
                        <v-col cols="6">
                            <v-btn text block @click="addComplexFilter()" color="success"> Filter </v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn text block @click="clearComplexFilter()" color="warning"> Clear </v-btn>
                        </v-col>
                    </v-row>
                    <div>
                        <v-select
                            :key="column.key"
                            v-model="modelValue"
                            :items="column.valueAccessor"
                            :label="column.title"
                            multiple
                            persistent-hint
                            item-value="id"
                            item-title="name"
                            :autofocus="true"
                        >
                            <template v-slot:prepend-item>
                                <v-list-item title="Select All" @click="toggleList()">
                                    <template v-slot:prepend>
                                        <v-checkbox-btn
                                            :color="checkSomeItems() ? 'indigo-darken-4' : undefined"
                                            :indeterminate="checkSomeItems() && !checkAllItems(column.valueAccessor)"
                                            :model-value="checkAllItems(column.valueAccessor)"
                                        />
                                    </template>
                                </v-list-item>
                            </template>
                        </v-select>
                    </div>
                </template>
            </div>
        </v-card>
    </v-menu>
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
    const emit = defineEmits(["addFilter", "clearComplexFilter"]);
    const updateKey = ref(0);

    function addComplexFilter() {
        emit("addFilter", column.value!.filterType, column.value!.key, modelValue.value);
        updateKey.value++;
    }

    function clearComplexFilter() {
        modelValue.value = null;
        emit("clearComplexFilter", column.value!.key);
        updateKey.value++;
    }

    function toggleList() {
        const items = column.value.valueAccessor;
        if (modelValue.value != null && modelValue.value.length == items.length) {
            modelValue.value = null;
        } else {
            const data = items.map((i) => i.id);
            modelValue.value = data;
        }
    }

    function checkSomeItems(): boolean {
        return modelValue.value == null ? false : modelValue.value.length > 0;
    }

    function checkAllItems(items: []): boolean {
        return modelValue.value == null ? false : modelValue.value.length == items.length;
    }
</script>
