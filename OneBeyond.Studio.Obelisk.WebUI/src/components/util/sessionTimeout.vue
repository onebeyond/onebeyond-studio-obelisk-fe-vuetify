<template>
    <div>
        <v-dialog v-model="showLogoutDialog" persistent max-width="480px">
            <v-card>
                <v-card-title color="primary">{{ $t("message.timeoutTitle") }}</v-card-title>
                <v-form>
                    <v-card-text>{{ $t("message.timeoutMessage") }}</v-card-text>
                </v-form>
            </v-card>
            <v-card-actions class="text-right">
                <v-spacer></v-spacer>
                <v-btn type="button" id="cancelLogoutBtn" @click="cancelLogout">
                    {{ $t("button.keepWorking") }}
                </v-btn>
                <v-btn id="logoutBtn" color="error" @click="doLogout">
                    {{ $t("button.signOut") }} ({{ secondsLeft }})
                </v-btn>
            </v-card-actions>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import differenceInSeconds from "date-fns/differenceInSeconds";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import sessionTimeoutDictionary from "@js/localizations/resources/components/sessionTimeout";
    import AuthApiClient from "@js/api/auth/authApiClient";
    import Configuration from "@js/configuration/configuration";

    @Component({
        name: "sessionTimeout",
        components: {},
        i18n: {
            messages: sessionTimeoutDictionary
        }
    })
    export default class SessionTimeout extends Vue {
        secondsBeforeDisplayingDialog: number;
        jsIntervalReference: any;
        showLogoutDialog: boolean;
        secondsLeft: number;
        authApiClient: AuthApiClient;
        sessionDurationInMinutes: number = 60;

        constructor() {
            super();
            this.secondsBeforeDisplayingDialog = 10;
            this.jsIntervalReference = null;
            this.showLogoutDialog = false;
            this.secondsLeft = 0;
            this.authApiClient = new AuthApiClient();
        }

        created(): void {
            // We can retrieve the setting from the configuration as we can be sure it has been already loaded
            this.sessionDurationInMinutes = Configuration.appSettings.sessionTimeoutInMinutes;

            let self = this;
            this.jsIntervalReference = setInterval(function () {
                let expiryDate: Date = new Date(
                    LocalSessionStorage.getLastServerRequestDate() + self.sessionDurationInMinutes * 60 * 1000
                );
                self.secondsLeft = Math.round(differenceInSeconds(expiryDate, new Date()));
                self.showLogoutDialog = self.secondsLeft < self.secondsBeforeDisplayingDialog;
                if (self.secondsLeft < 0) {
                    self.doLogout();
                }
            }, 2000);
        }

        public cancelLogout(): void {
            //Calling ping action will in turn reset the clock and hence cancelling the dialog
            this.authApiClient.ping();
        }

        public async doLogout(): Promise<void> {
            clearInterval(this.jsIntervalReference); //Stopping timer since reload will happen anyway
            this.showLogoutDialog = false;

            await this.authApiClient.signOut();

            window.location.href = `${(window as any).location.origin}/auth/`;
        }
    }
</script>
