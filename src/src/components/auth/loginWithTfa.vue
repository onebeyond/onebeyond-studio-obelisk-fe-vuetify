<template>
    <v-dialog v-model="dialog" persistent max-width="360px">
        <v-card>
            <v-form @submit.prevent="signIn" ref="formRef">
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <img
                                src="/assets/images/one-beyond-logo-black.svg"
                                height="60"
                                class="mx-auto d-block logo"
                            />
                            <h3 class="text-center">{{ t("title") }}</h3>
                            <hr />
                            <p class="text-center mb-4">{{ t("field.twoFactorInfo") }}</p>

                            <div>
                                <label>{{ t("field.twoFactorCode") }}</label>
                                <v-text-field
                                    type="text"
                                    dense
                                    outlined
                                    v-model="code"
                                    :rules="[rules.required, rules.numeric, rules.length(code, 6)]"
                                ></v-text-field>
                            </div>

                            <div class="text-center">
                                <div class="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        class="custom-control-input"
                                        id="rememberMe"
                                        name="rememberMe"
                                        value="true"
                                        v-model="rememberThisMachine"
                                    />
                                    <label class="custom-control-label" for="rememberMe">{{
                                        t("field.rememberThisMachine")
                                    }}</label>
                                </div>
                            </div>

                            <div class="v-card-actions">
                                <v-btn id="submit2-btn" color="primary" type="submit" :disabled="signingIn || !isFormValid">{{
                                    t("button.signIn")
                                }}</v-btn>
                            </div>

                            <p class="text-center mb-4">
                                {{ t("field.recoveryInfo") }}
                                <router-link to="loginWithRecoveryCode">{{ t("field.recoveryCode") }}</router-link>
                            </p>

                            <div v-if="errorMsg">
                                <v-alert border="top" color="red lighten-2" dark>
                                    {{ errorMsg }}
                                </v-alert>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import dictionary from "@js/localizations/resources/components/loginWithTfa";
    import { SignInStatus } from "@js/dataModels/auth/signInStatus";
    import type { SignInResult } from "@js/dataModels/auth/signInResult";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { SignInTfa } from "@js/dataModels/auth/signInTfa";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import { useI18n } from "vue-i18n";
    import { useRoute } from "vue-router";
    import useRules from "@js/composables/useRules"
    import { VForm } from "vuetify/components";

    const $route = useRoute();
    const rules = useRules();

    const { t } = useI18n({
        messages: dictionary
    });

    const formRef = ref<VForm | null>(null);

    const signingIn = ref(false);
    const dialog = true;
    const code = ref("");
    const rememberThisMachine = ref(false);
    const errorMsg= ref("");
    let rememberMe: any;

    const authApiClient: AuthApiClient = new AuthApiClient();

    const rememberMeFromUrl = $route.query.rememberMe;

    async function signIn(): Promise<void> {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            signingIn.value = true;
            rememberMe = rememberMeFromUrl;
    
            errorMsg.value = "";
            
            const userCredentials = new SignInTfa(code.value, rememberThisMachine.value, rememberMe);
    
            try {
                const data: SignInResult = await authApiClient.basicSignInTfa(userCredentials);
    
                if (data.status === SignInStatus.Success) {
                    LocalSessionStorage.setUserAuthenticated(true);
                    window.location.href = `${(window as any).location.origin}/admin/`;
                } else {
                    errorMsg.value = t("password.defaultError");
                }
            } catch {
                errorMsg.value = t("password.defaultError");
            } finally {
                signingIn.value = false;
            }
        }
    };
</script>