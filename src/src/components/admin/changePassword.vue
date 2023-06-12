<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form v-model="formValid">
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}</h1>
                                <v-card-text>
                                    <p>{{ t("instructions") }}</p>

                                    <div v-if="passwordError">
                                        <v-alert type="error">
                                            {{ t("password.unknownError") }}
                                        </v-alert>
                                    </div>

                                    <div v-if="passwordChanged">
                                        <v-alert dense type="success">
                                            {{ t("password.passwordChanged") }}
                                        </v-alert>
                                    </div>

                                    <v-text-field
                                        v-model="oldPassword"
                                        type="password"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        :disabled="passwordChanged"
                                        name="oldPassword"
                                        :rules="[rules.password]"
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
                                        :rules="[rules.password, rules.min, rules.max]"
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
                                        :rules="[rules.password, rules.passwordMatch]"
                                        :data-vv-as="t('confirmPassword')"
                                        :label="t('confirmPassword')"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <div class="v-card__actions">
                                    <v-btn v-if="passwordChanged" color="primary" @click="cancel">
                                        {{ t("button.close") }}
                                    </v-btn>
                                    <v-btn v-if="!passwordChanged" @click="cancel">
                                        {{ t("button.cancel") }}
                                    </v-btn>
                                    <v-btn v-if="!passwordChanged" :disabled="!formValid" color="primary" @click="change">
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
    import changePasswordDictionary from "@js/localizations/resources/components/changePassword";
    import { ChangePasswordRequest } from "@js/dataModels/auth/changePasswordRequest";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";

    const { t } = useI18n({
        messages: changePasswordDictionary,
    });

    const router = useRouter();

    const showForm: boolean = true;

    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const passwordChanged = ref(false);
    const passwordError = ref(false);
    const formValid = ref(false);

    const rules = {
        password: (value) => !!value || t("message.passwordRequired"),
        passwordMatch: (value) => value === newPassword.value || t('message.passwordMatch'),
        min: (value) => value.length >= 10 || t("message.passwordMin"),
        max: (value) => value.length <= 100 || t("message.passwordMax"),
    };

    const authApiClient: AuthApiClient = new AuthApiClient();

    function cancel(): void {
        router.go(-1);
    }

    async function change(): Promise<void> {
        if (formValid) {
            var response = await authApiClient.changePassword(
                new ChangePasswordRequest(oldPassword.value, newPassword.value)
            );

            var changePasswordResult = await response.json();
            if (!changePasswordResult.success) {
                passwordError.value = true;
            } else {
                passwordChanged.value = true;
            }
        }
    }
</script>
