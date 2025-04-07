<template>
    <div>
        <v-dialog v-model="showGenerateRecoveryCodes" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <h1>{{ t("title") }}</h1>
                </v-card-title>
                <v-card-text class="text-center">
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
                </v-card-text>
                <v-card-actions class="text-center mt-4">
                    <v-btn color="secondary" @click="showTwoFactorAuthentication"> {{ t("button.cancel") }}</v-btn>
                    <v-btn color="primary" type="button" @click="showRecoveryCodesCard">{{
                        t("button.generate")
                    }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import dictionary from "@js/localizations/resources/components/tfa/generateRecoveryCodes";
    import { useI18n } from "vue-i18n";
    import { toRef } from "vue";

    const { t } = useI18n({
        messages: dictionary,
    });
    const props = defineProps(["showGenerateRecoveryCodes", "showRecoveryCodes"]);
    const emit = defineEmits(["showTwoFactorAuthentication", "showEnableAuthenticatorCard", "showRecoveryCodesCard"]);
    const showGenerateRecoveryCodes = toRef(props, "showGenerateRecoveryCodes");

    function showEnableAuthenticatorCard(): void {
        emit("showEnableAuthenticatorCard");
    }

    function showRecoveryCodesCard(): void {
        emit("showRecoveryCodesCard");
    }

    function showTwoFactorAuthentication(): void {
        emit("showTwoFactorAuthentication");
    }
</script>
