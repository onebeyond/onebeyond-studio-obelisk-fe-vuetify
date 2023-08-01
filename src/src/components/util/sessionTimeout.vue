<template>
    <div>
        <v-dialog v-model="showLogoutDialog" persistent max-width="480px">
            <v-card>
                <v-card-title color="primary">{{ t("message.timeoutTitle") }}</v-card-title>
                <v-form>
                    <v-card-text>{{ t("message.timeoutMessage") }}</v-card-text>
                </v-form>
            </v-card>
            <v-card-actions class="text-right">
                <v-spacer></v-spacer>
                <v-btn type="button" id="cancelLogoutBtn" @click="cancelLogout">
                    {{ t("button.keepWorking") }}
                </v-btn>
                <v-btn id="logoutBtn" color="error" @click="doLogout">
                    {{ t("button.signOut") }} ({{ secondsLeft }})
                </v-btn>
            </v-card-actions>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import differenceInSeconds from "date-fns/differenceInSeconds";
    import LocalSessionStorage from "@js/stores/localSessionStorage";
    import AccountApiClient from "@js/api/accounts/accountApiClient";
    import Configuration from "@js/configuration/configuration";
    import sessionTimeoutDictionary from "@js/localizations/resources/components/sessionTimeout";
    import { useI18n } from "vue-i18n";
    import { onMounted } from "vue";
    import { useUserContextStore } from "@js/stores/appStore";

    const { t } = useI18n({
        messages: sessionTimeoutDictionary,
    });

    let sessionDurationInMinutes = 60;
    const secondsBeforeDisplayingDialog = 10;
    let jsIntervalReference: ReturnType<typeof setInterval> | null = null;
    let showLogoutDialog = false;
    let secondsLeft = 0;
    const accountApiClient = new AccountApiClient();
    const { clearUserContext } = useUserContextStore();

    onMounted(() => {
        // We can retrieve the setting from the configuration as we can be sure it has been already loaded
        sessionDurationInMinutes = Configuration.appSettings.sessionTimeoutInMinutes;

        jsIntervalReference = setInterval(function () {
            let expiryDate: Date = new Date(
                LocalSessionStorage.getLastServerRequestDate() + sessionDurationInMinutes * 60 * 1000,
            );
            secondsLeft = Math.round(differenceInSeconds(expiryDate, new Date()));
            showLogoutDialog = secondsLeft < secondsBeforeDisplayingDialog;
            if (secondsLeft < 0) {
                doLogout();
            }
        }, 2000);
    });

    function cancelLogout(): void {
        //Calling ping action will in turn reset the clock and hence cancelling the dialog
        accountApiClient.ping();
    }

    async function doLogout(): Promise<void> {
        if (jsIntervalReference) {
            clearInterval(jsIntervalReference); //Stopping timer since reload will happen anyway
        }
        showLogoutDialog = false;

        clearUserContext();
        await accountApiClient.signOut();

        window.location.href = `${window.location.origin}/auth/`;
    }
</script>
