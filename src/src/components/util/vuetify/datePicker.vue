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
            <v-date-picker 
                v-model="date"
                @update:modelValue="save"
                @click:cancel="cancel"
            />
        </v-menu>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch,onMounted } from "vue";
    import { format } from 'date-fns';
    import { VDatePicker } from "vuetify/lib/labs/VDatePicker";
 
    const props = defineProps<{
        clearable: boolean
        label: string
        name?: string
        modelValue: Date | null
        rules?: any[]
    }>();

    const isMenuVisible = ref(false);
    const date = ref<Date[] | null>([]);
    const dateFormatted = ref("");

    const emit = defineEmits(["update:modelValue"]);

    watch(date, (value) => emit("update:modelValue", value ? value[0] : null));

    watch(() => props.modelValue, updateFieldsFromModelValue);

    onMounted(() => {
        updateFieldsFromModelValue();
    });

    function updateFieldsFromModelValue(): void {
        date.value = props.modelValue ? [props.modelValue] : null;
        dateFormatted.value = formatDate(date.value ? date.value[0] : null, "dd/MM/yyyy");
    }

    function clear(): void {
        date.value = null;
        dateFormatted.value = "";
    }

    function save(): void {
        isMenuVisible.value = false;
        dateFormatted.value = formatDate(date.value ? date.value[0] : null, "dd/MM/yyyy");
    }

    function cancel(): void {
        isMenuVisible.value = false;
    }

    function formatDate(date, formatString): string {
        return date ? format(new Date(date), formatString) : "";
    }
</script>
