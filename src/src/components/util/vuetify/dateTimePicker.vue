<template>
    <div>
        <v-menu
            v-model="showPicker"
            :close-on-click="false"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="dateFormatted"
                    outlined
                    dense
                    :name="fieldName"
                    :label="fieldLabel + ' - DD/MM/YYYY'"
                    prepend-icon="mdi-calendar"
                    @click:clear="clearClick"
                    :clearable="clearable"
                    hide-details="auto"
                    v-bind="attrs"
                    v-validate="rules"
                    :data-vv-name="fieldName"
                    :data-vv-as="fieldLabel"
                    :error-messages="errors.collect(scope ? scope + '.' + fieldName : fieldName)"
                    v-on="on"
                >
                </v-text-field>
            </template>
            <v-card>
                <v-date-picker id="customDatePicker" v-model="date" no-title @change="pickerChanged"></v-date-picker>
                <v-card-text>
                    <v-text-field
                        v-model="time"
                        v-validate="{ required: true, regex: timeRegex }"
                        :name="fieldName + 'time'"
                        :data-vv-name="fieldName + 'time'"
                        :error-messages="errors.collect(fieldName + 'time')"
                        data-vv-as="time"
                        @change="timeChanged"
                        dense
                        label="Time (24h) - HH:MM"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions class="pt-0">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="saveChanges"> OK </v-btn>
                    <v-btn text @click="cancel"> Cancel </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from "vue-property-decorator";
    import { format } from "date-fns";

    @Component({
        name: "vuerifyDatePicker",
        components: {}
    })
    export default class ZDatePicker extends Vue {
        @Prop({ required: true }) validator!: any;
        @Prop({ required: true }) clearable!: boolean;
        @Prop({ required: true }) fieldLabel!: string;
        @Prop({ required: true }) fieldName!: string;
        @Prop({ required: false }) rules!: string;
        @Prop({ required: false, default: null }) scope!: string;

        showPicker: boolean = false;
        date: string = "";
        dateFormatted: string = "";
        time: string = "";

        oldDate: string = "";
        oldTime: string = "";

        timeRegex: string = "^([01][0-9]|2[0-3]):([0-5][0-9])$";

        @Watch("showPicker")
        public onIsReadOnlyChanged(val, oldVal) {
            if (val && this.date == "") {
                this.date = this.formatDate(new Date(), "yyyy-MM-dd");
                this.time = "00:00";
                this.dateFormatted = this.formatDate(new Date(), "dd/MM/yyyy") + " " + this.time;

                this.oldDate = "";
                this.oldTime = "";
            }
        }

        constructor() {
            super();
        }

        created(): void {
            //this.$validator = this.validator;
        }

        public setInitialDate(date: string): void {
            if (date) {
                this.date = this.formatDate(date, "yyyy-MM-dd");
                this.time = this.formatDate(date, "HH:mm");
                this.dateFormatted = this.formatDate(date, "dd/MM/yyyy") + " " + this.time;

                this.oldDate = this.date;
                this.oldTime = this.time;
            } else {
                this.time = "";
                this.date = "";
                this.dateFormatted = "";
            }
        }

        clearClick(): void {
            this.time = "";
            this.date = "";
            this.dateFormatted = "";

            this.$emit("change", null);
        }

        pickerChanged(): void {
            this.dateFormatted = this.formatDate(this.date, "dd/MM/yyyy") + " " + this.time;
        }

        formatDate(date, formatString): string {
            return date ? format(new Date(date), formatString) : "";
        }

        timeChanged(): void {
            this.dateFormatted = this.formatDate(this.date, "dd/MM/yyyy") + " " + this.time;
        }

        async saveChanges(): Promise<void> {
            const validationPassed = await this.$validator.validateAll();

            if (validationPassed) {
                this.$emit("change", this.date ? this.date + "T" + this.time : null);
                this.showPicker = false;
            }
        }

        cancel(): void {
            this.date = this.oldDate;
            this.time = this.oldTime;
            this.dateFormatted = this.formatDate(this.date, "dd/MM/yyyy") + " " + this.time;

            this.$emit("change", this.date);

            this.showPicker = false;
        }
    }
</script>

<style>
    #customDatePicker {
        margin-bottom: -30px;
    }
</style>
