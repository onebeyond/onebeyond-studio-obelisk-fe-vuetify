<template>
    <div>
        <v-dialog v-model="showDisableTFA" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-card-title>
                        <h1>{{ t("title") }}</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-alert dense outlined type="warning">
                            <p>
                                {{ t("message") }}
                                <a @click="showEnableAuthenticatorCard">{{ t("messageLink") }}</a>
                            </p>
                        </v-alert>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="secondary" @click="showTwoFactorAuthentication"> {{ t("button.cancel") }}</v-btn>
                        <v-btn color="error" class="white--text" @click="disableTFA">
                            {{ t("button.disableTfa") }}
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/disabletfa";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import { toRef } from "vue";

    const router = useRouter();
    const { t } = useI18n({
        messages: dictionary,
    });

    const tfaApiClient = new TFAApiClient();
    const props = defineProps(["showDisableTFA"]);
    const showDisableTFA = toRef(props, "showDisableTFA");
    const emit = defineEmits(["showTwoFactorAuthentication", "showEnableAuthenticatorCard"]);

    function showEnableAuthenticatorCard(): void {
        emit("showEnableAuthenticatorCard");
    }

    function showTwoFactorAuthentication(): void {
        emit("showTwoFactorAuthentication");
    }

    async function disableTFA(): Promise<void> {
        await tfaApiClient.disableTfa();
        router.push({ name: "Dashboard" });
    }
</script>
