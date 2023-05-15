<template>
    <div>
        <slot v-if="showPopup">
            <!-- This message will never be shown anyway -->
            <div>An unexpected error occurred!</div>
        </slot>
        <slot v-else>
            <!-- Main content wrapped here -->
        </slot>

        <v-alertModal :visible="showPopup" @close="refreshPage">
            <template slot="header">
                <v-card-title color="primary">{{ $t("popup.title") }}</v-card-title>
            </template>

            <template slot="content">
                <v-card-text>
                    <v-alert type="error">{{ errorMessage }}</v-alert>
                    <div>{{ $t("popup.reloadMessage") }}</div>
                </v-card-text>
            </template>

            <template slot="footer">
                <v-btn type="button" class="btn btn-primary" @click="refreshPage">{{ $t("button.reload") }}</v-btn>
            </template>
        </v-alertModal>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { WebApiError } from "@js/api/webApiClient";
    import dictionary from "@js/localizations/resources/components/globalErrorHandler";

    @Component({
        name: "GlobalErrorHandler",
        i18n: {
            messages: dictionary
        }
    })
    export default class GlobalErrorHandler extends Vue {
        public showPopup: boolean = false;
        public errorMessage: string = "";

        constructor() {
            super();
        }

        /**
         * This method will capture all the unhandled errors in its descendant components
         * @param error The error
         * @param _vm The Vue vm
         * @param _info Info about the component/hook/method that raised the error
         */
        errorCaptured(error: any, _vm: Vue, _info: string): boolean {
            // log the error in the console regardless
            console.error(error);

            // set the error message for the popup
            this.errorMessage = error.message;
            if (error.httpCode) {
                switch (error.httpCode) {
                    case WebApiError.UnreachableServerHttpCode:
                        this.errorMessage = `${this.$t("errorMessages.unreachableServer")}`;

                        // For now show the popup only if in this case
                        this.showPopup = true;
                        break;
                }
            }

            // Avoid further propagation to app.config.errorHandler
            return false;
        }

        refreshPage(): void {
            location.reload();
        }
    }
</script>
