import { WebApiError } from "@js/api/webApiClient";
import { i18n } from "@js/localizations/lang";
import type { NotificationType, ShowMethod, ToastOptions } from "@js/types/toastTypes";
import { ShowAlertKey } from "@js/util/symbols";
import { inject, onMounted, type ComputedRef } from "vue";

// Provides a simple access point for displaying any notification/alert that does not require an action from the user.
export default function useGlobalNotification() {
    let show: ComputedRef<ShowMethod>;

    onMounted(() => {
        // injecting the function that makes the Toast component display
        const injectedShow = inject(ShowAlertKey);

        if (injectedShow) {
            show = injectedShow;
        } else {
            throw new Error(`Could not resolve ${ShowAlertKey.description}`);
        }
    });

    /**
     * Shows a Toast notification.
     */
    function showAlert(
        newTitle: string,
        newMessage: string,
        type: NotificationType,
        toastOptions?: ToastOptions,
    ): void {
        show.value(newTitle, newMessage, type, toastOptions);
    }

    function onSuccess(message: string): void {
        showAlert(i18n.global.t("notifications.success"), message, "success");
    }

    /**
     * A simplified alias for showAlert.
     *
     * Will accept any input. If e is a WebApiError, an appropriate message will be displayed based on the httpCode.
     * If e is a string, it will be displayed directly.
     * Any other argument will result in a generic error message being displayed.
     */
    function onError(e: unknown): void {
        let message = i18n.global.t("errors.errorProcessingRequest");

        if (e instanceof WebApiError) {
            if (e.httpCode === 403 || e.httpCode === 401)
                message = message + `: ${i18n.global.t("errors.accessDenied")}`;
            if (e.httpCode === 404) message = message + `: ${i18n.global.t("errors.resourceNotFound")}`;
            if (e.httpCode === 500) message = message + `: ${i18n.global.t("errors.internalServerError")}`;
            if (e.httpCode === 503) message = message + `: ${i18n.global.t("errors.serviceUnavailable")}`;
        } else if (typeof e === "string" || e instanceof String) {
            message = e.toString();
        }

        showAlert(i18n.global.t("errors.error"), message, "error");
    }

    return {
        onError,
        onSuccess,
        showAlert,
    };
}
