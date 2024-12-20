<template>
    <div v-if="visible">
        <v-dialog v-model="visible" persistent max-width="500px" :class="['modal-dialog', modalClass]">
            <v-card>
                <slot name="header">
                    <h1>
                        {{ title }}
                    </h1>
                </slot>
                <slot name="content">
                    <v-card-text>{{ message }}</v-card-text>
                </slot>
                <div class="v-card-actions">
                    <slot name="footer">
                        <v-btn color="secondary" @click="onClose">{{ t("button.close") }}</v-btn>
                    </slot>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import { toRef } from "vue";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();

    const props = defineProps<{
        title?: string;
        message?: string;
        visible: boolean;
        onClose?: () => void;
        modalClass?: string;
    }>();

    const title = toRef(props, "title");
    const message = toRef(props, "message");
    const visible = toRef(props, "visible");
    const onClose = toRef(props, "onClose");
    const modalClass = toRef(props, "modalClass");
</script>
