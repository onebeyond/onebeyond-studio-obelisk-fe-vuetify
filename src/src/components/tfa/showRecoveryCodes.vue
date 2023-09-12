<template>
    <div>
        <v-dialog v-model="showRecoveryCodes" persistent max-width="480px">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <div class="text-center">
                                <h1>{{ t("title") }}</h1>

                                <v-alert dense outlined type="warning">
                                    <p>
                                        <strong>{{ t("codeInfo") }}</strong>
                                    </p>
                                    <p>
                                        {{ t("loseCodeInfo") }}
                                    </p>
                                </v-alert>

                                <v-container class="pb-10">
                                    <v-row>
                                        <v-col cols="12">
                                            <v-row
                                                justify="center"
                                                v-for="i in Math.ceil(recoveryCodes.length / 2)"
                                                :key="i"
                                            >
                                                <code
                                                    class="text-center ma-1"
                                                    v-for="item in recoveryCodes.slice((i - 1) * 2, i * 2)"
                                                    :key="item"
                                                    >{{ item }} <br
                                                /></code>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </div>
                            <div class="v-card-actions">
                                <v-btn @click="showTwoFactorAuthentication"> {{ t("button.cancel") }}</v-btn>
                                <v-btn color="primary" @click="returnToDashboard">{{ t("button.generate") }}</v-btn>
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
    import dictionary from "@js/localizations/resources/components/tfa/showRecoveryCodes";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import { ref, toRef } from "vue";

    const router = useRouter();

    const { t } = useI18n({
        messages: dictionary,
    });

    const tfaApiClient = new TFAApiClient();
    let recoveryCodes = ref<string[]>([]);
    const emit = defineEmits(["showTwoFactorAuthentication"]);
    const props = defineProps(["showRecoveryCodes"]);
    const showRecoveryCodes = toRef(props, "showRecoveryCodes");

    await getRecoveryCodes();

    async function getRecoveryCodes(): Promise<void> {
        const response = await tfaApiClient.generateRecoveryCodes();

        if (response.length == 0) {
            returnToDashboard();
        }

        recoveryCodes.value = response;
    }

    function showTwoFactorAuthentication(): void {
        emit("showTwoFactorAuthentication");
    }

    function returnToDashboard(): void {
        router.push({ name: "Dashboard" });
    }
</script>
