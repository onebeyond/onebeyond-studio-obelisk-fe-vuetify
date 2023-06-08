<template>
    <div>
        <v-row style="margin-top: 40px">
            <v-col cols="6">
                <v-card
                    height="150"
                    class="mx-auto"
                    style="display: flex; align-items: center; justify-content: center"
                    max-width="600"
                >
                    <a class="card-block stretched-link text-decoration-none" :href="adminUrl">
                        <h1 class="card-body text-center">
                            <v-icon color="primary" large>mdi-account-cog</v-icon>
                            {{ t("admin") }}
                        </h1>
                    </a>
                </v-card>
            </v-col>

            <v-col cols="6">
                <v-card
                    height="150"
                    class="mx-auto"
                    style="display: flex; align-items: center; justify-content: center"
                    max-width="600"
                >
                    <a
                        class="card-block stretched-link text-decoration-none"
                        href="https://github.com/onebeyond/onebeyond-studio-obelisk"
                        target="_blank"
                    >
                        <h1 class="card-body text-center">
                            <v-icon color="primary" large>mdi-github</v-icon>
                            Obelisk API - GitHub
                        </h1>
                    </a>
                </v-card>
            </v-col>
        </v-row>

        <v-row style="margin-top: 100px">
            <v-col cols="12">
                <v-card
                    class="mx-auto"
                    max-width="700"
                    style="display: flex; align-items: center; justify-content: center"
                    height="80"
                >
                    <div class="card-block">
                        <h5 class="card-title text-center">
                            Do you want to jump to the Admin portal without showing this page?
                        </h5>
                        <div class="card-text text-center">
                            Just go to @js/routes/indexRoutes.ts and enable the commented code under the 'Home'
                            route.<br />
                            Then you can comment out or remove the 'component' property as it won't be neeeded.
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import { type ComputedRef, computed } from "vue";
    import dictionary from "@js/localizations/resources/components/home";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({
        messages: dictionary
    });

    const adminUrl: ComputedRef<string> = computed(() =>
        LocalSessionStorage.isUserAuthenticated() ? "/admin/" : "/auth/"
    );
</script>
