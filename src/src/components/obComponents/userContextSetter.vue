<template>
    <div />
</template>

<script setup lang="ts">
    import AccountApiClient from "@js/api/accounts/accountApiClient";
    import type { UserContext } from "@js/dataModels/users/userContext";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import { onMounted } from "vue";
    import { useUserContextStore } from "../../js/stores/appStore";

    const accountApiClient = new AccountApiClient();
    const store = useUserContextStore();

    onMounted(async () => {
        if (store.userContext.isEmpty()) {
            try {
                const userContext: UserContext = await accountApiClient.whoAmI();
                store.setUserContext(userContext);
            } catch {
                // Redirect to Login page if unable to get the User Context
                LocalSessionStorage.setUserAuthenticated(false);
                window.location.href = `${(window as any).location.origin}/auth/`;
            }
        }
    });
</script>
