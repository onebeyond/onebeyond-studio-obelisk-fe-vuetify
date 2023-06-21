<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}</h1>

                                <div v-if="passwordError">
                                    <div class="alert alert-danger">
                                        {{ t("password.unknownError") }}
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
                                    @input="passwordError = false"
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
                                    @input="passwordError = false"
                                    :rules="[rules.required, rules.passwordMatch]"
                                >
                                </v-text-field>

                                <div class="v-card__actions">
                                    <v-btn id="submit-btn" color="primary" @click="cancel">
                                        {{ t("password.backToLogin") }}
                                    </v-btn>

                                    <v-btn id="submit-btn" :disabled="passwordChanged" color="primary" @click="change">
                                        {{ t("SetPasswordButton") }}
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
        <v-modalPopup :visible="passwordChanged" :title="t('confirmationMessage.title')" @close="cancel">
            <template #content>
                <v-container>
                    <v-row>
                        <v-col class="col" text cols="12">
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
    import resetPassword from "@js/localizations/resources/components/resetPassword";
    import { useI18n } from "vue-i18n";
    import { useRouter, useRoute } from "vue-router";
    import useRules from "@js/composables/useRules"

    const $route = useRoute();
    const $router = useRouter();
    
    const { t } = useI18n({
        messages: resetPassword
    });
    
    const showForm: boolean = true;
    const password = ref("");
    const confirmPassword = ref("");
    const token: string | undefined = $route.query.code?.toString();
    let userId: string | undefined = $route.query.loginId?.toString();
    const passwordChanged = ref(false);
    const passwordError = ref(false);
    
    let authApiClient: AuthApiClient = new AuthApiClient();
    const rules = useRules({ fieldToMatch: password});
    const passwordRules = await rules.getPasswordValidationRules(authApiClient);

    function cancel(): void {
        window.location.href = "/";
    }

    async function change(_values) {
        if (!(token && userId)) {
            passwordError.value = true;
            return;
        }

        try {
            await authApiClient.resetPassword(userId, password.value, token);
            passwordChanged.value = true;
        } catch {
            passwordError.value = true;
        }
    }
</script>
