<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form v-model="isFormValid">
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}?</h1>

                                <v-card-text>
                                    <p>{{ t("instructions") }}.</p>

                                    <div v-if="passwordError">
                                        <v-alert type="error">
                                            {{ t("password.unknownError") }}
                                        </v-alert>
                                    </div>

                                    <v-text-field
                                        v-model="emailInput"
                                        type="text"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        name="email"
                                        :data-vv-as="t('password.email')"
                                        :label="t('password.email')"
                                        @input="passwordError = false"
                                        :rules="[rules.required, rules.email]"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <div class="v-card__actions">
                                    <v-btn id="submit-btn" @click="cancel">{{ t("button.cancel") }}</v-btn>
                                    <v-btn 
                                        id="submit-btn"
                                        color="primary"
                                        @click="sendResetPassword"
                                        :disabled="!isFormValid"
                                    >
                                        {{ t("resetButton") }}
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
        <v-modalPopup :visible="showPasswordConfirmation" :title="t('confirmationMessage.title')" @close="cancel">
            <template #content>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <p>{{ t("confirmationMessage.instructions") }}.</p>
                        </v-col>
                    </v-row>
                </v-container>
            </template>
            <template #footer>
                <div class="v-card__actions">
                    <v-btn id="submit-btn" color="primary" @click="cancel">
                        {{ t("password.backToLogin") }}
                    </v-btn>
                </div>
            </template>
        </v-modalPopup>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"; 
    import AuthApiClient from "@js/api/auth/authApiClient";
    import forgotPassword from "@js/localizations/resources/components/forgotPassword";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import useRules from "@js/composables/useRules"

    const $router = useRouter();
    const rules = useRules();

    const { t } = useI18n({
        messages: forgotPassword,
    });

    const emailInput = ref("");
    let showForm: boolean = true;
    let passwordError = ref(false);
    let showPasswordConfirmation = ref(false);
    let authApiClient: AuthApiClient = new AuthApiClient();
    const isFormValid = ref(false);

    async function sendResetPassword(): Promise<void> {
        try {
            await authApiClient.forgotPassword(emailInput.value);
            showPasswordConfirmation.value = true;
        } catch {
            passwordError.value = true;
        }
    };

    async function cancel() {
        await $router.push({ name: "SignIn" });
    }
</script>