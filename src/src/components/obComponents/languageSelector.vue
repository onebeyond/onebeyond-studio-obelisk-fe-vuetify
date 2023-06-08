<template>
    <div>
        <select v-model="$i18n.locale" @change="changeLanguage($event)" class="form-control">
            <option v-for="locale in $i18n.availableLocales" :key="locale" :value="locale">
                {{ $i18n.locale }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
    import { i18nConfig } from "@js/localizations/i18nConfig";
    import LocalAppStorage from "@js/stores/localAppStorage";

    function changeLanguage(event): void {
        if (event.target.value !== LocalAppStorage.getValueForKey("currentLocale")) {
            i18nConfig.use(event.target.value);
        }
    }
</script>
