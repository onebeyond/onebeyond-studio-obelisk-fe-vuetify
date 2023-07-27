<template>
    <v-dialog v-model="dialog" persistent max-width="360px">
        <v-card>
            <v-form ref="formRef">
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
                            <p class="text-center mb-4">{{ t("message.recoveryInfo") }}</p>

                            <div>
                                <label>{{ t("field.recoveryCode") }}</label>
                                <v-text-field
                                    dense
                                    outlined
                                    v-model="code"
                                    :rules="[rules.required, rules.length(11), rules.alphaDash]"
                                >
                                </v-text-field>
                            </div>

                            <div class="v-card-actions">
                                <v-btn
                                    id="submit-btn"
                                    color="primary"
                                    type="submit"
                                    :disabled="signingIn"
                                    @click="signIn"
                                    >{{ t("button.signIn") }}</v-btn
                                >
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
    import dictionary from "@js/localizations/resources/components/signInWithRecoveryCode";
    import { SignInStatus } from "@js/dataModels/auth/signInStatus";
    import type { SignInWithRecoveryCodeResult } from "@js/dataModels/auth/signInResultWithRecoveryCode";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { SignInWithRecoveryCode } from "@js/dataModels/auth/signInWithRecoveryCode";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import { useI18n } from "vue-i18n";
    import useRules from "@js/composables/useRules";
    import { VForm } from "vuetify/components";
    import useGlobalNotification from "@js/composables/useGlobalNotification";

    const { t } = useI18n({
        messages: dictionary,
    });

    const rules = useRules();

    const formRef = ref<VForm | null>(null);

    const dialog = true;
    const signingIn = ref(false);
    const code = ref("");
    const { onError } = useGlobalNotification();

    const authApiClient: AuthApiClient = new AuthApiClient();

    async function signIn(): Promise<void> {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            signingIn.value = true;
            const userCredentials = new SignInWithRecoveryCode(code.value);

            try {
                const data: SignInWithRecoveryCodeResult = await authApiClient.basicSignInWithRecoveryCode(
                    userCredentials,
                );

                if (data.status === SignInStatus.Success) {
                    LocalSessionStorage.setUserAuthenticated(true);
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
