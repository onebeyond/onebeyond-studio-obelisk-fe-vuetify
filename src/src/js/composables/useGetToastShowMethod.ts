import { computed, type Ref } from "vue";
import type Toast from "@components/obComponents/toast.vue";
import type { NotificationType } from "@js/types/toastTypes";

export default function useGetToastShowMethod(toastRef: Ref<InstanceType<typeof Toast> | undefined>) {
    const showMethod = computed(() => {
        if (toastRef.value?.show) {
            return toastRef.value?.show;
        } else {
            return (title: string, message: string, type: NotificationType) => {
                const warnMessage = `If you see this then the app is not yet mounted.\nTitle: ${title}\nMessage: ${message}\nType: ${type}`;
                console.warn(warnMessage);
            };
        }
    });

    return {
        showMethod,
    };
}
