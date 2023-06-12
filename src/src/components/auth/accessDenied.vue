<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ t("title") }}</h1>

                                <p>{{ t("info") }}.</p>
                            </v-col>
                        </v-row>
                    </v-container>
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

    let showForm: boolean = true;
</script>
