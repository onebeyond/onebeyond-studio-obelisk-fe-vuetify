<template>
    <div>
        <v-dialog v-model="showGenerateRecoveryCodes" persistent max-width="480px">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <div>
                                <div class="text-center">
                                    <h1>{{ $t("title") }}</h1>

                                    <v-alert dense outlined type="warning">
                                        <p>
                                            <strong>{{ $t("recoveryCodesInfo") }}</strong>
                                        </p>
                                        <p>
                                            {{ $t("reminder") }}
                                        </p>
                                    </v-alert>
                                    <p>
                                        {{ $t("generateInfo") }}
                                        <a @click="showEnableAuthenticatorCard">{{ $t("resetLink") }}</a>
                                    </p>
                                    <div></div>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <div class="v-card__actions">
                                    <v-btn @click="showTwoFactorAuthentication"> {{ $t("button.cancel") }}</v-btn>

                                    <v-btn color="primary" type="button" @click="showRecoveryCodesCard">{{
                                        $t("button.generate")
                                    }}</v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop, Emit } from "vue-property-decorator";
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/generateRecoveryCodes";

    @Component({
        name: "generateRecoveryCodes",
        i18n: {
            messages: dictionary
        }
    })
    export default class GenerateRecoveryCodes extends Vue {
        tfaApiClient: TFAApiClient = new TFAApiClient();
        @Prop() showGenerateRecoveryCodes!: boolean;
        @Prop() showRecoveryCodes!: boolean;

        generateCodes(): void {
            this.showRecoveryCodesCard();
        }

        @Emit("showEnableAuthenticatorCard")
        showEnableAuthenticatorCard(): void {}

        @Emit("showRecoveryCodesCard")
        showRecoveryCodesCard(): void {}

        @Emit("showTwoFactorAuthentication")
        showTwoFactorAuthentication(): void {}
    }
</script>
