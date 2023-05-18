import { nextTick, ref } from "vue";
import { global } from "@js/util/globalProperties";

export default function useAlert() {
    const alertVisible = ref(false);

    function showAlert(title: string, msg: string): void {
        nextTick(() => {
            global.$bus.$emit("alertModal/setData", title, msg);
        });
        alertVisible.value = true;
    }

    function hideAlert(): void {
        alertVisible.value = false;
    }

    return {
        alertVisible,
        showAlert,
        hideAlert,
    };
}
