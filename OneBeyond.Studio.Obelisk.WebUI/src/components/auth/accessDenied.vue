<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ $t("title") }}</h1>

                                <p>{{ $t("info") }}.</p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import textFieldGridSearch from "@components/util/vuetify/textFieldGridSearch.vue";
    import accessDenied from "@js/localizations/resources/components/accessDenied";

    @Component({
        name: "usersApp",
        components: {
            textFieldGridSearch
        },
        i18n: {
            messages: accessDenied
        }
    })
    export default class ChangePassword extends Vue {
        constructor() {
            super();
        }

        created(): void {}
    }
</script>
