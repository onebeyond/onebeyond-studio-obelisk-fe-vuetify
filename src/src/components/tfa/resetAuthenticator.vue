<template>
    <div>
        <v-dialog v-model="showResetAuthenticator" persistent max-width="480px">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <div>
                                <div class="text-center">
                                    <h1>{{ $t("title") }}</h1>

                                    <v-alert dense outlined type="warning">
                                        <strong>{{ $t("resetKey") }}</strong>
                                    </v-alert>
                                    <p>
                                        {{ $t("disableTfaInfo") }}
                                    </p>
                                    <div>
                                        <v-form method="post" class="form-group" @submit.prevent="resetTfa">
                                            <div class="v-card__actions">
                                                <v-btn @click="showTwoFactorAuthentication">
                                                    {{ $t("button.cancel") }}</v-btn
                                                >
                                                <v-btn color="error" class="white--text" type="submit">{{
                                                    $t("button.resetBtn")
                                                }}</v-btn>
                                            </div>
                                        </v-form>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import { Component, Emit, Prop, Vue } from "vue-property-decorator";
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/resetAuthenticator";

    @Component({
        name: "resetAuthenticator",
        i18n: {
            messages: dictionary
        }
    })
    export default class ResetAuthenticator extends Vue {
        errorMsg: string = "";
        tfaApiClient: TFAApiClient = new TFAApiClient();
        @Prop() showResetAuthenticator!: boolean;

        constructor() {
            super();
        }

        @Emit("showTwoFactorAuthentication")
        showTwoFactorAuthentication(): void {}

        @Emit("showEnableAuthenticatorCard")
        showEnableAuthenticatorCard(): void {}

        async resetTfa(): Promise<void> {
            await this.tfaApiClient.reset();
            this.$router.push({ name: "Dashboard" });
        }
    }
</script>
