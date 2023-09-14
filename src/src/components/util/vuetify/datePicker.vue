<template>
    <div>
        <v-menu
            v-model="isMenuVisible"
            :close-on-content-click="false"
            transition="scale-transition"
            max-width="290px"
            min-width="auto"
        >
            <template v-slot:activator="{ props }">
                <v-text-field
                    v-model="dateFormatted"
                    outlined
                    dense
                    :name="name"
                    :label="label"
                    prepend-inner-icon="mdi-calendar"
                    @click:clear="clear"
                    :clearable="clearable"
                    v-bind="props"
                    hide-details="auto"
                    readonly
                    :rules="rules"
                >
                </v-text-field>
            </template>
            <v-date-picker v-model="date" @update:modelValue="save" @click:cancel="cancel" />
        </v-menu>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, onMounted } from "vue";
    import { VDatePicker } from "vuetify/lib/labs/VDatePicker";
    import { DateTime } from "@js/util/dateTime";

    const props = defineProps<{
        clearable: boolean;
        label: string;
        name?: string;
        modelValue: Date | null;
        rules?: ((value) => string | true)[];
    }>();

    const isMenuVisible = ref(false);
    const date = ref<Date[] | null>([]);
    const dateFormatted = ref("");

    const emit = defineEmits(["update:modelValue"]);

    watch(() => props.modelValue, updateFieldsFromModelValue);

    onMounted(() => {
        updateFieldsFromModelValue();
    });

    function updateFieldsFromModelValue(): void {
        date.value = props.modelValue ? [props.modelValue] : null;
        dateFormatted.value = formatDate(date.value ? date.value[0] : null);
    }

    function clear(): void {
        date.value = null;
        dateFormatted.value = "";
        emit("update:modelValue", null);
    }

    function save(): void {
        isMenuVisible.value = false;
        dateFormatted.value = formatDate(date.value ? date.value[0] : null);
        emit("update:modelValue", date.value ? date.value[0] : null);
    }

    function cancel(): void {
        isMenuVisible.value = false;
    }

    function formatDate(date: Date | null): string {
        return date ? DateTime.formatDate(date) : "";
    }
</script>
