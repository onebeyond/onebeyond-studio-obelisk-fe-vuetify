<template>
    <div>
        <v-dialog v-model="showRecoveryCodes" persistent max-width="480px">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col text cols="12">
                            <div class="text-center">
                                <h1>{{ $t("title") }}</h1>

                                <v-alert dense outlined type="warning">
                                    <p>
                                        <strong>{{ $t("codeInfo") }}</strong>
                                    </p>
                                    <p>
                                        {{ $t("loseCodeInfo") }}
                                    </p>
                                </v-alert>

                                <v-container class="pb-10">
                                    <v-row>
                                        <v-col cols="12">
                                            <v-row
                                                justify="center"
                                                v-for="i in Math.ceil(recoveryCodes.length / 2)"
                                                :key="i"
                                            >
                                                <code
                                                    class="text-center ma-1"
                                                    v-for="item in recoveryCodes.slice((i - 1) * 2, i * 2)"
                                                    >{{ item }} <br
                                                /></code>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </div>
                            <div class="v-card__actions">
                                <v-btn @click="showTwoFactorAuthentication"> {{ $t("button.cancel") }}</v-btn>
                                <v-btn color="primary" @click="returnToDashboard">{{ $t("button.generate") }}</v-btn>
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
    import dictionary from "@js/localizations/resources/components/tfa/showRecoveryCodes";

    @Component({
        name: "showRecoveryCodes",
        i18n: {
            messages: dictionary
        }
    })
    export default class ShowRecoveryCodes extends Vue {
        showForm: boolean = true;
        tfaApiClient: TFAApiClient = new TFAApiClient();
        recoveryCodes: string[] = [];

        @Prop() showRecoveryCodes!: boolean;

        constructor() {
            super();
        }
        async mounted() {
            await this.getRecoveryCodes();
        }

        async getRecoveryCodes(): Promise<void> {
            const response = await this.tfaApiClient.generateRecoveryCodes();

            if (response.length == 0) {
                this.returnToDashboard();
            }
            this.recoveryCodes = response;
        }

        @Emit("showTwoFactorAuthentication")
        showTwoFactorAuthentication(): void {}

        returnToDashboard(): void {
            this.$router.push({ name: "Dashboard" });
        }
    }
</script>
