<template>
    <div v-if="visible">
        <v-dialog v-model="visible" persistent max-width="480px">
            <v-card>
                <!-- See globalErrorHandler.vue for an example of slot usage -->
                <slot name="header">
                    <v-card-title color="primary">{{ innerTitle }}</v-card-title>
                </slot>
                <v-form>
                    <!-- See globalErrorHandler.vue for an example of slot usage -->
                    <slot name="content">
                        <v-card-text>{{ innerMessage }}</v-card-text>
                    </slot>
                </v-form>
            </v-card>
            <v-card-actions class="text-right">
                <v-spacer></v-spacer>
                <!-- See globalErrorHandler.vue for an example of slot usage -->
                <slot name="footer">
                    <v-btn @click="closeClick">{{ $t("button.close") }}</v-btn>
                </slot>
            </v-card-actions>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import { Vue, Prop } from "vue-property-decorator";

    @Component({
        name: "alertModal",
        components: {}
    })
    export default class AlertModal extends Vue {
        @Prop({ type: Object }) bus!: any;
        @Prop({ type: String }) namespace!: string;
        @Prop({ type: Boolean }) visible!: boolean;
        @Prop() message!: string;
        @Prop() title!: string;
        @Prop() modalClass!: string;

        innerTitle: string;
        innerMessage: string;

        constructor() {
            super();
            this.innerTitle = "";
            this.innerMessage = "";
        }

        created(): void {
            this.innerTitle = this.title;
            this.innerMessage = this.message;

            if (this.bus && this.namespace) {
                this.bus.$on(this.namespace + "/setData", this.setData);
            }
        }

        closeClick(): void {
            const self = this;
            const selfBase = self as any;
            //notify that modal wants to be closed
            //prop.visible should be changed in the parent to actually close the modal
            if (this.bus && this.namespace) {
                this.bus.$emit(this.namespace + "/close");
            }
            selfBase.$emit("close");
        }
        setData(title: string, msg: string): void {
            this.innerTitle = title;
            this.innerMessage = msg;
        }
    }
</script>
