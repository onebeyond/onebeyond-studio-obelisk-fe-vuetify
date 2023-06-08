<template>
    <div>
        <v-dialog v-model="showEnableAuthenticator" persistent max-width="480px">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <h1>{{ $t("title") }}</h1>
                            <v-form id="send-code" @submit.prevent="enableTfa">
                                <ol class="list">
                                    <li>
                                        {{ $t("downloadMessage") }}:
                                        <a href="https://go.microsoft.com/fwlink?Linkid=825072">{{ $t("android") }}</a>
                                        {{ $t("and") }}
                                        <a href="https://go.microsoft.com/fwlink?Linkid=825073">{{ $t("ios") }}</a>
                                        {{ $t("or") }}
                                        {{ $t("downloadLinkGoogleAuthenticator") }}
                                        <a
                                            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en"
                                            >{{ $t("android") }}</a
                                        >
                                        {{ $t("and") }}
                                        <a
                                            href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8"
                                            >{{ $t("ios") }}</a
                                        >.
                                    </li>
                                    <li>
                                        {{ $t("scanQrCode") }}
                                        <kbd>{{ tfaSettings.sharedKey }}</kbd>
                                        {{ $t("scanQrCodeInfo") }}
                                        <div id="qrCode" ref="qrCode"></div>
                                        <div id="qrCodeData" :data-url="tfaSettings.authenticationUri"></div>
                                    </li>
                                    <li>
                                        {{ $t("scanQrCodeInfoTwo") }}
                                        <div class="row">
                                            <div class="col-12 mt-3">
                                                <div class="form-group">
                                                    <label class="control-label">{{ $t("verificationCode") }}</label>
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        v-model="code"
                                                        :rules="[rules.code]"
                                                    ></v-text-field>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ol>
                                <div class="v-card__actions">
                                    <v-btn @click="showTwoFactorAuthentication"> {{ $t("button.cancel") }}</v-btn>
                                    <v-btn color="primary" type="submit">{{ $t("verify") }}</v-btn>
                                </div>
                            </v-form>
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
    import dictionary from "@js/localizations/resources/components/tfa/enableAuthenticator";
    import enableAuthenticatorSettings from "@js/dataModels/tfa/enableAuthenticatorSettings";
    import EnableTfaRequest from "@js/dataModels/tfa/enableTfaRequest";

    @Component({
        name: "enableAuthenticator",
        components: {},
        i18n: {
            messages: dictionary
        }
    })
    export default class EnableAuthenticator extends Vue {
        showForm: boolean = true;
        tfaSettings: enableAuthenticatorSettings = new enableAuthenticatorSettings();
        tfaApiClient: TFAApiClient = new TFAApiClient();
        errorMsg: string = "";
        code: string = "";
        @Prop() showEnableAuthenticator!: boolean;

        constructor() {
            super();
        }

        rules: object = {
            code: (value) => !!value || this.$t("message.authenticatorRequired")
        };

        async mounted() {
            const data = await this.tfaApiClient.getTfaAuthenticationKey();

            this.tfaSettings = data;
            new QRCode(this.$refs.qrCode, {
                text: this.tfaSettings.authenticationUri,
                width: 200,
                height: 200
            });
        }

        async enableTfa(): Promise<void> {
            const defaultError: string = "An error occured while trying to add authenticator.";

            try {
                var inputModel = new EnableTfaRequest(this.code);
                const response = await this.tfaApiClient.enableTfa(inputModel);
                if (response.length == 0) {
                    this.$router.push({ name: "Dashboard" });
                }
            } catch {
                this.errorMsg = defaultError;
            }
        }

        @Emit("showTwoFactorAuthentication")
        showTwoFactorAuthentication(): void {}
    }
</script>
