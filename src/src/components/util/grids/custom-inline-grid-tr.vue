<template>
    <tr>
        <slot></slot>
    </tr>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    @Component({
        name: "custom-inline-grid-tr",
    })
    export default class CustomInlineGridTr extends Vue {
        constructor() {
            super();
        }
    }
</script>
