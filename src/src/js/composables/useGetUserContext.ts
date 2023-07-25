import type { UserContext } from "@js/dataModels/users/userContext";
import LocalSessionStorage from "@js/stores/localSessionStorage";
import { useUserContextStore } from "@js/stores/appStore";
import AccountApiClient from "@js/api/accounts/accountApiClient";
import { storeToRefs } from "pinia";

export default function useGetUserContext() {
    const accountApiClient = new AccountApiClient();
    const store = useUserContextStore();
    const { userContext } = storeToRefs(store);

    async function getUserContext(): Promise<void> {
        if (userContext.value.isEmpty()) {
            try {
                const newUserContext: UserContext = await accountApiClient.whoAmI();
                store.setUserContext(newUserContext);
            } catch {
                // Redirect to Login page if unable to get the User Context
                LocalSessionStorage.setUserAuthenticated(false);
                window.location.href = `${(window as any).location.origin}/auth/`;
            }
        }
    }

    return { getUserContext, userContext };
}
