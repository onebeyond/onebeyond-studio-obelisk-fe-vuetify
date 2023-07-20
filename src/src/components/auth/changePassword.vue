<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form ref="formRef">
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ title }}</h1>
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

                                <p>{{ t("confirmationMessage.instructions") }}</p>

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
    import { ref, toRef } from "vue";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import changePassword from "@js/localizations/resources/components/changePassword";
    import { useI18n } from "vue-i18n";
    import { useRoute } from "vue-router";
    import useRules from "@js/composables/useRules";
    import { VForm } from "vuetify/components";
    import { ResetPasswordStatus } from "@js/dataModels/auth/resetPasswordStatus";
    import useGlobalNotification from "@js/composables/useGlobalNotification";

    const props = defineProps<{
        title: string;
    }>();

    const title = toRef(props, "title");
    const { onError } = useGlobalNotification();
    const $route = useRoute();

    const { t } = useI18n({
        messages: changePassword,
    });

    const formRef = ref<VForm | null>(null);

    const password = ref("");
    const confirmPassword = ref("");
    const showForm = ref(true);
    const passwordChanged = ref(false);

    const token = $route.query.code?.toString();
    const userId = $route.query.loginId?.toString();
    const authApiClient = new AuthApiClient();

    const rules = useRules({ fieldToMatch: password });
    const passwordRules = await rules.getPasswordValidationRules(authApiClient);

    function cancel(): void {
        window.location.href = "/";
    }

    async function change() {
        if (!(token && userId)) {
            onError(t("password.resetPasswordInvalidToken"));
            return;
        }

        const { valid } = await formRef.value!.validate();

        if (valid) {
            try {
                const response = await authApiClient.resetPassword(userId, password.value, token);
                switch (response) {
                    case ResetPasswordStatus.Success:
                        passwordChanged.value = true;
                        showForm.value = false;
                        break;
                    case ResetPasswordStatus.InvalidToken:
                        onError(t("password.resetPasswordInvalidToken"));

                        break;
                    default:
                        onError(t("password.unknownError"));
                        break;
                }
            } catch {
                onError(t("password.unknownError"));
            }
        }
    }
</script>
