import { defineStore } from "pinia";
import type { Ref } from "vue";
import { UserContext } from "../dataModels/users/userContext";
import useLocalStorage from "@js/composables/useLocalStorage";

export const useUserContextStore = defineStore("userContext", () => {
    const userContext: Ref<UserContext> = useLocalStorage("userContext", new UserContext(), UserContext);

    function setUserContext(newUserContext: UserContext) {
        userContext.value = newUserContext;
    }

    function clearUserContext(): void {
        userContext.value = new UserContext();
    }

    return { userContext, setUserContext, clearUserContext };
});
