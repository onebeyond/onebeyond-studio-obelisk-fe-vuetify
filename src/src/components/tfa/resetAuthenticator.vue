<template>
    <div>
        <v-dialog v-model="showResetAuthenticator" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <h1>{{ t("title") }}</h1>
                </v-card-title>
                <v-card-text>
                    <div class="text-center">
                        <v-alert dense outlined type="warning">
                            <strong>{{ t("resetKey") }}</strong>
                        </v-alert>
                        <p>
                            {{ t("disableTfaInfo") }}
                        </p>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-form method="post" @submit.prevent="resetTfa">
                        <v-btn color="secondary" @click="showTwoFactorAuthentication"> {{ t("button.cancel") }}</v-btn>
                        <v-btn color="error" class="white--text" type="submit">{{ t("button.resetBtn") }}</v-btn>
                    </v-form>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/resetAuthenticator";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import { toRef } from "vue";

    const router = useRouter();

    const { t } = useI18n({
        messages: dictionary,
    });
    const emit = defineEmits(["showTwoFactorAuthentication"]);
    const tfaApiClient = new TFAApiClient();
    const props = defineProps(["showResetAuthenticator"]);
    const showResetAuthenticator = toRef(props, "showResetAuthenticator");

    function showTwoFactorAuthentication(): void {
        emit("showTwoFactorAuthentication");
    }

    async function resetTfa(): Promise<void> {
        await tfaApiClient.reset();
        router.push({ name: "Dashboard" });
    }
</script>
