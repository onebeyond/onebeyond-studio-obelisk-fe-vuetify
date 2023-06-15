<template>
    <div>
        <v-dialog v-model="showGenerateRecoveryCodes" persistent max-width="480px">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <div>
                                <div class="text-center">
                                    <h1>{{ t("title") }}</h1>

                                    <v-alert dense outlined type="warning">
                                        <p>
                                            <strong>{{ t("recoveryCodesInfo") }}</strong>
                                        </p>
                                        <p>
                                            {{ t("reminder") }}
                                        </p>
                                    </v-alert>
                                    <p>
                                        {{ t("generateInfo") }}
                                        <a @click="showEnableAuthenticatorCard">{{ t("resetLink") }}</a>
                                    </p>
                                    <div></div>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <div class="v-card-actions">
                                    <v-btn @click="showTwoFactorAuthentication"> {{ t("button.cancel") }}</v-btn>

                                    <v-btn color="primary" type="button" @click="showRecoveryCodesCard">{{
                                        t("button.generate")
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

<script setup lang="ts">
import dictionary from "@js/localizations/resources/components/tfa/generateRecoveryCodes";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
    messages: dictionary,
});
const props = defineProps(["showGenerateRecoveryCodes", "showRecoveryCodes"]);
const emit = defineEmits(["showTwoFactorAuthentication", "showEnableAuthenticatorCard", "showRecoveryCodesCard"]);
let showGenerateRecoveryCodes = props.showGenerateRecoveryCodes;

function showEnableAuthenticatorCard(): void {
    emit('showEnableAuthenticatorCard');
}

function showRecoveryCodesCard(): void {
    emit('showRecoveryCodesCard')
}

function showTwoFactorAuthentication(): void {
    emit('showTwoFactorAuthentication')
}
</script>
