<template>
    <v-app id="app">
        <v-app-bar color="primary" class="white--text" dark app>
            <img src="/assets/images/one-beyond-logo-black.svg" id="headerLogo" alt="Company logo" />
            <div id="topNav">
                <router-link to="/">Home</router-link>
                <router-link to="/users">Users</router-link>
            </div>
            <v-spacer></v-spacer>
            <v-app-bar-nav-icon class="white--text" right @click="drawer = true"></v-app-bar-nav-icon>
            <div id="userActions">
                <v-menu offset-y transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                        <span color="primary" dark v-bind="props">
                            <UserAvatar
                                :fullName="store.userContext.userName"
                                :initials="store.userContext.initials"
                            ></UserAvatar>
                        </span>
                    </template>
                    <v-list dense>
                        <v-list-item>
                            <v-icon>mdi-account-outline</v-icon>
                            <strong>{{ store.userContext.userName }}</strong>
                        </v-list-item>
                        <hr />
                        <v-list-item>
                            <v-icon>mdi-form-textbox-password</v-icon>
                            <router-link to="/changePassword">{{ $t("layout.changePassword") }}</router-link>
                        </v-list-item>
                        <v-list-item>
                            <v-icon>mdi-two-factor-authentication</v-icon>
                            <router-link to="/twoFactorAuthentication">{{ t("AuthenticatorSettings") }}</router-link>
                        </v-list-item>
                        <hr />
                        <v-list-item>
                            <v-icon>mdi-logout</v-icon>
                            <a @click="performLogout">{{ t("logout") }}</a>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app temporary>
            <v-list nav>
                <!-- <v-list-group v-model="group1" active-class="deep-purple--text text--accent-4"> -->
                <v-list-item>
                    <v-icon>mdi-home</v-icon>
                    <v-list-item-title>
                        <router-link to="/">{{ t("dashboard") }}</router-link>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-icon>mdi-account-multiple</v-icon>
                    <v-list-item-title>
                        <router-link to="/users"> {{ t("users") }}</router-link>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-icon>mdi-form-textbox-password</v-icon>
                    <v-list-item-title>
                        <router-link to="/changePassword">{{ $t("layout.changePassword") }}</router-link>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-icon>mdi-two-factor-authentication</v-icon>
                    <v-list-item-title>
                        <router-link to="/twoFactorAuthentication">{{ t("AuthenticatorSettings") }}</router-link>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-icon>mdi-logout</v-icon>
                    <v-list-item-title @click="performLogout">{{ t("logout") }}</v-list-item-title>
                </v-list-item>
                <!-- </v-list-group> -->
            </v-list>
        </v-navigation-drawer>

        <!-- Sizes your content based upon application components -->
        <v-main class="page-body">
            <global-error-handler>
                <!-- Provides the application the proper gutter -->
                <v-container fluid>
                    <Suspense>
                        <router-view></router-view>
                    </Suspense>
                </v-container>
            </global-error-handler>
        </v-main>
        <Toast ref="globalToastRef" />
        <v-footer padless>
            <v-card width="100%" class="text-center" flat tile>
                <v-card-text class="pt-3">
                    {{ t("application.applicationName") }} - {{ t("application.developedBy") }}
                    <a href="https://www.one-beyond.com" target="_blank">One Beyond -</a>
                    {{ t("application.build") }}: {{ $buildNumber }} ({{ $buildDate }})
                </v-card-text>
            </v-card>
        </v-footer>

        <global-error-handler>
            <!--@* Session timeout *@-->
            <session-timeout></session-timeout>

            <!-- @* User Context*@-->
            <user-context></user-context>
        </global-error-handler>
    </v-app>
</template>

<script setup lang="ts">
    import UserAvatar from "@components/util/userAvatar.vue";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { useUserContextStore } from "@js/stores/appStore";
    import { useI18n } from "vue-i18n";
    import adminAppTranslation from "@js/localizations/resources/components/admin/adminApp";
    import { inject, provide, ref, type Ref } from "vue";
    import { ShowAlertKey } from "@js/util/symbols";
    import Toast from "@components/obComponents/toast.vue";
    import useGetToastShowMethod from "@js/composables/useGetToastShowMethod";

    let drawer = ref(false);
    const { t } = useI18n({
        messages: adminAppTranslation,
    });
    const $buildNumber = inject("$buildNumber");
    const $buildDate = inject("$buildDate");
    const store = useUserContextStore();
    const authApiClient: AuthApiClient = new AuthApiClient();

    const globalToastRef: Ref<InstanceType<typeof Toast> | undefined> = ref();
    const { showMethod } = useGetToastShowMethod(globalToastRef);
    provide(ShowAlertKey, showMethod);

    async function performLogout(): Promise<void> {
        await authApiClient.signOut();
        window.location.href = `${(window as any).location.origin}/auth/`;
    }
</script>
