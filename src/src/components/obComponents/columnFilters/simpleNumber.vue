<template>
    <v-text-field
        :key="column.key"
        type="number"
        v-model="modelValue"
        :placeholder="column.title"
        density="compact"
        variant="outlined"
        clearable
        hide-details="auto"
        @input="addFilter()"
        @click:clear="addFilter()"
        @click:prepend-inner="addFilter()"
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
        emit("addFilter", column.value!.filterType, column.value!.key, modelValue.value);
    }
</script>
