<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="360px">
            <v-card>
                <v-form ref="formRef">
                    <v-card-title>
                        <img
                            src="/assets/images/one-beyond-logo-black.svg"
                            height="60"
                            class="mx-auto d-block logo"
                            alt="company logo"
                        />
                        <h1 class="text-center mt-2 mb-4">{{ t("title") }}</h1>
                    </v-card-title>
                    <v-card-text>
                        <div>
                            <label>{{ t("field.username") }}</label>
                            <v-text-field
                                density="compact"
                                variant="outlined"
                                v-model="username"
                                :rules="[rules.required]"
                                data-cy="inputUserName"
                            ></v-text-field>
                        </div>

                        <div>
                            <label for="password">{{ t("field.password") }}</label>
                            <v-text-field
                                density="compact"
                                variant="outlined"
                                type="password"
                                v-model="password"
                                :rules="[rules.required]"
                                data-cy="inputPassword"
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
                                    v-model="rememberMe"
                                />
                                <label class="custom-control-label" for="rememberMe">{{ t("field.rememberMe") }}</label>
                            </div>
                        </div>
                    </v-card-text>
                    <v-card-actions class="border-0 flex-column">
                        <v-btn
                            id="submit-btn"
                            color="primary"
                            type="submit"
                            :disabled="signingIn"
                            @click="signIn"
                            data-cy="submitBtn"
                            >{{ t("button.signIn") }}</v-btn
                        >

                        <p class="mt-8">
                            <router-link to="forgotPassword">{{ t("button.forgottenPassword") }}</router-link>
                        </p>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import { SignInStatus } from "@js/dataModels/auth/signInStatus";
    import type { SignInResult } from "@js/dataModels/auth/signInResult";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import { SignInRequest } from "@js/dataModels/auth/signInRequest";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import signInDictionary from "@js/localizations/resources/components/signIn";
    import { useI18n } from "vue-i18n";
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import useRules from "@js/composables/useRules";
    import { VForm } from "vuetify/components";
    import useGlobalNotification from "@js/composables/useGlobalNotification";
    import useGetUserContext from "@js/composables/useGetUserContext";

    const router = useRouter();
    const { t } = useI18n({
        messages: signInDictionary,
    });
    const { onError } = useGlobalNotification();
    const { getUserContext } = useGetUserContext();
    const rules = useRules();

    const dialog = true;
    const signingIn = ref(false);
    const username = ref("");
    const password = ref("");
    const rememberMe = false;
    const authApiClient = new AuthApiClient();
    const formRef = ref<VForm | null>(null);

    async function signIn(): Promise<void> {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            signingIn.value = true;
            const userCredentials = new SignInRequest(username.value, password.value, rememberMe);

            try {
                const data: SignInResult = await authApiClient.basicSignIn(userCredentials);

                if (data.status === SignInStatus.Success) {
                    LocalSessionStorage.setUserAuthenticated(true);

                    await getUserContext();
                    window.location.href = `${window.location.origin}/admin/`;
                } else if (data.status === SignInStatus.RequiresVerification) {
                    router.push({
                        name: "signInWithTfa",
                        query: { rememberMe: rememberMe.toString() },
                    });
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
