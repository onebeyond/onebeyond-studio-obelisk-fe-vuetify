<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form ref="formRef">
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}</h1>
                                <v-card-text>
                                    <p>{{ t("instructions") }}</p>

                                    <v-text-field
                                        v-model="oldPassword"
                                        type="password"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        :disabled="passwordChanged"
                                        name="oldPassword"
                                        :rules="[rules.required]"
                                        :data-vv-as="t('oldPassword')"
                                        :label="t('oldPassword')"
                                    >
                                    </v-text-field>

                                    <v-text-field
                                        class="pt-3"
                                        v-model="newPassword"
                                        type="password"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        name="newPassword"
                                        :disabled="passwordChanged"
                                        :rules="passwordRules"
                                        :data-vv-as="t('newPassword')"
                                        :label="t('newPassword')"
                                    >
                                    </v-text-field>

                                    <v-text-field
                                        class="pt-3"
                                        v-model="confirmPassword"
                                        type="password"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        name="confirmPassword"
                                        :disabled="passwordChanged"
                                        :rules="[rules.required, rules.passwordMatch]"
                                        :data-vv-as="t('confirmPassword')"
                                        :label="t('confirmPassword')"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <div class="v-card-actions">
                                    <v-btn v-if="passwordChanged" color="primary" @click="cancel">
                                        {{ t("button.close") }}
                                    </v-btn>
                                    <v-btn v-if="!passwordChanged" @click="cancel">
                                        {{ t("button.cancel") }}
                                    </v-btn>
                                    <v-btn v-if="!passwordChanged" color="primary" @click="change">
                                        {{ t("button.change") }}
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
    import { ref } from "vue";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import changePasswordDictionary from "@js/localizations/resources/components/admin/changePassword";
    import { ChangePasswordRequest } from "@js/dataModels/auth/changePasswordRequest";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import useRules from "@js/composables/useRules";
    import { VForm } from "vuetify/components";
    import useGlobalNotification from "@js/composables/useGlobalNotification";

    const { t } = useI18n({
        messages: changePasswordDictionary,
    });

    const formRef = ref<VForm | null>(null);

    const router = useRouter();
    const { onError, onSuccess } = useGlobalNotification();
    const showForm = ref(true);

    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const passwordChanged = ref(false);

    const authApiClient: AuthApiClient = new AuthApiClient();
    const rules = useRules({ fieldToMatch: newPassword });
    const passwordRules = await rules.getPasswordValidationRules(authApiClient);

    function cancel(): void {
        showForm.value = false;
        router.go(-1);
    }

    async function change(): Promise<void> {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            var response = await authApiClient.changePassword(
                new ChangePasswordRequest(oldPassword.value, newPassword.value),
            );

            var changePasswordResult = await response.json();
            if (!changePasswordResult.success) {
                onError(t("password.unknownError"));
            } else {
                passwordChanged.value = true;
                onSuccess(t("password.passwordChanged"));
            }
        }
    }
</script>
