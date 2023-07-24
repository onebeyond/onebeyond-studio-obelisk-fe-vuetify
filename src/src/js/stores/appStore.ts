import { defineStore } from "pinia";
import { ref } from "vue";
import { UserContext } from "../dataModels/users/userContext";
import AccountApiClient from "@js/api/accounts/accountApiClient";
import LocalSessionStorage from "@js/stores/localSessionStorage";

export const useUserContextStore = defineStore("userContext", () => {
    const userContext = ref(new UserContext());
    const accountApiClient = new AccountApiClient();

    async function getUserContext(): Promise<void> {
        if (userContext.value.isEmpty()) {
            try {
                const newUserContext: UserContext = await accountApiClient.whoAmI();
                userContext.value = newUserContext
            } catch {
                // Redirect to Login page if unable to get the User Context
                LocalSessionStorage.setUserAuthenticated(false);
                window.location.href = `${(window as any).location.origin}/auth/`;
            }
        }
    }

    return { userContext, getUserContext };
});
