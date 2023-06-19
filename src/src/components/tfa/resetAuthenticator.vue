<template>
    <div>
        <v-dialog v-model="props.showResetAuthenticator" persistent max-width="480px">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <div>
                                <div class="text-center">
                                    <h1>{{ t("title") }}</h1>

                                    <v-alert dense outlined type="warning">
                                        <strong>{{ t("resetKey") }}</strong>
                                    </v-alert>
                                    <p>
                                        {{ t("disableTfaInfo") }}
                                    </p>
                                    <div>
                                        <v-form method="post" class="form-group" @submit.prevent="resetTfa">
                                            <div class="v-card__actions">
                                                <v-btn @click="showTwoFactorAuthentication">
                                                    {{ t("button.cancel") }}</v-btn>
                                                <v-btn color="error" class="white--text" type="submit">{{
                                                    t("button.resetBtn")
                                                }}</v-btn>
                                            </div>
                                        </v-form>
                                    </div>
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
import TFAApiClient from "@js/api/tfa/tfaApiClient";
import dictionary from "@js/localizations/resources/components/tfa/resetAuthenticator";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();

const { t } = useI18n({
    messages: dictionary,
});
const emit = defineEmits(["showTwoFactorAuthentication", "showEnableAuthenticatorCard"]);
const tfaApiClient = new TFAApiClient();
const props = defineProps(["showResetAuthenticator"]);

function showTwoFactorAuthentication(): void {
    emit('showTwoFactorAuthentication');
}

function showEnableAuthenticatorCard(): void {
    emit('showEnableAuthenticatorCard');
}

async function resetTfa(): Promise<void> {
    await tfaApiClient.reset();
    router.push({ name: "Dashboard" });
}
</script>
