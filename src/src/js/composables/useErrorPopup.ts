import { ref, nextTick } from "vue";
import { global } from "@js/util/globalProperties";

export default function useErrorPopup() {
    const alertVisible = ref(false);
    const isInError = ref(false);

    function hideAlert(): void {
        alertVisible.value = false;
    }

    function showAlert(title: string, msg: string): void {
        nextTick(() => {
            global.$bus.$emit("alertModal/setData", title, msg);
        });
        alertVisible.value = true;
    }

    function onServerError(event: any): void {
        let msg = "Error Processing Request";
        if (event.status === 400 && event.bodyText) msg = msg + ": " + event.bodyText;
        if (event.status === 403 || event.status === 401) msg = msg + ": Access denied";
        if (event.status === 404) msg = msg + ": Resource not found";
        if (event.status === 500) msg = msg + ": Internal Server Error";
        if (event.status === 503) msg = msg + ": Service Unavailable";
        if (!event.status) msg = msg + ": " + event;

        showAlert("Error", msg);
    }

    function onServerErrorWithState(event: any): void {
        isInError.value = true;
        onServerError(event);
    }

    return {
        hideAlert,
        showAlert,
        onServerError,
        onServerErrorWithState,
        alertVisible,
        isInError
    };
}
