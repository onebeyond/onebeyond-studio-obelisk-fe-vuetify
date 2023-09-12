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
                                    :rules="[rules.required, rules.numeric, rules.length(6)]"
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
                                <v-btn id="submit2-btn" color="primary" type="submit" :disabled="signingIn">{{
                                    t("button.signIn")
                                }}</v-btn>
                            </div>

                            <p class="text-center mb-4">
                                {{ t("field.recoveryInfo") }}
                                <router-link to="signInWithRecoveryCode">{{ t("field.recoveryCode") }}</router-link>
                            </p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import dictionary from "@js/localizations/resources/components/signInWithTfa";
    import { SignInStatus } from "@js/dataModels/auth/signInStatus";
    import type { SignInResult } from "@js/dataModels/auth/signInResult";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { SignInTfa } from "@js/dataModels/auth/signInTfa";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import { useI18n } from "vue-i18n";
    import { useRoute } from "vue-router";
    import useRules from "@js/composables/useRules";
    import { VForm } from "vuetify/components";
    import useGlobalNotification from "@js/composables/useGlobalNotification";
    import useGetUserContext from "@js/composables/useGetUserContext";

    const $route = useRoute();
    const rules = useRules();
    const { getUserContext } = useGetUserContext();
    const { t } = useI18n({
        messages: dictionary,
    });
    const { onError } = useGlobalNotification();
    const formRef = ref<VForm | null>(null);

    const signingIn = ref(false);
    const dialog = true;
    const code = ref("");
    const rememberThisMachine = ref(false);
    const rememberMe = $route.query.rememberMe === "true";

    const authApiClient: AuthApiClient = new AuthApiClient();

    async function signIn(): Promise<void> {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            signingIn.value = true;

            const userCredentials = new SignInTfa(code.value, rememberThisMachine.value, rememberMe);

            try {
                const data: SignInResult = await authApiClient.basicSignInTfa(userCredentials);

                if (data.status === SignInStatus.Success) {
                    LocalSessionStorage.setUserAuthenticated(true);
                    await getUserContext();
                    window.location.href = `${window.location.origin}/admin/`;
                } else {
                    onError(t("password.defaultError"));
                }
            } catch {
                onError(t("password.defaultError"));
            } finally {
                signingIn.value = false;
            }
        }
    }
</script>
