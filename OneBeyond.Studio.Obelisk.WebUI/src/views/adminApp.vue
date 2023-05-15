<template>
    <v-app id="app">
        <v-app-bar color="primary" class="white--text" dark app>
            <img src="/assets/images/one-beyond-logo.svg" id="headerLogo" />
            <div id="topNav">
                <router-link to="/">Home</router-link>
                <router-link to="/users">Users</router-link>
            </div>
            <v-spacer></v-spacer>
            <v-app-bar-nav-icon class="white--text" right @click="drawer = true"></v-app-bar-nav-icon>
            <div id="userActions">
                <v-menu offset-y transition="slide-y-transition">
                    <template v-slot:activator="{ on, attrs }">
                        <span color="primary" dark v-bind="attrs" v-on="on">
                            <user-avatar :fullName="userName" :initials="userInitials"></user-avatar>
                        </span>
                    </template>
                    <v-list dense>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-account-outline</v-icon>
                            </v-list-item-icon>
                            <strong>{{ userName }}</strong>
                        </v-list-item>
                        <hr />
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-form-textbox-password</v-icon>
                            </v-list-item-icon>
                            <router-link to="/changePassword">{{ $t("layout.changePassword") }}</router-link>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-two-factor-authentication</v-icon>
                            </v-list-item-icon>
                            <router-link to="/twoFactorAuthentication">Authenticator Settings</router-link>
                        </v-list-item>
                        <hr />
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <a @click="performLogout">Logout</a>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app temporary>
            <v-list nav>
                <v-list-item-group v-model="group1" active-class="deep-purple--text text--accent-4">
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            <router-link to="/">Home</router-link>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-account-multiple</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            <router-link to="/users">Users</router-link>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-form-textbox-password</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            <router-link to="/changePassword">{{ $t("layout.changePassword") }}</router-link>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-two-factor-authentication</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            <router-link to="/twoFactorAuthentication">Authenticator Settings</router-link>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title @click="performLogout">Logout</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
                <v-subheader></v-subheader>
            </v-list>
        </v-navigation-drawer>

        <!-- Sizes your content based upon application components -->
        <v-main class="page-body">
            <global-error-handler>
                <!-- Provides the application the proper gutter -->
                <v-container fluid>
                    <router-view></router-view>
                </v-container>
            </global-error-handler>
        </v-main>

        <v-footer padless>
            <v-card width="100%" class="text-center" flat tile>
                <v-card-text class="pt-3">
                    Obelisk Template Developed by
                    <a href="https://www.one-beyond.com" target="_blank">One Beyond</a>
                    Build: {{ $buildNumber }} ({{ $buildDate }})
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

<script lang="ts">
    import { Component, Mixins, Vue } from "vue-property-decorator";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import UserAvatar from "@components/util/userAvatar.vue";
    import UserContextMixin from "@js/mixins/userContextMixin";

    @Component({
        name: "App",
        components: {
            "user-avatar": UserAvatar
        }
    })
    export default class App extends Mixins(UserContextMixin) {
        public drawer: boolean = false;
        public group1: any = null;
        public group2: any = null;

        public installationPrompt: any | null = null;

        authApiClient!: AuthApiClient = new AuthApiClient();

        constructor() {
            super();
        }

        public async created(): Promise<void> {}

        public mounted(): void {}

        public async performLogout(): Promise<void> {
            await this.authApiClient.signOut();
            window.location.href = `${(window as any).location.origin}/auth/`;
        }
    }
</script>
