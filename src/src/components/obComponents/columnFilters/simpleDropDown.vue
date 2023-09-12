<template>
    <v-select
        :key="column.key"
        v-model="modelValue"
        :items="column.valueAccessor"
        :label="column.title"
        persistent-hint
        item-value="id"
        item-title="name"
        density="compact"
        variant="outlined"
        clearable
        hide-details="auto"
        @update:model-value="addFilter()"
    />
</template>

<script setup lang="ts">
    import { toRef, ref } from "vue";
    import { Column } from "@js/grids/vuetify/types";

    const props = defineProps({
        column: {
            type: Column,
            require: true,
        },
    });
    const column = toRef(props, "column");
    const modelValue = ref(null);
    const emit = defineEmits(["addFilter"]);

    function addFilter() {
        console.log(modelValue.value);
        emit("addFilter", column.value!.filterType, column.value!.key, modelValue.value);
    }
</script>
