<template>
    <div v-if="entityGrid.hasGlobalSearchEnabled">
        <v-text-field
            v-model="searchText"
            prepend-inner-icon="mdi-magnify"
            :label="'Search'"
            clearable
            @keydown.enter="search"
            @click:clear="search"
            @click:prepend-inner="search"
            hide-details
        />
    </div>
    <VDataTableServer
        ref="entityGridRef"
        :key="key"
        v-model:items-per-page="entityGrid.query.limit"
        v-model:page="entityGrid.query.page"
        v-model:sort-by="entityGrid.query.orderBy"
        :headers="entityGrid.columns"
        :items-length="entityGrid.count"
        :items="entityGrid.data"
        :loading="entityGrid.isLoading"
        :search="entityGrid.search"
        item-value="id"
        @update:options="async () => await entityGrid.refresh()"
    >
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr
                v-if="
                    (!entityGrid.hasColumnComplexFilter && !entityGrid.hasColumnSimpleFilter) ||
                    entityGrid.hasColumnSimpleFilter
                "
            >
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)" />
                        </template>
                    </td>
                </template>
            </tr>
            <tr v-if="entityGrid.hasColumnSimpleFilter">
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <div v-if="column.allowFiltering">
                            <template v-if="column.filterType == filterType.SimpleText">
                                <SimpleText :column="column" @addFilter="addFilter" />
                            </template>
                            <template v-if="column.filterType == filterType.SimpleNumber">
                                <SimpleNumber :column="column" @addFilter="addFilter" />
                            </template>
                            <template
                                v-if="
                                    column.filterType == filterType.SimpleDate ||
                                    column.filterType == filterType.SimpleDateOnly
                                "
                            >
                                <SimpleDate :column="column" @addDateFilter="addDateFilter" />
                            </template>
                            <template v-if="column.filterType == filterType.SimpleDateTime">
                                <SimpleDateTime :column="column" @addDateFilter="addDateFilter" />
                            </template>

                            <template v-if="column.filterType == filterType.SimpleDropdown">
                                <SimpleDropDown :column="column" @addFilter="addFilter" />
                            </template>
                            <template
                                v-if="
                                    column.filterType == filterType.SimpleMultiSelectCheckbox ||
                                    column.filterType == filterType.SimpleBoolean
                                "
                            >
                                <SimpleMultiSelect :column="column" @addFilter="addFilter" />
                            </template>
                        </div>
                    </td>
                </template>
            </tr>
            <tr v-if="entityGrid.hasColumnComplexFilter">
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)"></v-icon>
                        </template>

                        <template v-if="column.filterType == filterType.ComplexText">
                            <ComplexText
                                :column="column"
                                @addComplexFilter="addComplexFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == filterType.ComplexNumber">
                            <ComplexNumber
                                :column="column"
                                @addComplexFilter="addComplexFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template
                            v-if="
                                column.filterType == filterType.ComplexDropdown ||
                                column.filterType == filterType.ComplexBoolean
                            "
                        >
                            <complexDropDown
                                :column="column"
                                @addFilter="addFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == filterType.ComplexMultiSelectCheckbox">
                            <complexMultiSelect
                                :column="column"
                                @addFilter="addFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template
                            v-if="
                                column.filterType == filterType.ComplexDate ||
                                column.filterType == filterType.ComplexDateOnly
                            "
                        >
                            <complexDate
                                :column="column"
                                @addDateFilter="addDateFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template
                            v-if="
                                column.filterType == filterType.ComplexDateTime
                            "
                        >
                            <complexDateTime
                                :column="column"
                                @addDateFilter="addDateFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                    </td>
                </template>
            </tr>
            <!-- <tr v-if="entityGrid.hasColumnComplexFilter">
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)"></v-icon>
                        </template>
                        <v-menu
                            offset-y
                            :close-on-content-click="false"
                            v-if="column.allowFiltering"
                            :key="getMenuKey(column.key)"
                        >
                            <template v-slot:activator="{ props }">
                                <v-btn
                                    icon
                                    v-bind="props"
                                    v-if="
                                        column.filterType != FilterType.ComplexNumberRange &&
                                        column.filterType != FilterType.ComplexDateRange &&
                                        column.filterType != FilterType.ComplexDateTimeRange
                                    "
                                >
                                    <v-icon small :color="multiSearch[column.key] ? 'primary' : ''">
                                        mdi-filter-variant
                                    </v-icon>
                                </v-btn>
                                <v-btn
                                    icon
                                    v-bind="props"
                                    v-if="
                                        column.filterType == FilterType.ComplexNumberRange ||
                                        column.filterType == FilterType.ComplexDateRange ||
                                        column.filterType == FilterType.ComplexDateTimeRange
                                    "
                                >
                                    <v-icon
                                        small
                                        :color="
                                            multiRangePrimary[column.key] || multiRangeSecondary[column.key]
                                                ? 'primary'
                                                : ''
                                        "
                                    >
                                        mdi-filter-variant
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                               
                                   
                                    <template v-if="column.filterType == filterType.ComplexDateRange">
                                        <div :key="getColumnKey(column.key)">
                                            <v-row no-gutters>
                                                <v-col cols="6">
                                                    <v-btn
                                                        text
                                                        block
                                                        @click="
                                                            addDateRangeFilter(
                                                                column.filterType,
                                                                column.key,
                                                                multiRangePrimary[column.key],
                                                                multiRangeSecondary[column.key],
                                                                column.isDateTimeOffset,
                                                            )"
                                                        color="success">
                                                        Filter
                                                        </v-btn>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-btn
                                                        text
                                                        block
                                                        @click="clearRangeFilter(column.key, column.filterType)"
                                                        color="warning">
                                                        Clear
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                            <date-picker
                                                label="Greater than or equal to"
                                                :clearable="true"
                                                :name="column.title"
                                                v-model="multiRangePrimary[column.key]"
                                            />
                                            <date-picker
                                                label="less than or equal to"
                                                :clearable="true"
                                                :name="column.title"
                                                v-model="multiRangeSecondary[column.key]"
                                            />
                                        </div>
                                    </template>
                                    <template v-if="column.filterType == filterType.ComplexDateTimeRange">
                                        <div :key="getColumnKey(column.key)">
                                            <v-row no-gutters>
                                                <v-col cols="6">
                                                    <v-btn
                                                        text
                                                        block
                                                        @click="
                                                            addDateRangeFilter(
                                                                column.filterType,
                                                                column.key,
                                                                multiRangePrimary[column.key],
                                                                multiRangeSecondary[column.key],
                                                                column.isDateTimeOffset,
                                                            )"
                                                        color="success">
                                                        Filter
                                                    </v-btn>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-btn
                                                        text
                                                        block
                                                        @click="clearRangeFilter(column.key, column.filterType)"
                                                        color="warning">
                                                        Clear
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                            <date-time-picker
                                                label="Greater than or equal to"
                                                :clearable="true"
                                                :name="column.title"
                                                v-model="multiRangePrimary[column.key]"
                                            />
                                            <date-time-picker
                                                label="less than or equal to"
                                                :clearable="true"
                                                :name="column.title"
                                                v-model="multiRangeSecondary[column.key]"
                                            />
                                        </div>
                                    </template>
                                  
                                    
                                    <template v-if="column.filterType == filterType.ComplexNumberRange">
                                        <v-row no-gutters>
                                            <v-col cols="6">
                                                <v-btn
                                                    text
                                                    block
                                                    @click="
                                                        addRangeFilter(
                                                            column.filterType,
                                                            column.key,
                                                            multiRangePrimary[column.key],
                                                            multiRangeSecondary[column.key],
                                                        )"
                                                    color="success">
                                                    Filter
                                                    </v-btn>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-btn
                                                    text
                                                    block
                                                    @click="clearRangeFilter(column.key, column.filterType)"
                                                    color="warning">
                                                Clear
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-text-field
                                            v-model="multiRangePrimary[column.key]"
                                            type="number"
                                            placeholder="Greater than or equal to"
                                            :autofocus="true"
                                        />
                                        <v-text-field
                                            v-model="multiRangeSecondary[column.key]"
                                            type="number"
                                            placeholder="less than or equal to"
                                            :autofocus="true"
                                        />
                                    </template>
                                </div>
                            </v-card>
                        </v-menu>
                    </td>
                </template>
            </tr>-->
        </template>
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>

        <template #item.actions="{ item }">
            <v-row justify="end">
                <v-btn
                    v-for="command in entityGrid.commands"
                    :key="command.buttonLabel"
                    :prepend-icon="command.buttonIcon"
                    variant="text"
                    @click="command.action(item.raw.id)"
                >
                    {{ command.buttonLabel }}
                </v-btn>
            </v-row>
        </template>
    </VDataTableServer>
</template>

<script setup lang="ts">
    import { ref, onMounted, toRef, type Ref, nextTick } from "vue";
    import { VuetifyEntityGrid } from "@js/grids/vuetify/vuetifyEntityGrid";
    import { VDataTableServer, VDatePicker } from "vuetify/lib/labs/components";
    import { FilterType, StringOperators, NumberOperators, Filter } from "@js/grids/vuetify/types";
    import { DateTime } from "@js/util/dateTime";
    import SimpleText from "@components/obComponents/columnFilters/simpleText.vue";
    import SimpleNumber from "@components/obComponents/columnFilters/simpleNumber.vue";
    import SimpleDate from "@components/obComponents/columnFilters/simpleDate.vue";
    import SimpleDateTime from "@components/obComponents/columnFilters/simpleDateTime.vue";
    import SimpleDropDown from "@components/obComponents/columnFilters/simpleDropDown.vue";
    import SimpleMultiSelect from "@components/obComponents/columnFilters/simpleMultiSelect.vue";
    import ComplexText from "@components/obComponents/columnFilters/complexText.vue";
    import ComplexNumber from "@components/obComponents/columnFilters/complexNumber.vue";
    import complexDropDown from "@components/obComponents/columnFilters/complexDropDown.vue";
    import complexMultiSelect from "@components/obComponents/columnFilters/complexMultiSelect.vue";
    import complexDate from "@components/obComponents/columnFilters/complexDate.vue";
    import complexDateTime from "@components/obComponents/columnFilters/complexDateTime.vue";

    const entityGridRef: Ref<VDataTableServer> = ref();
    defineExpose({ entityGridRef });
    const filterType = FilterType;
    const searchText = ref("");
    const key = ref(0);
    const multiSearch = ref({});
    const multiRangePrimary = ref({});
    const multiRangeSecondary = ref({});
    const multiOp = ref({});
    let updateNumber = 0;
    let menuNumber = 0;

    const booleanArray = [
        { id: 1, name: "Yes" },
        { id: 0, name: "No" },
    ];

    const stringOperators = Object.values(StringOperators);
    const numberOperators = Object.values(NumberOperators);

    const props = defineProps({
        entityGrid: { type: VuetifyEntityGrid, required: true },
    });
    const entityGrid = toRef(props, "entityGrid");

    onMounted(() => {
        props.entityGrid.setRefreshMethod(refresh);
    });

    // Refreshes grid by updating key value to force update
    function refresh(): void {
        key.value++;
    }

    async function search(): Promise<void> {
        entityGrid.value.search = searchText.value;
    }

    async function addFilter(type: FilterType, key: string, value: string | number | null) {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        if (value != null) {
            var filter = new Filter(type, key, value);
            props.entityGrid.extraFilters.push(filter);
        }
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function addDateFilter(
        type: FilterType,
        key: string,
        value: Date | null,
        isDateTimeOffset: boolean = false,
    ): Promise<void> {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        if (value != null) {
            var filter = new Filter(type, key, value, null, isDateTimeOffset);
            props.entityGrid.extraFilters.push(filter);
        }
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function addComplexFilter(
        type: FilterType,
        key: string,
        value: any,
        operator: StringOperators | NumberOperators | null,
    ): Promise<void> {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        if (value != null) {
            var filter = new Filter(type, key, value, null, false, operator);
            props.entityGrid.extraFilters.push(filter);
        }
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function clearComplexFilter(key: string) {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        props.entityGrid.refresh();
    }
    /* function checkSomeItems(key: string): boolean {
        return multiSearch.value[key] == undefined ? false : multiSearch.value[key].length > 0;
    }

    function checkAllItems(key: string, items: any): boolean {
        return multiSearch.value[key] == undefined ? false : multiSearch.value[key].length == items.length;
    }

    /* async function addRangeFilter(
        type: FilterType,
        key: string,
        primaryValue: any,
        secondaryValue: any,
    ): Promise<void> {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        props.entityGrid.extraFilters.push({ type, key, primaryValue, secondaryValue });
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function addDateRangeFilter(
        type: FilterType,
        key: string,
        primaryValue: any,
        secondaryValue: any,
        isDateTimeOffset: boolean = false,
    ): Promise<void> {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        if (primaryValue != null || secondaryValue != null) {
            props.entityGrid.extraFilters.push({ type, key, primaryValue, secondaryValue, isDateTimeOffset });
        }
        props.entityGrid.refresh();
        menuNumber++;
    }

    

    async function clearRangeFilter(key: string, filterType: FilterType): Promise<void> {
        if (filterType == FilterType.ComplexNumberRange) {
            multiRangePrimary.value[key] = "";
            multiRangeSecondary.value[key] = "";
        }
        if (filterType == FilterType.ComplexDateRange || filterType == FilterType.ComplexDateTimeRange) {
            multiRangePrimary.value[key] = null;
            multiRangeSecondary.value[key] = null;
        }
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function clearComplexFilter(key: string, filterType: FilterType): Promise<void> {
        if (filterType == FilterType.ComplexMultiSelectCheckbox) {
            delete multiSearch.value[key];
            updateNumber++;
        } else {
            multiSearch.value[key] = "";
        }
        if (filterType == FilterType.ComplexText) {
            updateOperator(key, "Contains");
            updateNumber++;
        }
        if (filterType == FilterType.ComplexNumber) {
            multiOp.value[key] = "Equals";
            updateNumber++;
        }
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter((element) => element.key != key);
        props.entityGrid.refresh();
        menuNumber++;
    }

   

    function getStringOperatorByKey(key: string): string {
        if (multiOp.value[key] == undefined) {
            multiOp.value[key] = StringOperators.Contains;
        }
        return multiOp.value[key];
    }

    function updateOperator(key: string, value: string): void {
        multiOp.value[key] = value;
    }

    function getNumberOperatorByKey(key: string): string {
        if (multiOp.value[key] == undefined) {
            multiOp.value[key] = NumberOperators.Equals;
        }
        return multiOp.value[key];
    }

    function getColumnKey(key: string): string {
        return key + "" + updateNumber;
    }

    function getMenuKey(key: string): string {
        return key + "" + menuNumber;
    }

 */
</script>
