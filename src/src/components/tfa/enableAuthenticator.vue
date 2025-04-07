<template>
    <div>
        <v-dialog v-model="showEnableAuthenticator" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <h1>{{ t("title") }}</h1>
                </v-card-title>
                <v-form id="send-code" @submit.prevent="enableTfa">
                    <v-card-text>
                        <ol class="list">
                            <li>
                                {{ t("downloadMessage") }}:
                                <a href="https://go.microsoft.com/fwlink?Linkid=825072">{{ t("android") }}</a>
                                {{ t("and") }}
                                <a href="https://go.microsoft.com/fwlink?Linkid=825073">{{ t("ios") }}</a>
                                {{ t("or") }}
                                {{ t("downloadLinkGoogleAuthenticator") }}
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en"
                                    >{{ t("android") }}</a
                                >
                                {{ t("and") }}
                                <a href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">{{
                                    t("ios")
                                }}</a
                                >.
                            </li>
                            <li>
                                {{ t("scanQrCode") }}
                                <kbd>{{ tfaSettings?.sharedKey }}</kbd>
                                {{ t("scanQrCodeInfo") }}
                                <QRCode
                                    :value="tfaSettings?.authenticationUri"
                                    :size="200"
                                    v-if="tfaSettings?.authenticationUri"
                                />
                            </li>
                            <li>
                                {{ t("scanQrCodeInfoTwo") }}
                                <div class="row">
                                    <div class="col-12 mt-3">
                                        <div class="form-group">
                                            <label class="control-label">{{ t("verificationCode") }}</label>
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
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="secondary" @click="showTwoFactorAuthentication"> {{ t("button.cancel") }}</v-btn>
                        <v-btn color="primary" type="submit">{{ t("verify") }}</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/enableAuthenticator";
    import type enableAuthenticatorSettings from "@js/dataModels/tfa/enableAuthenticatorSettings";
    import EnableTfaRequest from "@js/dataModels/tfa/enableTfaRequest";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import { onMounted, ref, type Ref, toRef } from "vue";
    import useGlobalNotification from "@js/composables/useGlobalNotification";
    import QRCode from "qrcode.vue";

    const router = useRouter();

    const { t } = useI18n({
        messages: dictionary,
    });

    const tfaSettings: Ref<enableAuthenticatorSettings | undefined> = ref();
    const tfaApiClient = new TFAApiClient();

    let code = ref("");
    const props = defineProps(["showEnableAuthenticator"]);
    const showEnableAuthenticator = toRef(props, "showEnableAuthenticator");
    const rules = {
        code: (value) => !!value || t("message.authenticatorRequired"),
    };

    const emit = defineEmits(["showTwoFactorAuthentication"]);
    const { onError } = useGlobalNotification();

    onMounted(async () => {
        tfaSettings.value = await tfaApiClient.getTfaAuthenticationKey();
    });

    async function enableTfa() {
        try {
            var inputModel = new EnableTfaRequest(code.value);
            const response = await tfaApiClient.enableTfa(inputModel);
            if (response.length == 0) {
                router.push({ name: "Dashboard" });
            }
        } catch {
            onError(t("password.authAddError"));
        }
    }

    function showTwoFactorAuthentication(): void {
        emit("showTwoFactorAuthentication");
    }
</script>
