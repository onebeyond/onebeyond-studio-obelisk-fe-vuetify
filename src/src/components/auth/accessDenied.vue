<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-card-title>
                        <h1>{{ t("title") }}</h1>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-center">{{ t("info") }}</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn id="submit-btn" color="primary" @click="cancel">
                            {{ t("password.backToLogin") }}
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import accessDenied from "@js/localizations/resources/components/accessDenied";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({
        messages: accessDenied,
    });

    const showForm = true;

    function cancel(): void {
        window.location.href = "/";
    }
</script>
