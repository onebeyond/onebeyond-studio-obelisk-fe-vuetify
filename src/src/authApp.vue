<template>
    <v-app>
        <v-main>
            <global-error-handler>
                <main id="page-account">
                    <Suspense>
                        <router-view :key="$route.fullPath"></router-view>
                    </Suspense>
                </main>
            </global-error-handler>
        </v-main>
        <!-- Global Toast component for notifications/alerts -->
        <Toast ref="globalToastRef" />
        <v-footer padless>
            <v-card width="100%" class="text-center" flat tile>
                <v-card-text class="pt-3">
                    {{ t("application.applicationName") }} - {{ t("application.developedBy") }}
                    <a href="https://www.one-beyond.com" target="_blank">One Beyond -</a>
                    {{ t("application.build") }}: {{ $buildNumber }} ({{ $buildDate }})
                </v-card-text>
            </v-card>

            <v-card width="100%" class="text-center" flat tile>
                <p>
                    <a href="/authentication#/PrivacyPolicy"> {{ t("privacyPolicy") }} </a>
                    -
                    <a href="/authentication#/TermsAndConditions">{{ t("termsConditions") }}</a>
                    -
                    <a href="/authentication#/CookiePolicy" class="">{{ t("cookiePolicy") }}</a>
                    -
                    <a href="/authentication#/OpenSource">{{ t("openSourceList") }}</a>
                </p>
            </v-card>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
    import { useRouter } from "vue-router";
    import { inject, provide, ref, type Ref } from "vue";
    import { ShowAlertKey } from "@js/util/symbols";
    import Toast from "@components/obComponents/toast.vue";
    import useGetToastShowMethod from "@js/composables/useGetToastShowMethod";
    import { useI18n } from "vue-i18n";
    import authAppTranslation from "@js/localizations/resources/components/admin/authApp";

    const { t } = useI18n({
        messages: authAppTranslation,
    });
    const $buildNumber = inject("$buildNumber");
    const $buildDate = inject("$buildDate");
    const $route = useRouter;

    const globalToastRef: Ref<InstanceType<typeof Toast> | undefined> = ref();
    const { showMethod } = useGetToastShowMethod(globalToastRef);
    provide(ShowAlertKey, showMethod);
</script>
