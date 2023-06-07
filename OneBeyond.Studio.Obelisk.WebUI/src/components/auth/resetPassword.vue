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
                                    :rules="[rules.required, rules.min(password, 10), rules.max(password, 100)]"
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
                                    :rules="[rules.required, customRules.passwordMatch]"
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
    </div>
</template>

<script setup lang="ts">
    import AuthApiClient from "@js/api/auth/authApiClient";
    import resetPassword from "@js/localizations/resources/components/resetPassword";
    import { useI18n } from "vue-i18n";
    import { useRouter, useRoute } from "vue-router";
    import useRules from "@js/composables/useRules"

    const $route = useRoute();
    const $router = useRouter();
    const rules = useRules();

    const { t } = useI18n({
        messages: resetPassword
    });

    let showForm: boolean = true;
    let userName: string = "";
    let password: string = "";
    let confirmPassword: string = "";
    let code: string | undefined = "";
    let passwordChanged: boolean = false;
    let passwordError: boolean = false;

    let authApiClient: AuthApiClient = new AuthApiClient();

    const customRules = {
        passwordMatch: (value) => value === confirmPassword || t('message.passwordMatch'),
    };

    function cancel(): void {
        window.location.href = "/";
    }

    code = $route.query.code?.toString();

    async function change(_values) {
        if (!code) {
            passwordError = true;
            return;
        }

        try {
            await authApiClient.resetPassword(userName, password, code);
            passwordChanged = true;

            await $router.push({ name: "forgotPasswordConfirm" });
        } catch {
            passwordError = true;
        }
    };
</script>
