<template>
    <div>
        <v-text-field
            v-model="text"
            append-icon="mdi-magnify"
            label="Search"
            @input="textChanged"
            single-line
            hide-details
        ></v-text-field>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    @Component({
        name: "TextFieldSearch",
        components: {}
    })
    export default class TextFieldSearch extends Vue {
        @Prop({ required: true }) delay!: number;
        @Prop({ required: true }) minLength!: number;

        text: string = "";

        constructor() {
            super();
        }

        created(): void {}

        textChanged(): void {
            if (this.text.length >= this.minLength) {
                setTimeout(() => {
                    this.$emit("search", this.text);
                }, this.delay);
            } else if (this.text.length == 0) {
                setTimeout(() => {
                    this.$emit("search", "");
                }, this.delay);
            }
        }
    }
</script>
