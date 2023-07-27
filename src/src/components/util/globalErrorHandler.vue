<template>
    <div>
        <slot v-if="showPopup">
            <!-- This message will never be shown anyway -->
            <div>An unexpected error occurred!</div>
        </slot>
        <slot v-else>
            <!-- Main content wrapped here -->
        </slot>

        <v-modalPopup :visible="showPopup" @close="refreshPage">
            <template #header>
                <v-card-title color="primary">{{ $t("popup.title") }}</v-card-title>
            </template>

            <template #content>
                <v-card-text>
                    <v-alert type="error">{{ errorMessage }}</v-alert>
                    <div>{{ $t("popup.reloadMessage") }}</div>
                </v-card-text>
            </template>

            <template #footer>
                <v-btn type="button" class="btn btn-primary" @click="refreshPage">{{ $t("button.reload") }}</v-btn>
            </template>
        </v-modalPopup>
    </div>
</template>

<script setup lang="ts">
    import { onErrorCaptured, type ComponentPublicInstance } from "vue";
    import { WebApiError } from "@js/api/webApiClient";
    import dictionary from "@js/localizations/resources/components/globalErrorHandler";
    import { useI18n } from "vue-i18n";
    const { t } = useI18n({
        messages: dictionary,
    });

    let showPopup: boolean = false;
    let errorMessage: string = "";

    onErrorCaptured(errorCaptured);

    /**
     * This method will capture all the unhandled errors in its descendant components
     * @param error The error
     * @param _vm The Vue vm
     * @param _info Info about the component/hook/method that raised the error
     */
    function errorCaptured(error: unknown, _vm: ComponentPublicInstance | null, _info: string): boolean {
        // log the error in the console regardless
        console.error(error);

        // set the error message for the popup
        if (error instanceof WebApiError) {
            errorMessage = error.message;
            if (error.httpCode) {
                switch (error.httpCode) {
                    case WebApiError.UnreachableServerHttpCode:
                        errorMessage = `${t("errorMessages.unreachableServer")}`;

                        // For now show the popup only if in this case
                        showPopup = true;
                        break;
                }
            }
        }

        // Avoid further propagation to app.config.errorHandler
        return false;
    }

    function refreshPage(): void {
        location.reload();
    }
</script>
