<template>
    <div>
        <v-dialog persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ $t("title") }}</h1>

                                <p>{{ $t("instructions") }}.</p>

                                <div class="v-card__actions">
                                    <v-btn id="submit-btn" color="primary" @click="cancel">
                                        {{ $t("password.backToLogin") }}
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

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import textFieldGridSearch from "@components/util/vuetify/textFieldGridSearch.vue";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import forgotPasswordConfirm from "@js/localizations/resources/components/forgotPasswordConfirm";

    @Component({
        name: "forgotPasswordConfirmed",
        components: {
            textFieldGridSearch
        },
        i18n: {
            messages: forgotPasswordConfirm
        }
    })
    export default class ForgotPasswordConfirmed extends Vue {
        constructor() {
            super();
        }

        created(): void {}

        cancel(): void {
            this.$router.push({ name: "SignIn" });
        }
    }
</script>
