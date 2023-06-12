<template>
    <v-avatar :style="avatarBackgroundColor" class="user-avatar white--text" size="40">{{ initials }}</v-avatar>
</template>

<script setup lang="ts">
    import { computed } from "vue";

    const props = defineProps({
        fullName: {
            type: String,
            required: true,
        },
        initials: {
            type: String,
            required: true,
        },
    });

    const hslColor = computed(() => {
        const hRange = [0, 360];
        const sRange = [55, 75];
        const lRange = [25, 50];

        const hash = calculateStringHash(props.fullName);
        const h = normalizeHash(hash, hRange[0], hRange[1]);
        const s = normalizeHash(hash, sRange[0], sRange[1]);
        const l = normalizeHash(hash, lRange[0], lRange[1]);

        return `hsl(${h}, ${s}%, ${l}%)`;
    });

    const avatarBackgroundColor = computed(() => `background: ${hslColor.value} !important;`);

    function normalizeHash(hash: number, min: number, max: number): number {
        return Math.floor((hash % (max - min)) + min);
    }

    function calculateStringHash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        return hash;
    }
</script>
