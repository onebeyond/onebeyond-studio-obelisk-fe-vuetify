<template>
    <v-menu offset-y :close-on-content-click="false" v-if="column.allowFiltering" :key="updateKey">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
                <v-icon small :color="modelValue != null ? 'primary' : ''"> mdi-filter-variant </v-icon>
            </v-btn>
        </template>
        <v-card>
            <div style="background-color: white; width: 280px">
                <template
                    v-if="
                        column.filterType == filterType.ComplexBoolean ||
                        column.filterType == filterType.ComplexDropdown
                    "
                >
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
                            :items="
                                column.filterType == filterType.ComplexBoolean ? booleanArray : column.valueAccessor
                            "
                            :label="column.title"
                            persistent-hint
                            item-value="id"
                            item-title="name"
                            :autofocus="true"
                        />
                    </div>
                </template>
            </div>
        </v-card>
    </v-menu>
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
    const booleanArray = [
        { id: 1, name: "Yes" },
        { id: 0, name: "No" },
    ];
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
</script>
