<template>
    <div v-if="visible">
        <v-dialog v-model="visible" persistent max-width="480px">
            <v-card>
                <slot name="header">
                    <v-card-title color="primary">{{ innerTitle }}</v-card-title>
                </slot>
                <v-form>
                    <slot name="content">
                        <v-card-text>{{ innerMessage }}</v-card-text>
                    </slot>
                </v-form>
                <v-card-actions class="text-right">
                    <v-spacer></v-spacer>
                    <slot name="footer">
                        <v-btn @click="onCloseClicked">{{ t("button.close") }}</v-btn>
                    </slot>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, toRef, onMounted } from "vue";
    import { global } from "@js/util/globalProperties";
    import { useI18n } from "vue-i18n";

    const props = defineProps({
        namespace: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        visible: Boolean, // Should be bound with a v-model:visible
        modalClass: {
            type: String,
            required: false,
        },
    });

    const title = toRef(props, "title");
    const message = toRef(props, "message");
    const visible = toRef(props, "visible");
    const namespace = toRef(props, "namespace");

    const innerTitle = ref(title.value);
    const innerMessage = ref(message.value);

    const emit = defineEmits(["close"]);

    const { t } = useI18n();

    onMounted(() => {
        if (namespace.value) {
            global.$bus.$on(namespace.value + "/setData", setData);
        }
    });

    function onCloseClicked(): void {
        emit("close", false);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function setData(newTitle: string, newMessage: string): void {
        innerTitle.value = newTitle;
        innerMessage.value = newMessage;
    }
</script>
