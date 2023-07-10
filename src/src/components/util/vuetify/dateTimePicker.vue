<template>
    <div>
        <v-menu v-model="isMenuVisible" :close-on-content-click="false" transition="scale-transition" min-width="auto">
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
            <v-card>
                <v-card-text>
                    <v-text-field v-model="time" type="time" dense></v-text-field>
                </v-card-text>
                <v-card-text>
                    <v-date-picker v-model="date" @update:modelValue="save" @click:cancel="cancel" />
                </v-card-text>
            </v-card>
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
    const time = ref("");
    const dateFormatted = ref("");

    const emit = defineEmits(["update:modelValue"]);

    watch(() => props.modelValue, updateFieldsFromModelValue);

    onMounted(() => {
        updateFieldsFromModelValue();
    });

    function updateFieldsFromModelValue(): void {
        if (props.modelValue) {
            const dateTimeParts = DateTime.splitDateAndTime(props.modelValue, DateTime.getCurrentTimeZoneId());
            date.value = props.modelValue ? [dateTimeParts[0]] : null;
            time.value = dateTimeParts[1];
            dateFormatted.value = DateTime.formatDateTime(props.modelValue);
        } else {
            date.value = null;
            time.value = "";
            dateFormatted.value = "";
        }
    }

    function clear(): void {
        date.value = null;
        time.value = "";
        dateFormatted.value = "";
        emit("update:modelValue", null);
    }

    function save(): void {
        isMenuVisible.value = false;

        if (date.value) {
            const dateTime = DateTime.toZonedDate(date.value[0], DateTime.getCurrentTimeZoneId(), time.value);
            dateFormatted.value = DateTime.formatDateTime(dateTime);
            emit("update:modelValue", dateTime);
        } else {
            clear();
        }
    }

    function cancel(): void {
        isMenuVisible.value = false;
    }
</script>
