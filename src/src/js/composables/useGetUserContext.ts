import type { UserContext } from "@js/dataModels/users/userContext";
import LocalSessionStorage from "@js/stores/localSessionStorage";
import { useUserContextStore } from "@js/stores/appStore";
import AccountApiClient from "@js/api/accounts/accountApiClient";

export default function useGetUserContext() {
    const accountApiClient = new AccountApiClient();
    const { userContext, setUserContext } = useUserContextStore();

    async function getUserContext(): Promise<void> {
        if (userContext.isEmpty()) {
            try {
                const userContext: UserContext = await accountApiClient.whoAmI();
                setUserContext(userContext);
            } catch {
                // Redirect to Login page if unable to get the User Context
                LocalSessionStorage.setUserAuthenticated(false);
                window.location.href = `${(window as any).location.origin}/auth/`;
            }
        }
    }

    return { getUserContext };
}
