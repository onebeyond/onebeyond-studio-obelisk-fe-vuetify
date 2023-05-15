<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-container>
                    <h1>{{ $t("title") }}</h1>
                    <v-row v-if="tfaSettings.is2faEnabled">
                        <v-col text cols="12" class="text-center">
                            <h2 v-if="message != ''">{{ message }}</h2>

                            <div v-if="tfaSettings.recoveryCodesLeft == 0">
                                <strong>{{ $t("recoveryCodes.noneLeft") }}</strong>
                                <p>
                                    {{ $t("message.youMust") }}
                                    <a @click="showGenerateRecoveryCodesCard">
                                        {{ $t("message.generateNewRecoveryCodes") }}
                                    </a>
                                    {{ $t("message.beforeYouLogin") }}
                                </p>
                            </div>
                            <div v-else-if="tfaSettings.recoveryCodesLeft == 1">
                                <strong>{{ $t("recoveryCodes.oneLeft") }}</strong>
                                <p>
                                    {{ $t("message.youCan") }}
                                    <a @click="showGenerateRecoveryCodesCard">
                                        {{ $t("message.generateNewRecoveryCodes") }}
                                    </a>
                                </p>
                            </div>
                            <div v-else-if="tfaSettings.recoveryCodesLeft <= 3">
                                <strong>{{ $t("recoveryCodes.threeOrLess") }}</strong>
                                <p>
                                    {{ $t("message.youShould") }}
                                    <a @click="showGenerateRecoveryCodesCard">
                                        {{ $t("message.generateNewRecoveryCodes") }}
                                    </a>
                                </p>
                            </div>
                            <div v-if="tfaSettings.isMachineRemembered">
                                <a @click="forgetBrowser">{{ $t("link.forgetBrowser") }}</a>
                            </div>

                            <div v-if="tfaSettings.is2faEnabled">
                                <a @click="clickShowDisableTFA">{{ $t("link.disableTfa") }}</a>
                            </div>

                            <div>
                                <a @click="showGenerateRecoveryCodesCard">{{ $t("link.resetRecoveryCodes") }}</a>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col text cols="12">
                            <p v-if="showEnableAuthenticator">
                                To set up two-factor authentication first you must configure the app.
                            </p>
                            <div class="v-card__actions">
                                <v-btn @click="dashboard">{{ $t("button.cancel") }}</v-btn>

                                <div>
                                    <div v-if="!tfaSettings.is2faEnabled">
                                        <v-btn color="primary" @click="showEnableAuthenticatorCard">
                                            {{ $t("link.enableAuthenticator") }}
                                        </v-btn>
                                    </div>
                                </div>

                                <div v-if="tfaSettings.hasAuthenticator && tfaSettings.is2faEnabled">
                                    <v-btn color="primary" @click="showResetAuthenticatorCard">
                                        {{ $t("link.resetAuthenticator") }}
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>

        <disableTfa
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            @showEnableAuthenticatorCard="showEnableAuthenticatorCard"
            :showDisableTFA="showDisableTFA"
            v-if="showDisableTFA"
        ></disableTfa>

        <generateRecoveryCodes
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            @showRecoveryCodesCard="showRecoveryCodesCard"
            @showGenerateRecoveryCodesCard="showGenerateRecoveryCodesCard"
            @howEnableAuthenticatorCard="showEnableAuthenticatorCard"
            :showGenerateRecoveryCodes="showGenerateRecoveryCodes"
            v-if="showGenerateRecoveryCodes"
        ></generateRecoveryCodes>

        <recoveryCodes
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            @showGenerateRecoveryCodesCard="showGenerateRecoveryCodesCard"
            :showRecoveryCodes="showRecoveryCodes"
            v-if="showRecoveryCodes"
        ></recoveryCodes>

        <enableAuthenticator
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            :showEnableAuthenticator="showEnableAuthenticator"
            v-if="showEnableAuthenticator"
        ></enableAuthenticator>

        <resetAuthenticator
            @showEnableAuthenticatorCard="showEnableAuthenticatorCard"
            @showTwoFactorAuthentication="showTwoFactorAuthentication"
            :showResetAuthenticator="showResetAuthenticator"
            v-if="showResetAuthenticator"
        ></resetAuthenticator>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/twoFactorAuthentication";
    import LoginTfaSettings from "@js/dataModels/tfa/loginTfaSettings";
    import DisableTFA from "./disableTfa.vue";
    import ResetAuthenticator from "./resetAuthenticator.vue";
    import resetAuthenticator from "@js/localizations/resources/components/tfa/resetAuthenticator";
    import GenerateRecoveryCodes from "./generateRecoveryCodes.vue";
    import EnableAuthenticator from "./enableAuthenticator.vue";
    import ShowRecoveryCodes from "./showRecoveryCodes.vue";

    @Component({
        name: "twoFactorAuthentication",
        components: {
            disableTfa: DisableTFA,
            resetAuthenticator: ResetAuthenticator,
            generateRecoveryCodes: GenerateRecoveryCodes,
            enableAuthenticator: EnableAuthenticator,
            recoveryCodes: ShowRecoveryCodes
        },
        i18n: {
            messages: dictionary
        }
    })
    export default class TwoFactorAuthentication extends Vue {
        showForm: boolean = true;
        errorMsg: string = "";
        message: string = "";
        statusMessageError: boolean = false;
        tfaSettings: LoginTfaSettings = new LoginTfaSettings();
        tfaApiClient: TFAApiClient = new TFAApiClient();
        showDisableTFA: boolean = false;
        showResetAuthenticator: boolean = false;
        showEnableAuthenticator: boolean = false;
        showGenerateRecoveryCodes: boolean = false;
        showRecoveryCodes: boolean = false;

        constructor() {
            super();
        }

        showTwoFactorAuthentication(): void {
            this.showForm = true;
            this.showDisableTFA = false;
            this.showEnableAuthenticator = false;
            this.showResetAuthenticator = false;
            this.showGenerateRecoveryCodes = false;
            this.showRecoveryCodes = false;
        }

        showRecoveryCodesCard(): void {
            this.showRecoveryCodes = true;
            this.showGenerateRecoveryCodes = false;
            this.showForm = false;
        }

        showGenerateRecoveryCodesCard(): void {
            this.showRecoveryCodes = false;
            this.showGenerateRecoveryCodes = true;
            this.showForm = false;
        }

        showEnableAuthenticatorCard(): void {
            this.showEnableAuthenticator = true;
            this.showForm = false;
        }

        showResetAuthenticatorCard(): void {
            this.showResetAuthenticator = true;
            this.showForm = false;
        }

        clickShowDisableTFA(): void {
            this.showDisableTFA = true;
            this.showForm = false;
        }

        async mounted(): Promise<void> {
            const data = await this.tfaApiClient.getTfaSettings();

            this.tfaSettings = data;
        }

        async forgetBrowser(): Promise<void> {
            const data = await this.tfaApiClient.forgetBrowser();

            this.message = data;
        }

        dashboard(): void {
            this.$router.push({ name: "Dashboard" });
        }
    }
</script>
