<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}</h1>

                                <p>{{ t("instructions") }}.</p>

                                <div class="v-card-actions">
                                    <v-btn id="submit-btn" color="primary" @click="cancel">
                                        {{ t("password.backToLogin") }}
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import forgotPasswordConfirm from "@js/localizations/resources/components/forgotPasswordConfirm";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";

    const $router = useRouter();
    const showForm = true;

    const { t } = useI18n({
        messages: forgotPasswordConfirm
    });

    async function cancel() {
        await $router.push({ name: "SignIn" });
    }
</script>
