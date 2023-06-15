<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form ref="formRef">
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}</h1>

                                <div v-if="passwordError">
                                    <v-alert type="error">
                                        {{ t("password.unknownError") }}
                                    </v-alert>
                                </div>

                                <div v-if="passwordChanged">
                                    <v-alert dense type="success">
                                        {{ t("password.passwordChanged") }}
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
                                    :label="t('userName')"
                                    @input="passwordError = false"
                                    :rules="[rules.required]"
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

                                <div class="v-card-actions">
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
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import resetPassword from "@js/localizations/resources/components/resetPassword";
    import { useI18n } from "vue-i18n";
    import { useRouter, useRoute } from "vue-router";
    import useRules from "@js/composables/useRules"
    import { VForm } from "vuetify/components";

    const $route = useRoute();
    const $router = useRouter();
    
    const { t } = useI18n({
        messages: resetPassword
    });
    
    const formRef = ref<VForm | null>(null);

    const showForm: boolean = true;
    const userName = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const code: string | undefined = $route.query.code?.toString();
    const passwordChanged = ref(false);
    const passwordError = ref(false);
    
    let authApiClient: AuthApiClient = new AuthApiClient();
    const rules = useRules({ fieldToMatch: password});
    const passwordRules = await rules.getPasswordValidationRules(authApiClient);

    function cancel(): void {
        window.location.href = "/";
    }

    async function change() {
        if (!code) {
            passwordError.value = true;
            return;
        }
        const { valid } = await formRef.value!.validate();

        if (valid) {
            try {
                await authApiClient.resetPassword(userName.value, password.value, code);
                passwordChanged.value = true;
    
                await $router.push({ name: "forgotPasswordConfirm" });
            } catch {
                passwordError.value = true;
            }
        }
    };
</script>
