<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="360px">
            <v-card>
                <v-form ref="form" @submit.prevent="signIn">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <img
                                    src="/assets/images/one-beyond-logo-black.svg"
                                    height="60"
                                    class="mx-auto d-block logo"
                                />
                                <h1 class="text-center mt-2 mb-4">{{ $t("title") }}</h1>

                                <div>
                                    <label>{{ $t("field.username") }}</label>
                                    <v-text-field
                                        dense
                                        outlined
                                        v-model="username"
                                        :rules="[rules.username]"
                                        data-cy="inputUserName"
                                    ></v-text-field>
                                </div>

                                <div>
                                    <label for="password">{{ $t("field.password") }}</label>
                                    <v-text-field
                                        dense
                                        outlined
                                        type="password"
                                        v-model="password"
                                        :rules="[rules.password]"
                                        data-cy="inputPassword"
                                    ></v-text-field>
                                </div>

                                <div class="text-center">
                                    <div class="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            class="custom-control-input"
                                            id="rememberMe"
                                            name="rememberMe"
                                            value="true"
                                            v-model="rememberMe"
                                        />
                                        <label class="custom-control-label" for="rememberMe">{{
                                            $t("field.rememberMe")
                                        }}</label>
                                    </div>
                                </div>
                                <div class="v-card__actions border-0">
                                    <v-btn
                                        id="submit-btn"
                                        color="primary"
                                        type="submit"
                                        :disabled="signingIn"
                                        data-cy="submitBtn"
                                        >{{ $t("button.signIn") }}</v-btn
                                    >
                                </div>
                                <p class="v-card__actions border-0">
                                    <router-link to="forgotPassword">{{ $t("button.forgottenPassword") }}</router-link>
                                </p>

                                <div v-if="errorMsg">
                                    <v-alert border="top" color="red lighten-2" dark>
                                        {{ errorMsg }}
                                    </v-alert>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import dictionary from "@js/localizations/resources/components/signIn";
    import { SignInStatus } from "@js/dataModels/auth/signInStatus";
    import { SignInResult } from "@js/dataModels/auth/signInResult";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { SignInRequest } from "@js/dataModels/auth/signInRequest";
    import LocalSessionStorage from "@js/stores/localSessionStorage";

    @Component({
        name: "SignIn",
        i18n: {
            messages: dictionary
        }
    })
    export default class SignIn extends Vue {
        public signingIn: boolean = false;
        public dialog: boolean = true;
        username: string = "";
        password: string = "";
        public rememberMe: boolean = false;
        public errorMsg: string = "";

        private authApiClient: AuthApiClient;

        rules: object = {
            username: (value) => !!value || this.$t("message.userNameRequired"),
            password: (value) => !!value || this.$t("message.passwordRequired")
        };

        constructor() {
            super();
            this.authApiClient = new AuthApiClient();
        }

        showDialog(): void {
            this.dialog = true;
        }

        async signIn(): Promise<void> {
            if !(this.$refs.form.validate()) {
                return;
            }

            this.signingIn = true;

            this.errorMsg = "";
            const defaultError: string = "An error occured while trying to log you in.";

            const userCredentials = new SignInRequest(this.username, this.password, this.rememberMe);

            try {
                const data: SignInResult = await this.authApiClient.basicSignIn(userCredentials);

                if (data.status === SignInStatus.Success) {
                    LocalSessionStorage.setUserAuthenticated(true);
                    window.location.href = `${(window as any).location.origin}/admin/`;
                } else if (data.status === SignInStatus.RequiresVerification) {
                    this.$router.push(
                        {
                            name: "loginWithTfa",
                            query: { rememberMe: this.rememberMe }
                        });
                } else {
                    this.errorMsg = defaultError;
                }
            } catch {
                this.errorMsg = defaultError;
            } finally {
                this.signingIn = false;
            }
        }
    }
</script>
