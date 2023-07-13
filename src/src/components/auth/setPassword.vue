<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form ref="formRef">
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ props.isFirstTimeSetup ? t("setTitle") : t("resetTitle") }}</h1>

                                <div v-if="errorMessage">
                                    <div class="alert alert-danger">
                                        {{ errorMessage }}
                                    </div>
                                </div>

                                <v-text-field
                                    class="pt-3"
                                    v-model="password"
                                    type="password"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    name="password"
                                    :disabled="passwordChanged"
                                    :label="t('password')"
                                    @input="resetErrorMessage"
                                    :rules="passwordRules"
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
                                    :label="t('confirmPassword')"
                                    @input="resetErrorMessage"
                                    :rules="[rules.required, rules.passwordMatch]"
                                >
                                </v-text-field>

                                <div class="v-card-actions">
                                    <v-btn id="submit-btn" color="primary" @click="cancel">
                                        {{ t("password.backToLogin") }}
                                    </v-btn>

                                    <v-btn id="submit-btn" :disabled="passwordChanged" color="primary" @click="change">
                                        {{ t("setPasswordButton") }}
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="passwordChanged" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("confirmationMessage.title") }}</h1>

                                <p>{{ t("confirmationMessage.instructions") }}.</p>

                                <div class="v-card__actions">
                                    <v-btn id="submit-btn" color="primary" @click="cancel">
                                        {{ t("password.backToLogin") }}
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

<script setup lang="ts">
    import { ref } from "vue";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import changePassword from "@js/localizations/resources/components/changePassword";
    import { useI18n } from "vue-i18n";
    import { useRoute } from "vue-router";
    import useRules from "@js/composables/useRules";
    import { VForm } from "vuetify/components";
    import { ResetPasswordStatus } from "@js/dataModels/auth/resetPasswordStatus";

    const props = defineProps<{
        isFirstTimeSetup: boolean;
    }>();

    const $route = useRoute();

    const { t } = useI18n({
        messages: changePassword,
    });

    const formRef = ref<VForm | null>(null);

    const password = ref("");
    const confirmPassword = ref("");
    const showForm = ref(true);
    const passwordChanged = ref(false);
    const errorMessage = ref("");

    const token = $route.query.code?.toString();
    const userId = $route.query.loginId?.toString();
    const authApiClient = new AuthApiClient();

    const rules = useRules({ fieldToMatch: password });
    const passwordRules = await rules.getPasswordValidationRules(authApiClient);

    function cancel(): void {
        window.location.href = "/";
    }

    function resetErrorMessage(): void {
        errorMessage.value = "";
    }

    async function change() {
        if (!(token && userId)) {
            errorMessage.value = t("password.resetPasswordInvalidToken");
            return;
        }

        const { valid } = await formRef.value!.validate();

        if (valid) {
            try {
                passwordChanged.value = true;
                showForm.value = false;

                const response = await authApiClient.resetPassword(userId, password.value, token);
                switch (response) {
                    case ResetPasswordStatus.Success:
                        passwordChanged.value = true;
                        showForm.value = false;
                        break;
                    case ResetPasswordStatus.InvalidToken:
                        errorMessage.value = t("password.resetPasswordInvalidToken");
                        break;
                    default:
                        errorMessage.value = t("password.unknownError");
                        break;
                }
            } catch {
                errorMessage.value = t("password.unknownError");
            }
        }
    }
</script>

