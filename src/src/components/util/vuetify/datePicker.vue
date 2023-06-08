<template>
    <div>
        <v-menu
            v-model="menu1"
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
                    v-bind="attrs"
                    hide-details="auto"
                    v-validate="rules"
                    :data-vv-name="fieldName"
                    :data-vv-as="fieldLabel"
                    :error-messages="errors.collect(scope ? scope + '.' + fieldName : fieldName)"
                    @blur="dateChanged"
                    v-on="on"
                >
                </v-text-field>
            </template>
            <v-date-picker v-model="date" no-title @change="pickerChanged" @input="menu1 = false"></v-date-picker>
        </v-menu>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from "vue-property-decorator";
    import { format } from 'date-fns';

    @Component({
        name: "vuerifyDatePicker",
        components: {
        },
    })

    export default class ZDatePicker extends Vue {
        @Prop({ required: true }) validator!: any;
        @Prop({ required: true }) clearable!: boolean;
        @Prop({ required: true }) fieldLabel!: string;
        @Prop({ required: true }) fieldName!: string;
        @Prop({ required: false }) rules!: string;
        @Prop({ required: false, default: '' }) scope!: string;

        menu1: boolean = false;
        date: any = "";
        dateFormatted: string = "";

        @Watch("date")
        public onIsReadOnlyChanged(val, oldVal) {
            this.$emit("change", val ? val : null);
        }

        constructor() {
            super();
        }

        created(): void {
            this.$validator = this.validator;
        }

        public setInitialDate(date: any): void {
            if (date) {
                this.date = this.formatDate(date, "yyyy-MM-dd");
                this.dateFormatted = this.formatDate(date, "dd/MM/yyyy");
            }
            else {
                this.dateFormatted = "");
            }
        }

        pickerChanged(): void {
            this.dateFormatted = this.formatDate(this.date, "dd/MM/yyyy");
        }

        clearClick(): void {
            this.dateFormatted = "";
            this.$emit("change", null);
        }

        dateChanged(): void {
            if (!this.menu1) {
                if (!this.dateFormatted) {
                    this.date = "";
                }
                else {
                    const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/\-]\d{4}$/;

                    if (this.dateFormatted.match(regex) !== null) {
                        const [day, month, year] = this.dateFormatted.split('/');
                        this.date = `${year}-${month}-${day}`;
                    }
                    else {
                        this.date = "";
                    }
                }
            }
        }

        formatDate(date, formatString): string {
            return date ? format(new Date(date), formatString) : "";
        };

    }
</script>
