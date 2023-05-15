<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ $t("title") }}</h1>
                                <v-card-text>
                                    <p>{{ $t("instructions") }}</p>

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
                                        v-model="oldPassword"
                                        type="text"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        :disabled="passwordChanged"
                                        name="oldPassword"
                                        v-validate="'required'"
                                        :data-vv-as="$t('oldPassword')"
                                        :label="$t('oldPassword')"
                                        @input="passwordError = false"
                                        :error-messages="errors.collect('oldPassword')"
                                    >
                                    </v-text-field>

                                    <v-text-field
                                        class="pt-3"
                                        v-model="newPassword"
                                        type="password"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        name="newPassword"
                                        :disabled="passwordChanged"
                                        v-validate="'required|min:10|max:100'"
                                        :data-vv-as="$t('newPassword')"
                                        :label="$t('newPassword')"
                                        @input="passwordError = false"
                                        :error-messages="errors.collect('newPassword')"
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
                                        v-validate="{ passwordMatch: [newPassword, confirmPassword], required: true }"
                                        :data-vv-as="$t('confirmPassword')"
                                        :label="$t('confirmPassword')"
                                        @input="passwordError = false"
                                        :error-messages="errors.collect('confirmPassword')"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <div class="v-card__actions">
                                    <v-btn v-if="passwordChanged" color="primary" @click="cancel">
                                        {{ $t("button.close") }}
                                    </v-btn>
                                    <v-btn v-if="!passwordChanged" @click="cancel">
                                        {{ $t("button.cancel") }}
                                    </v-btn>
                                    <v-btn v-if="!passwordChanged" color="primary" @click="change">
                                        {{ $t("button.change") }}
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
    import changePassword from "@js/localizations/resources/components/changePassword";
    import { ChangePasswordRequest } from "@js/dataModels/auth/changePasswordRequest";

    @Component({
        name: "usersApp",
        components: {
            textFieldGridSearch
        },
        i18n: {
            messages: changePassword
        }
    })
    export default class ChangePassword extends Vue {
        showForm: boolean = true;

        oldPassword: string = "";
        newPassword: string = "";
        confirmPassword: string = "";
        errorMsg: string = "";
        passwordChanged: boolean = false;
        passwordError: boolean = false;

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

        authApiClient!: AuthApiClient = new AuthApiClient();

        constructor() {
            super();
        }

        created(): void {
            this.$validator.extend("passwordMatch", this.passwordMatch);
        }

        cancel(): void {
            this.$router.go(-1);
        }

        async change(): Promise<void> {
            const validationPassed = await this.$validator.validateAll();

            if (validationPassed) {
                var response = await this.authApiClient.changePassword(
                    new ChangePasswordRequest(this.oldPassword, this.newPassword)
                );

                var changePasswordResult = await response.json();
                if (!changePasswordResult.success) {
                    this.passwordError = true;
                } else {
                    this.passwordChanged = true;
                }
            }
        }
    }
</script>
