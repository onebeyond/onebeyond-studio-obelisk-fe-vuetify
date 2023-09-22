<template>
    <v-menu offset-y :close-on-content-click="false" v-if="column.allowFiltering" :key="updateKey">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
                <v-icon small :color="modelValuePrimary != null || modelValueSecondary != null ? 'primary' : ''">
                    mdi-filter-variant
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <div style="background-color: white; width: 280px">
                <template v-if="column.filterType == FilterType.ComplexNumberRange">
                    <v-row no-gutters>
                        <v-col cols="6">
                            <v-btn text block @click="addComplexFilter()" color="success"> Filter </v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn text block @click="clearComplexFilter()" color="warning"> Clear </v-btn>
                        </v-col>
                    </v-row>
                    <div>
                        <v-text-field
                            v-model="modelValuePrimary"
                            type="number"
                            placeholder="Greater than or equal to"
                            :autofocus="true"
                        />
                        <v-text-field
                            v-model="modelValueSecondary"
                            type="number"
                            placeholder="less than or equal to"
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
    const modelValuePrimary = ref(null);
    const modelValueSecondary = ref(null);
    const emit = defineEmits(["addRangeFilter", "clearComplexFilter"]);
    const updateKey = ref(0);

    function addComplexFilter() {
        emit(
            "addRangeFilter",
            column.value!.filterType,
            column.value!.key,
            modelValuePrimary.value,
            modelValueSecondary.value,
        );
        updateKey.value++;
    }

    function clearComplexFilter() {
        modelValuePrimary.value = null;
        modelValueSecondary.value = null;
        emit("clearComplexFilter", column.value!.key);
        updateKey.value++;
    }
</script>
