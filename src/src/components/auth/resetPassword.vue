<template>
    <ChangePassword :title="t('resetTitle')" />
</template>

<script setup lang="ts">
    import ChangePassword from "@components/auth/changePassword.vue";
    import changePassword from "@js/localizations/resources/components/changePassword";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({
        messages: changePassword,
    });
</script>
