<template>
    <div></div>
</template>

<script lang="ts">
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { WebApiError } from "@js/api/webApiClient";
    import { UserContext } from "@js/dataModels/users/userContext";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import { Vue, Component } from "vue-property-decorator";

    @Component({
        name: "UserContextSetter",
        components: {},
    })
    export default class UserContextSetter extends Vue {
        private authApiClient: AuthApiClient;

        constructor() {
            super();
            this.authApiClient = new AuthApiClient();
        }

        async created(): Promise<void> {
            if (this.$store.state.userContext.isEmpty()) {
                try {
                    const userContext: UserContext = await this.authApiClient.whoAmI();
                    this.$store.commit("setUserContext", userContext);
                } catch (e: any) {
                    if (e.httpCode && e.httpCode === WebApiError.UnreachableServerHttpCode) {
                        // If server is unreachable, rethrow so that it gets caught by the global error handler
                        throw e;
                    } else {
                        // Redirect to Login page if unable to get the User Context
                        LocalSessionStorage.setUserAuthenticated(false);
                        window.location.href = `${(window as any).location.origin}/auth/`;
                    }
                }
            }
        }
    }
</script>
