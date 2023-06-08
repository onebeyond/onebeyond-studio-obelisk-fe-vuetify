<template>
    <v-app>
        <v-main>
            <global-error-handler>
                <main id="page-account">
                    <router-view :key="$route.fullPath"></router-view>
                </main>
            </global-error-handler>
        </v-main>

        <v-footer padless>
            <v-card width="100%" class="text-center" flat tile>
                <v-card-text class="pt-3">
                    Obelisk Template Developed by
                    <a href="https://www.one-beyond.com" target="_blank">One Beyond</a> Build: {{ $buildNumber }} ({{
                        $buildDate
                    }})
                </v-card-text>
            </v-card>

            <v-card width="100%" class="text-center" flat tile>
                <p>
                    <a href="/authentication#/PrivacyPolicy"> Privacy Policy </a>
                    -
                    <a href="/authentication#/TermsAndConditions">Terms & Conditions</a>
                    -
                    <a href="/authentication#/CookiePolicy" class="">Cookie Policy</a>
                    -
                    <a href="/authentication#/OpenSource">Open Source List</a>
                </p>
            </v-card>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
    import { useRouter } from "vue-router";
    import { inject } from "vue";

    const $buildNumber = inject("$buildNumber");
    const $buildDate = inject("$buildDate");
    const $route = useRouter;
</script>
