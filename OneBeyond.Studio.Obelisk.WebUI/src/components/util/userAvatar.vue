<template>
    <v-avatar :style="avatarBackgroundColor" class="user-avatar white--text" size="40">{{ initials }}</v-avatar>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";

    @Component
    export default class UserAvatar extends Vue {
        @Prop() fullName!: string;
        @Prop() initials!: string;

        get hslColor(): string {
            const hRange = [0, 360];
            const sRange = [55, 75];
            const lRange = [25, 50];

            const hash = this.calculateStringHash(this.fullName);
            const h = this.normalizeHash(hash, hRange[0], hRange[1]);
            const s = this.normalizeHash(hash, sRange[0], sRange[1]);
            const l = this.normalizeHash(hash, lRange[0], lRange[1]);

            return `hsl(${h}, ${s}%, ${l}%)`;
        }

        get avatarBackgroundColor(): string {
            return `background: ${this.hslColor} !important;`;
        }

        private normalizeHash(hash: number, min: number, max: number): number {
            return Math.floor((hash % (max - min)) + min);
        }

        private calculateStringHash(str: string): number {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            hash = Math.abs(hash);
            return hash;
        }
    }
</script>
