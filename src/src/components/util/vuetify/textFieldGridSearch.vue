<template>
    <div>
        <v-text-field
            v-model="text"
            append-icon="mdi-magnify"
            :label="field ? field : 'Search'"
            clearable
            @input="textChanged"
            @click:clear="clear"
            hide-details
        ></v-text-field>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    @Component({
        name: "TextFieldGridSearch",
        components: {}
    })
    export default class TextFieldGridSearch extends Vue {
        @Prop({ required: true }) delay!: number;
        @Prop({ required: true }) minLength!: number;
        @Prop({ required: false }) field!: string;

        text: string = "";

        constructor() {
            super();
        }

        created(): void {}

        textChanged(): void {
            if (!this.text || this.text.length == 0) {
                setTimeout(() => {
                    this.$emit("search", "");
                }, this.delay);
            } else if (this.text.length >= this.minLength) {
                setTimeout(() => {
                    this.$emit("search", this.text, this.field);
                }, this.delay);
            }
        }

        clear() {
            this.text = "";
            this.textChanged();
        }
    }
</script>
