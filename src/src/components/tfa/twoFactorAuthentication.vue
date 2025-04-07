<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <h1>{{ t("title") }}</h1>
                </v-card-title>
                <v-card-text>
                    <v-row v-if="tfaSettings.is2faEnabled">
                        <v-col text cols="12" class="text-center">
                            <h2 v-if="message != ''">{{ message }}</h2>

                            <div v-if="tfaSettings.recoveryCodesLeft == 0">
                                <strong>{{ t("recoveryCodes.noneLeft") }}</strong>
                                <p>
                                    {{ t("message.youMust") }}
                                    <a @click="showGenerateRecoveryCodesCard">
                                        {{ t("message.generateNewRecoveryCodes") }}
                                    </a>
                                    {{ t("message.beforeYouLogin") }}
                                </p>
                            </div>
                            <div v-else-if="tfaSettings.recoveryCodesLeft == 1">
                                <strong>{{ t("recoveryCodes.oneLeft") }}</strong>
                                <p>
                                    {{ t("message.youCan") }}
                                    <a @click="showGenerateRecoveryCodesCard">
                                        {{ t("message.generateNewRecoveryCodes") }}
                                    </a>
                                </p>
                            </div>
                            <div v-else-if="tfaSettings.recoveryCodesLeft <= 3">
                                <strong>{{ t("recoveryCodes.threeOrLess") }}</strong>
                                <p>
                                    {{ t("message.youShould") }}
                                    <a @click="showGenerateRecoveryCodesCard">
                                        {{ t("message.generateNewRecoveryCodes") }}
                                    </a>
                                </p>
                            </div>
                            <div v-if="tfaSettings.isMachineRemembered">
                                <a @click="forgetBrowser">{{ t("link.forgetBrowser") }}</a>
                            </div>

                            <div v-if="tfaSettings.is2faEnabled">
                                <a @click="clickShowDisableTFA">{{ t("link.disableTfa") }}</a>
                            </div>

                            <div>
                                <a @click="showGenerateRecoveryCodesCard">{{ t("link.resetRecoveryCodes") }}</a>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col text cols="12">
                            <p v-if="showEnableAuthenticator">
                                To set up two-factor authentication first you must configure the app.
                            </p>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="secondary" @click="dashboard">{{ t("button.cancel") }}</v-btn>

                    <div>
                        <div v-if="!tfaSettings.is2faEnabled">
                            <v-btn color="primary" @click="showEnableAuthenticatorCard">
                                {{ t("link.enableAuthenticator") }}
                            </v-btn>
                        </div>
                    </div>

                    <div v-if="tfaSettings.hasAuthenticator && tfaSettings.is2faEnabled">
                        <v-btn color="primary" @click="showResetAuthenticatorCard">
                            {{ t("link.resetAuthenticator") }}
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <DisableTfa
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            @showEnableAuthenticatorCard="showEnableAuthenticatorCard"
            :showDisableTFA="showDisableTFA"
            v-if="showDisableTFA"
        ></DisableTfa>

        <GenerateRecoveryCodes
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            @showRecoveryCodesCard="showRecoveryCodesCard"
            @showGenerateRecoveryCodesCard="showGenerateRecoveryCodesCard"
            @showEnableAuthenticatorCard="showEnableAuthenticatorCard"
            :showGenerateRecoveryCodes="showGenerateRecoveryCodes"
            v-if="showGenerateRecoveryCodes"
        ></GenerateRecoveryCodes>

        <Suspense>
            <EnableAuthenticator
                @showTwoFactorAuthentication="showTwoFactorAuthentication"
                :showEnableAuthenticator="showEnableAuthenticator"
                v-if="showEnableAuthenticator"
            ></EnableAuthenticator>
        </Suspense>

        <Suspense>
            <ShowRecoveryCodes
                @showTwoFactorAuthentication="showTwoFactorAuthentication"
                @showGenerateRecoveryCodesCard="showGenerateRecoveryCodesCard"
                :showRecoveryCodes="showRecoveryCodes"
                v-if="showRecoveryCodes"
            ></ShowRecoveryCodes>
        </Suspense>

        <ResetAuthenticator
            @showEnableAuthenticatorCard="showEnableAuthenticatorCard"
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            :showResetAuthenticator="showResetAuthenticator"
            v-if="showResetAuthenticator"
        ></ResetAuthenticator>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/twoFactorAuthentication";
    import loginTfaSettings from "@js/dataModels/tfa/loginTfaSettings";
    import DisableTfa from "./disableTfa.vue";
    import ResetAuthenticator from "./resetAuthenticator.vue";
    import GenerateRecoveryCodes from "./generateRecoveryCodes.vue";
    import EnableAuthenticator from "./enableAuthenticator.vue";
    import ShowRecoveryCodes from "./showRecoveryCodes.vue";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";

    const $router = useRouter();
    const { t } = useI18n({
        messages: dictionary,
    });
    let showForm = ref(false);
    let message: string = "";
    let tfaSettings: loginTfaSettings = new loginTfaSettings();
    let tfaApiClient: TFAApiClient = new TFAApiClient();
    let showDisableTFA = ref(false);
    let showResetAuthenticator = ref(false);
    let showEnableAuthenticator = ref(false);
    let showGenerateRecoveryCodes = ref(false);
    let showRecoveryCodes = ref(false);
    defineEmits(["showTwoFactorAuthentication", "showEnableAuthenticatorCard", "showRecoveryCodesCard"]);

    function showTwoFactorAuthentication() {
        showForm.value = true;
        showDisableTFA.value = false;
        showEnableAuthenticator.value = false;
        showResetAuthenticator.value = false;
        showGenerateRecoveryCodes.value = false;
        showRecoveryCodes.value = false;
    }

    function showRecoveryCodesCard(): void {
        showRecoveryCodes.value = true;
        showGenerateRecoveryCodes.value = false;
        showForm.value = false;
    }

    function showGenerateRecoveryCodesCard(): void {
        showRecoveryCodes.value = false;
        showGenerateRecoveryCodes.value = true;
        showForm.value = false;
    }

    function showEnableAuthenticatorCard(): void {
        showEnableAuthenticator.value = true;
        showForm.value = false;
    }

    function showResetAuthenticatorCard(): void {
        showResetAuthenticator.value = true;
        showForm.value = false;
    }

    function clickShowDisableTFA(): void {
        showDisableTFA.value = true;
        showForm.value = false;
    }

    onMounted(async () => {
        const data = await tfaApiClient.getTfaSettings();
        0;
        tfaSettings = data;
        showForm.value = true;
    });

    async function forgetBrowser() {
        const data = await tfaApiClient.forgetBrowser();

        message = data;
        $router.go(-1);
    }

    function dashboard() {
        $router.push({ name: "Dashboard" });
    }
</script>
