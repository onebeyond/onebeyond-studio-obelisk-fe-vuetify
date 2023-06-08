<template>
    <div>
        <v-dialog v-model="showDisableTFA" persistent max-width="480px">
            <v-card>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-col text cols="12">
                                <h1>{{ $t("title") }}</h1>

                                <v-alert dense outlined type="warning">
                                    <p>
                                        {{ $t("message") }}
                                        <a @click="showEnableAuthenticatorCard">{{ $t("messageLink") }}</a>
                                    </p>
                                </v-alert>

                                <div class="v-card__actions">
                                    <v-btn @click="showTwoFactorAuthentication"> {{ $t("button.cancel") }}</v-btn>
                                    <v-btn color="error" class="white--text" @click="disableTFA">
                                        {{ $t("button.disableTfa") }}
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
    import { Component, Vue, Prop, Emit } from "vue-property-decorator";
    import TFAApiClient from "@js/api/tfa/tfaApiClient";
    import dictionary from "@js/localizations/resources/components/tfa/disabletfa";

    @Component({
        name: "disableTfa",
        i18n: {
            messages: dictionary
        }
    })
    export default class DisableTFA extends Vue {
        errorMsg: string = "";
        message: string = "";
        tfaApiClient: TFAApiClient = new TFAApiClient();
        @Prop() showDisableTFA!: boolean;

        constructor() {
            super();
        }

        @Emit("showEnableAuthenticatorCard")
        showEnableAuthenticatorCard(): void {}

        @Emit("showTwoFactorAuthentication")
        showTwoFactorAuthentication(): void {}

        async disableTFA(): Promise<void> {
            await this.tfaApiClient.disableTfa();
            this.$router.push({ name: "Dashboard" });
        }
    }
</script>
