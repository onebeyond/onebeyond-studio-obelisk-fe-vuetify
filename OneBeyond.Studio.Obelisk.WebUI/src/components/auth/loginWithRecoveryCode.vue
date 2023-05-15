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
                            <p class="text-center mb-4">{{ $t("message.recoveryInfo") }}</p>

                            <div>
                                <label>{{ $t("field.recoveryCode") }}</label>
                                <v-text-field dense outlined v-model="code" :rules="[rules.code]"></v-text-field>
                            </div>

                            <div class="v-card__actions">
                                <v-btn id="submit-btn" color="primary" type="submit" :disabled="signingIn">{{
                                    $t("button.signIn")
                                }}</v-btn>
                            </div>

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
    import dictionary from "@js/localizations/resources/components/loginWithRecoveryCode";
    import { SignInStatus } from "@js/dataModels/auth/signInStatus";
    import { SignInWithRecoveryCodeResult } from "@js/dataModels/auth/signInResultWithRecoveryCode";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { SignInWithRecoveryCode } from "@js/dataModels/auth/signInWithRecoveryCode";
    import LocalSessionStorage from "@js/stores/localSessionStorage";

    @Component({
        name: "loginWithRecoveryCode",
        i18n: {
            messages: dictionary
        }
    })
    export default class LoginWithRecoveryCode extends Vue {
        public signingIn: boolean = false;
        public dialog: boolean = true;
        code: string = "";
        public errorMsg: string = "";

        private authApiClient: AuthApiClient;

        rules: object = {
            code: (value) => !!value || this.$t("message.codeRequired")
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

            const userCredentials = new SignInWithRecoveryCode(this.code);

            try {
                const data: SignInWithRecoveryCodeResult = await this.authApiClient.basicSignInWithRecoveryCode(
                    userCredentials
                );

                console.log(data.status);
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
