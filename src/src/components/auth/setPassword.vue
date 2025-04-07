<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form ref="formRef">
                    <v-card-title>
                        <h1>{{ props.isFirstTimeSetup ? t("setTitle") : t("resetTitle") }}</h1>
                    </v-card-title>
                    <v-card-text>
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
                    </v-card-text>
                    <v-card-actions>
                        <v-btn id="submit-btn" color="secondary" @click="cancel">
                            {{ t("password.backToLogin") }}
                        </v-btn>

                        <v-btn id="submit-btn" :disabled="passwordChanged" color="primary" @click="change">
                            {{ t("setPasswordButton") }}
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="passwordChanged" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-card-title>
                        <h1>{{ t("confirmationMessage.title") }}</h1>
                    </v-card-title>
                    <v-card-text>
                        <p>{{ t("confirmationMessage.instructions") }}.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn id="submit-btn" color="primary" @click="cancel">
                            {{ t("password.backToLogin") }}
                        </v-btn>
                    </v-card-actions>
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
    import useGlobalNotification from "@js/composables/useGlobalNotification";

    const props = defineProps<{
        isFirstTimeSetup: boolean;
    }>();

    const $route = useRoute();

    const { t } = useI18n({
        messages: changePassword,
    });

    const formRef = ref<VForm | null>(null);
    const { onError } = useGlobalNotification();
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
            onError(t("password.unknownError"));
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
