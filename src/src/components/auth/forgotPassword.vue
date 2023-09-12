<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form ref="formRef">
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}?</h1>

                                <v-card-text>
                                    <p>{{ t("instructions") }}.</p>

                                    <v-text-field
                                        v-model="emailInput"
                                        type="text"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        name="email"
                                        :data-vv-as="t('password.email')"
                                        :label="t('password.email')"
                                        :rules="[rules.required, rules.email]"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <div class="v-card-actions">
                                    <v-btn id="submit-btn" @click="cancel">{{ t("button.cancel") }}</v-btn>
                                    <v-btn id="submit-btn" color="primary" @click="sendResetPassword">
                                        {{ t("resetButton") }}
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showPasswordConfirmation" persistent max-width="480px">
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
    import forgotPassword from "@js/localizations/resources/components/forgotPassword";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import useRules from "@js/composables/useRules";
    import { VForm } from "vuetify/components";
    import useGlobalNotification from "@js/composables/useGlobalNotification";

    const $router = useRouter();
    const rules = useRules();
    const formRef = ref<VForm | null>(null);

    const { t } = useI18n({
        messages: forgotPassword,
    });

    const { onError } = useGlobalNotification();
    const emailInput = ref("");
    const showForm = ref(true);
    const showPasswordConfirmation = ref(false);
    const authApiClient: AuthApiClient = new AuthApiClient();

    async function sendResetPassword() {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            try {
                await authApiClient.forgotPassword(emailInput.value);
                showPasswordConfirmation.value = true;
                showForm.value = false;
            } catch {
                onError(t("password.unknownError"));
            }
        }
    }

    async function cancel() {
        await $router.push({ name: "SignIn" });
    }
</script>
