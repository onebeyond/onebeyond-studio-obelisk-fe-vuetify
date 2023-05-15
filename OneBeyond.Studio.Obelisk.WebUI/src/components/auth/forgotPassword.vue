<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ $t("title") }}?</h1>

                                <v-card-text>
                                    <p>{{ $t("instructions") }}.</p>

                                    <div v-if="passwordError">
                                        <v-alert type="error">
                                            {{ $t("password.unknownError") }}
                                        </v-alert>
                                    </div>

                                    <v-text-field
                                        v-model="email"
                                        type="text"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        name="email"
                                        v-validate="'required|email'"
                                        :data-vv-as="$t('password.email')"
                                        :label="$t('password.email')"
                                        @input="passwordError = false"
                                        :error-messages="errors.collect('email')"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <div class="v-card__actions">
                                    <v-btn id="submit-btn" @click="cancel">{{ $t("button.cancel") }}</v-btn>
                                    <v-btn id="submit-btn" color="primary" @click="sendResetPassword">
                                        {{ $t("resetButton") }}
                                    </v-btn>
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
    import textFieldGridSearch from "@components/util/vuetify/textFieldGridSearch.vue";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import forgotPassword from "@js/localizations/resources/components/forgotPassword";

    @Component({
        name: "forgotPassword",
        components: {
            textFieldGridSearch
        },
        i18n: {
            messages: forgotPassword
        }
    })
    export default class ForgotPassword extends Vue {
        showForm: boolean = true;

        email: string = "";
        passwordError: boolean = false;

        authApiClient!: AuthApiClient = new AuthApiClient();

        constructor() {
            super();
        }

        created(): void {}

        async sendResetPassword(): Promise<void> {
            const validationPassed = await this.$validator.validateAll();

            if (validationPassed) {
                try {
                    await this.authApiClient.forgotPassword(this.email, window.location.origin + "/auth/resetPassword");
                    this.$router.push({ name: "forgotPasswordConfirm" });
                } catch {
                    this.passwordError = true;
                }
            }
        }

        cancel(): void {
            this.$router.push({ name: "SignIn" });
        }
    }
</script>
