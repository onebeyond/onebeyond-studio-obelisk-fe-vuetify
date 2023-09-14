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
                            <template v-if="column.filterType == FilterType.SimpleText">
                                <SimpleText :column="column" @addFilter="addFilter" />
                            </template>
                            <template v-if="column.filterType == FilterType.SimpleNumber">
                                <SimpleNumber :column="column" @addFilter="addFilter" />
                            </template>
                            <template
                                v-if="
                                    column.filterType == FilterType.SimpleDate ||
                                    column.filterType == FilterType.SimpleDateOnly
                                "
                            >
                                <SimpleDate :column="column" @addDateFilter="addDateFilter" />
                            </template>
                            <template v-if="column.filterType == FilterType.SimpleDateTime">
                                <SimpleDateTime :column="column" @addDateFilter="addDateFilter" />
                            </template>

                            <template v-if="column.filterType == FilterType.SimpleDropdown">
                                <SimpleDropDown :column="column" @addFilter="addFilter" />
                            </template>
                            <template
                                v-if="
                                    column.filterType == FilterType.SimpleMultiSelectCheckbox ||
                                    column.filterType == FilterType.SimpleBoolean
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

                        <template v-if="column.filterType == FilterType.ComplexText">
                            <ComplexText
                                :column="column"
                                @addComplexFilter="addComplexFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == FilterType.ComplexNumber">
                            <ComplexNumber
                                :column="column"
                                @addComplexFilter="addComplexFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template
                            v-if="
                                column.filterType == FilterType.ComplexDropdown ||
                                column.filterType == FilterType.ComplexBoolean
                            "
                        >
                            <complexDropDown
                                :column="column"
                                @addFilter="addFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == FilterType.ComplexMultiSelectCheckbox">
                            <complexMultiSelect
                                :column="column"
                                @addFilter="addFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template
                            v-if="
                                column.filterType == FilterType.ComplexDate ||
                                column.filterType == FilterType.ComplexDateOnly
                            "
                        >
                            <complexDate
                                :column="column"
                                @addDateFilter="addDateFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == FilterType.ComplexDateTime">
                            <complexDateTime
                                :column="column"
                                @addDateFilter="addDateFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == FilterType.ComplexNumberRange">
                            <complexNumberRange
                                :column="column"
                                @addRangeFilter="addRangeFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == FilterType.ComplexDateRange">
                            <complexDateRange
                                :column="column"
                                @addDateRangeFilter="addDateRangeFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                        <template v-if="column.filterType == FilterType.ComplexDateTimeRange">
                            <complexDateTimeRange
                                :column="column"
                                @addDateRangeFilter="addDateRangeFilter"
                                @clearComplexFilter="clearComplexFilter"
                            />
                        </template>
                    </td>
                </template>
            </tr>
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
    import { ref, onMounted, toRef, type Ref } from "vue";
    import { VuetifyEntityGrid } from "@js/grids/vuetify/vuetifyEntityGrid";
    import { VDataTableServer } from "vuetify/lib/labs/components";
    import { FilterType, StringOperators, NumberOperators, Filter } from "@js/grids/vuetify/types";
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
    import complexNumberRange from "@components/obComponents/columnFilters/complexNumberRange.vue";
    import complexDateRange from "@components/obComponents/columnFilters/complexDateRange.vue";
    import complexDateTimeRange from "@components/obComponents/columnFilters/complexDateTimeRange.vue";

    const entityGridRef: Ref<VDataTableServer> = ref();
    defineExpose({ entityGridRef });
    const searchText = ref("");
    const key = ref(0);

    const props = defineProps({
        entityGrid: { type: VuetifyEntityGrid, required: true },
    });
    const entityGrid = toRef(props, "entityGrid");

    onMounted(() => {
        entityGrid.value.setRefreshMethod(refresh);
    });

    // Refreshes grid by updating key value to force update
    function refresh(): void {
        key.value++;
    }

    async function search(): Promise<void> {
        entityGrid.value.search = searchText.value;
    }

    async function addFilter(type: FilterType, key: string, value: string | number | null) {
        entityGrid.value.extraFilters = entityGrid.value.extraFilters.filter((element) => element.key != key);
        if (value != null) {
            const filter = new Filter(type, key, value);
            entityGrid.value.extraFilters.push(filter);
        }
        entityGrid.value.refresh();
    }

    async function addDateFilter(
        type: FilterType,
        key: string,
        value: Date | null,
        isDateTimeOffset: boolean = false,
    ): Promise<void> {
        entityGrid.value.extraFilters = entityGrid.value.extraFilters.filter((element) => element.key != key);
        if (value != null) {
            const filter = new Filter(type, key, value, null, isDateTimeOffset);
            entityGrid.value.extraFilters.push(filter);
        }
        entityGrid.value.refresh();
    }

    async function addComplexFilter(
        type: FilterType,
        key: string,
        value: string | number | [] | null,
        operator: StringOperators | NumberOperators | null,
    ): Promise<void> {
        entityGrid.value.extraFilters = entityGrid.value.extraFilters.filter((element) => element.key != key);
        if (value != null) {
            const filter = new Filter(type, key, value, null, false, operator);
            entityGrid.value.extraFilters.push(filter);
        }
        entityGrid.value.refresh();
    }

    async function clearComplexFilter(key: string) {
        entityGrid.value.extraFilters = entityGrid.value.extraFilters.filter((element) => element.key != key);
        entityGrid.value.refresh();
    }

    async function addRangeFilter(
        type: FilterType,
        key: string,
        primaryValue: string | number | [] | null,
        secondaryValue: string | number | [] | null,
    ): Promise<void> {
        entityGrid.value.extraFilters = entityGrid.value.extraFilters.filter((element) => element.key != key);
        const filter = new Filter(type, key, primaryValue, secondaryValue, false);
        entityGrid.value.extraFilters.push(filter);
        entityGrid.value.refresh();
    }

    async function addDateRangeFilter(
        type: FilterType,
        key: string,
        primaryValue: Date | null,
        secondaryValue: Date | null,
        isDateTimeOffset: boolean = false,
    ): Promise<void> {
        entityGrid.value.extraFilters = entityGrid.value.extraFilters.filter((element) => element.key != key);
        if (primaryValue != null || secondaryValue != null) {
            const filter = new Filter(type, key, primaryValue, secondaryValue, isDateTimeOffset);
            entityGrid.value.extraFilters.push(filter);
        }
        entityGrid.value.refresh();
    }
</script>
