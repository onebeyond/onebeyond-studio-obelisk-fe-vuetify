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
            <!-- Global Toast component for notifications/alerts -->
            <Toast ref="globalToastRef" />
        </v-main>
        <v-footer padless>
            <v-card flat tile>
                <v-card-text>
                    <p>
                        {{ t("application.applicationName") }} - {{ t("application.developedBy") }}
                        <a href="https://www.one-beyond.com" target="_blank">One Beyond -</a>
                    </p>
                    <p>{{ t("application.build") }}: {{ $buildNumber }} ({{ $buildDate }})</p>
                </v-card-text>
            </v-card>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import indexAppTranslation from "@js/localizations/resources/components/admin/indexApp";
    import { inject, provide, ref, type Ref } from "vue";
    import { ShowAlertKey } from "@js/util/symbols";
    import Toast from "@components/obComponents/obToast.vue";
    import useGetToastShowMethod from "@js/composables/useGetToastShowMethod";

    const { t } = useI18n({
        messages: indexAppTranslation,
    });

    const globalToastRef: Ref<InstanceType<typeof Toast> | undefined> = ref();

    const { showMethod } = useGetToastShowMethod(globalToastRef);
    provide(ShowAlertKey, showMethod);

    const $buildNumber = inject("$buildNumber");
    const $buildDate = inject("$buildDate");
</script>
