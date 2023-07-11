<template>
    <v-app>
        <v-app-bar id="appBar" color="primary" class="white--text" dense app>
            <v-toolbar-title>{{ t("welcomeMessage") }}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-main class="page-body">
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
        <v-footer padless>
            <v-card width="100%" class="text-center" flat tile>
                <v-card-text class="pt-3">
                    {{ t("application.applicationName") }} - {{ t("application.developedBy") }}
                    <a href="https://www.one-beyond.com" target="_blank">One Beyond -</a>
                    {{ t("application.build") }}: {{ $buildNumber }} ({{ $buildDate }})
                </v-card-text>
            </v-card>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
    import { inject } from "vue";
    import { useI18n } from "vue-i18n";
    import indexAppTranslation from "@js/localizations/resources/components/admin/indexApp";

    const { t } = useI18n({
        messages: indexAppTranslation,
    });
    const $buildNumber = inject("$buildNumber");
    const $buildDate = inject("$buildDate");
</script>
