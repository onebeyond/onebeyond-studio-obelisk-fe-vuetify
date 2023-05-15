<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ $t("title") }}</h1>

                                <div v-if="passwordError">
                                    <v-alert type="error">
                                        {{ $t("password.unknownError") }}
                                    </v-alert>
                                </div>

                                <div v-if="passwordChanged">
                                    <v-alert dense text type="success">
                                        {{ $t("password.passwordChanged") }}
                                    </v-alert>
                                </div>

                                <v-text-field
                                    v-model="userName"
                                    type="text"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    :disabled="passwordChanged"
                                    name="userName"
                                    v-validate="'required'"
                                    :data-vv-as="$t('userName')"
                                    :label="$t('userName')"
                                    @input="passwordError = false"
                                    :error-messages="errors.collect('userName')"
                                >
                                </v-text-field>

                                <v-text-field
                                    class="pt-3"
                                    v-model="password"
                                    type="password"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    name="password"
                                    :disabled="passwordChanged"
                                    v-validate="'required|min:10|max:100'"
                                    :data-vv-as="$t('password')"
                                    :label="$t('password')"
                                    @input="passwordError = false"
                                    :error-messages="errors.collect('password')"
                                >
                                </v-text-field>

                                <v-text-field
                                    class="pt-3"
                                    v-model="confirmPassword"
                                    type="password"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    name="confirmPassword"
                                    :disabled="passwordChanged"
                                    v-validate="{ passwordMatch: [password, confirmPassword], required: true }"
                                    :data-vv-as="$t('confirmPassword')"
                                    :label="$t('confirmPassword')"
                                    @input="passwordError = false"
                                    :error-messages="errors.collect('confirmPassword')"
                                >
                                </v-text-field>

                                <div class="v-card__actions">
                                    <v-btn id="submit-btn" color="primary" @click="cancel">
                                        {{ $t("password.backToLogin") }}
                                    </v-btn>

                                    <v-btn id="submit-btn" :disabled="passwordChanged" color="primary" @click="change">
                                        {{ $t("SetPasswordButton") }}
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
    import resetPassword from "@js/localizations/resources/components/resetPassword";

    @Component({
        name: "usersApp",
        components: {
            textFieldGridSearch
        },
        i18n: {
            messages: resetPassword
        }
    })
    export default class ChangePassword extends Vue {
        showForm: boolean = true;

        userName: string = "";
        password: string = "";
        confirmPassword: string = "";
        code: string = "";

        passwordChanged: boolean = false;
        passwordError: boolean = false;

        authApiClient!: AuthApiClient = new AuthApiClient();

        passwordMatch = {
            getMessage(field, args) {
                if (args[0] != args[1]) {
                    return `The passwords must match}`;
                }

                return "";
            },
            validate(value, args) {
                return args[0] == args[1];
            }
        };

        constructor() {
            super();
        }

        cancel(): void {
            window.location.href = "/";
        }

        created(): void {
            this.$validator.extend("passwordMatch", this.passwordMatch);
            this.code = this.$route.query.code.toString();
        }

        async change(): Promise<void> {
            const validationPassed = await this.$validator.validateAll();

            if (validationPassed) {
                try {
                    await this.authApiClient.resetPassword(this.userName, this.password, this.code);
                    this.passwordChanged = true;

                    //    this.$router.push({ name: 'forgotPasswordConfirm' });
                } catch {
                    this.passwordError = true;
                }
            }
        }
    }
</script>
