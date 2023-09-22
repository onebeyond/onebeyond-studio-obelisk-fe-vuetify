<template>
    <v-menu offset-y :close-on-content-click="false" v-if="column.allowFiltering" :key="updateKey">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
                <v-icon small :color="modelValue != null ? 'primary' : ''"> mdi-filter-variant </v-icon>
            </v-btn>
        </template>
        <v-card>
            <div style="background-color: white; width: 280px">
                <template v-if="column.filterType == FilterType.ComplexText">
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
                            :value="modelOperatorValue"
                            :items="stringOperators"
                            :autofocus="true"
                            @update:model-value="(e) => updateOperator(e)"
                        />
                        <v-text-field
                            :key="column.key"
                            v-model="modelValue"
                            type="text"
                            :placeholder="column.title"
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
    import { Column, FilterType, StringOperators } from "@js/grids/vuetify/types";

    const props = defineProps({
        column: {
            type: Column,
            require: true,
        },
    });
    const column = toRef(props, "column");
    const stringOperators = Object.values(StringOperators);
    const modelValue = ref(null);
    const modelOperatorValue = ref(StringOperators.Contains);
    const emit = defineEmits(["addComplexFilter", "clearComplexFilter"]);
    const updateKey = ref(0);

    function addComplexFilter() {
        emit(
            "addComplexFilter",
            column.value!.filterType,
            column.value!.key,
            modelValue.value,
            modelOperatorValue.value,
        );
        updateKey.value++;
    }

    function clearComplexFilter() {
        modelValue.value = null;
        modelOperatorValue.value = StringOperators.Contains;
        emit("clearComplexFilter", column.value!.key);
        updateKey.value++;
    }

    function updateOperator(value: StringOperators): void {
        modelOperatorValue.value = value;
    }
</script>
