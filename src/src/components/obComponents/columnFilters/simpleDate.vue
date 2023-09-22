<template>
    <DatePicker
        :label="column.title"
        clearable="true"
        :name="column.title"
        v-model="modelValue"
        @update:modelValue="addDateFilter()"
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
    const emit = defineEmits(["addDateFilter"]);

    function addDateFilter() {
        emit(
            "addDateFilter",
            column.value!.filterType,
            column.value!.key,
            modelValue.value,
            column.value!.isDateTimeOffset,
        );
    }
</script>
