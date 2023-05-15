<template>
    <v-dialog v-model="dialog" persistent max-width="360px">
        <v-card>
            <v-form @submit.prevent="signIn" ref="form">
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <img
                                src="/assets/images/one-beyond-logo-black.svg"
                                height="60"
                                class="mx-auto d-block logo"
                            />
                            <h3 class="text-center">{{ $t("title") }}</h3>
                            <hr />
                            <p class="text-center mb-4">{{ $t("field.twoFactorInfo") }}</p>

                            <div>
                                <label>{{ $t("field.twoFactorCode") }}</label>
                                <v-text-field
                                    type="text"
                                    dense
                                    outlined
                                    v-model="code"
                                    :rules="[rules.code]"
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
                                        v-model="rememberThisMachine"
                                    />
                                    <label class="custom-control-label" for="rememberMe">{{
                                        $t("field.rememberThisMachine")
                                    }}</label>
                                </div>
                            </div>

                            <div class="v-card__actions">
                                <v-btn id="submit2-btn" color="primary" type="submit" :disabled="signingIn">{{
                                    $t("button.signIn")
                                }}</v-btn>
                            </div>

                            <p class="text-center mb-4">
                                {{ $t("field.recoveryInfo") }}
                                <router-link to="loginWithRecoveryCode">{{ $t("field.recoveryCode") }}</router-link>
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
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import dictionary from "@js/localizations/resources/components/loginWithTfa";
    import { SignInStatus } from "@js/dataModels/auth/signInStatus";
    import { SignInResult } from "@js/dataModels/auth/signInResult";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { SignInTfa } from "@js/dataModels/auth/signInTfa";
    import LocalSessionStorage from "@js/stores/localSessionStorage";

    @Component({
        name: "LoginWithTfa",
        i18n: {
            messages: dictionary
        }
    })
    export default class LoginWithTfa extends Vue {
        public signingIn: boolean = false;
        public dialog: boolean = true;
        code: string = "";
        public rememberThisMachine: boolean = false;
        public rememberMe: boolean = false;
        public errorMsg: string = "";

        private authApiClient: AuthApiClient;

        rules: object = {
            code: (value) => !!value || this.$t("message.authenticatorRequired")
        };

        constructor() {
            super();
            this.authApiClient = new AuthApiClient();
        }

        showDialog(): void {
            this.dialog = true;
        }

        get rememberMeFromUrl(): any {
            return this.$route.query.rememberMe;
        }

        async signIn(): Promise<void> {
            if !(this.$refs.form.validate()) {
                return;
            }

            this.signingIn = true;
            this.rememberMe = this.rememberMeFromUrl;

            this.errorMsg = "";
            const defaultError: string = "An error occured while trying to log you in.";

            const userCredentials = new SignInTfa(this.code, this.rememberThisMachine, this.rememberMe);

            try {
                const data: SignInResult = await this.authApiClient.basicSignInTfa(userCredentials);

                if (data.status === SignInStatus.Success) {
                    LocalSessionStorage.setUserAuthenticated(true);
                    window.location.href = `${(window as any).location.origin}/admin/`;
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
