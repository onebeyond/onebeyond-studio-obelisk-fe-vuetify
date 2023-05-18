import { computed, type ComputedRef } from "vue";
import { UserRole } from "../dataModels/users/userRole";
import { useUserContextStore } from "@js/stores/appStore";

export default function useUserContext() {
    const store = useUserContextStore();

    const myId: ComputedRef<string> = computed(() => store.userContext.userId);
    const isAdmin: ComputedRef<boolean> = computed(() => store.userContext.isInRole(UserRole.ADMINISTRATOR));
    const isUser: ComputedRef<boolean> = computed(() => store.userContext.isInRole(UserRole.USER));

    return {
        myId,
        isAdmin,
        isUser,
    };
}
