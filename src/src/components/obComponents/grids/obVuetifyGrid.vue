<template>
    <div v-if="entityGrid.hasGlobalSearchEnabled">
        <v-text-field v-model="searchText"
                      prepend-inner-icon="mdi-magnify"
                      :label="'Search'"
                      clearable
                      @keydown.enter="search"
                      @click:clear="search"
                      @click:prepend-inner="search"
                      hide-details />
    </div>
    <VDataTableServer ref="entityGridRef"
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
                      @update:options="async() => await entityGrid.refresh()">
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <div v-if="!entityGrid.hasComplexFilter">

                            <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                            <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                            </template>

                            <div v-if="column.allowFiltering">
                                <template v-if="column.filterType == filterType.SimpleText">
                                    <v-text-field :key="column.key"
                                                  v-model="multiSearch[column.key]"
                                                  type="text"
                                                  :placeholder="column.title"
                                                  :autofocus="true"
                                                  @input="addFilter(column.filterType, column.key, multiSearch[column.key])"
                                                  @click:clear="addFilter(column.filterType, column.key, multiSearch[column.key])"
                                                  @click:prepend-inner="addFilter(column.filterType, column.key, multiSearch[column.key])" />
                                </template>
                                <template v-if="column.filterType == filterType.SimpleNumber">
                                    <v-text-field :key="column.key"
                                                  v-model="multiSearch[column.key]"
                                                  type="number"
                                                  :placeholder="column.title"
                                                  :autofocus="true"
                                                  @input="addFilter(column.filterType, column.key, multiSearch[column.key])"
                                                  @click:clear="addFilter(column.filterType, column.key, multiSearch[column.key])"
                                                  @click:prepend-inner="addFilter(column.filterType, column.key, multiSearch[column.key])" />
                                </template>
                                <template v-if="column.filterType == filterType.SimpleDropdown">
                                    <v-select :key="column.key"
                                              v-model="multiSearch[column.key]"
                                              :items="column.valueAccessor"
                                              :label="column.title"
                                              persistent-hint
                                              item-value="id"
                                              item-title="name"
                                              :autofocus="true"
                                              @update:model-value="addFilter(column.filterType, column.key, multiSearch[column.key])" />
                                </template>
                                <template v-if="column.filterType == filterType.SimpleMultiSelectCheckbox || column.filterType == filterType.SimpleBoolean">
                                    <div>
                                        <v-select :key="column.key"
                                                  v-model="multiSearch[column.key]"
                                                  :items="column.filterType == filterType.SimpleBoolean ? booleanArray : column.valueAccessor"
                                                  :label="column.title"
                                                  multiple
                                                  persistent-hint
                                                  item-value="id"
                                                  item-title="name"
                                                  :autofocus="true"
                                                  @update:model-value="addFilter(column.filterType, column.key, multiSearch[column.key])">
                                            <template v-slot:prepend-item>
                                                <v-list-item title="Select All"
                                                             @click="toggleList(column.filterType, column.key, column.filterType == filterType.SimpleBoolean ? booleanArray : column.valueAccessor, multiSearch[column.key])">
                                                    <template v-slot:prepend>
                                                        <v-checkbox-btn :color="checkSomeItems(column.key) ? 'indigo-darken-4' : undefined"
                                                                        :indeterminate="checkSomeItems(column.key) && !checkAllItems(column.key, column.filterType == filterType.SimpleBoolean ? booleanArray : column.valueAccessor)"
                                                                        :model-value="checkAllItems(column.key, column.filterType == filterType.SimpleBoolean ? booleanArray : column.valueAccessor)" />
                                                    </template>
                                                </v-list-item>
                                            </template>
                                        </v-select>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div v-if="entityGrid.hasComplexFilter">
                            <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                            <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                            </template>
                            <v-menu offset-y :close-on-content-click="false" v-if="column.allowFiltering" :key="getMenuKey(column.key)">
                                <template v-slot:activator="{ props }">

                                    <v-btn icon v-bind="props" v-if="column.filterType != FilterType.ComplexNumberRange">
                                        <v-icon small :color="multiSearch[column.key] ? 'primary' : ''">
                                            mdi-filter-variant
                                        </v-icon>
                                    </v-btn>
                                    <v-btn icon v-bind="props" v-if="column.filterType == FilterType.ComplexNumberRange">
                                        <v-icon small :color="multiRangePrimary[column.key]  || multiRangeSecondary[column.key]? 'primary' : ''">
                                            mdi-filter-variant
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <v-card>
                                    <div style="background-color: white; width: 280px">
                                        <template v-if="column.filterType == filterType.ComplexText">
                                            <v-row no-gutters>
                                                <v-col cols="6">
                                                    <v-btn text block @click="addComplexFilter(column.filterType, column.key, multiSearch[column.key], getStringOperatorByKey(column.key))" color="success">Filter</v-btn>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-btn text block @click="clearComplexFilter(column.key, column.filterType)" color="warning">Clear</v-btn>
                                                </v-col>
                                            </v-row>
                                            <div :key="getColumnKey(column.key)">
                                                <v-select :key="column.key"
                                                          :value="getStringOperatorByKey(column.key)"
                                                          :items="stringOperators"
                                                          :autofocus="true"
                                                          @update:model-value="(e) => updateOperator(column.key, e)" />
                                                <v-text-field :key="column.key"
                                                              v-model="multiSearch[column.key]"
                                                              type="text"
                                                              :placeholder="column.title"
                                                              :autofocus="true" />
                                            </div>
                                        </template>
                                        <template v-if="column.filterType == filterType.ComplexNumber">
                                            <div :key="getColumnKey(column.key)">
                                                <v-row no-gutters>
                                                    <v-col cols="6">
                                                        <v-btn text block @click="addComplexFilter(column.filterType, column.key, multiSearch[column.key], getNumberOperatorByKey(column.key))" color="success">Filter</v-btn>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-btn text block @click="clearComplexFilter(column.key, column.filterType)" color="warning">Clear</v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-select :key="column.key"
                                                          :value="getNumberOperatorByKey(column.key)"
                                                          :items="numberOperators"
                                                          :autofocus="true"
                                                          @update:model-value="(e) => updateOperator(column.key, e)" />
                                                <v-text-field :key="column.key"
                                                              v-model="multiSearch[column.key]"
                                                              type="text"
                                                              :placeholder="column.title"
                                                              :autofocus="true" />
                                            </div>
                                        </template>
                                        <template v-if="column.filterType == filterType.ComplexDropdown  || column.filterType == filterType.ComplexBoolean">
                                            <div>
                                                <v-row no-gutters>
                                                    <v-col cols="6">
                                                        <v-btn text block @click="addFilter(column.filterType, column.key, multiSearch[column.key] )" color="success">Filter</v-btn>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-btn text block @click="clearComplexFilter(column.key, column.filterType)" color="warning">Clear</v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-select :key="column.key"
                                                          v-model="multiSearch[column.key]"
                                                          :items="column.filterType == filterType.ComplexBoolean ? booleanArray : column.valueAccessor"
                                                          :label="column.title"
                                                          persistent-hint
                                                          item-value="id"
                                                          item-title="name"
                                                          :autofocus="true" />
                                            </div>
                                        </template>
                                        <template v-if="column.filterType == filterType.ComplexMultiSelectCheckbox">
                                            <div :key="getColumnKey(column.key)">
                                                <v-row no-gutters>
                                                    <v-col cols="6">
                                                        <v-btn text block @click="addFilter(column.filterType, column.key, multiSearch[column.key] )" color="success">Filter</v-btn>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-btn text block @click="clearComplexFilter(column.key, column.filterType)" color="warning">Clear</v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-select :key="column.key"
                                                          v-model="multiSearch[column.key]"
                                                          :items="column.valueAccessor"
                                                          :label="column.title"
                                                          multiple
                                                          persistent-hint
                                                          item-value="id"
                                                          item-title="name"
                                                          :autofocus="true">
                                                    <template v-slot:prepend-item>
                                                        <v-list-item title="Select All"
                                                                     @click="toggleList(column.filterType, column.key, column.valueAccessor, multiSearch[column.key])">
                                                            <template v-slot:prepend>
                                                                <v-checkbox-btn :color="checkSomeItems(column.key) ? 'indigo-darken-4' : undefined"
                                                                                :indeterminate="checkSomeItems(column.key) && !checkAllItems(column.key, column.valueAccessor)"
                                                                                :model-value="checkAllItems(column.key, column.valueAccessor)" />
                                                            </template>
                                                        </v-list-item>
                                                    </template>
                                                </v-select>
                                            </div>
                                        </template>
                                        <template v-if="column.filterType == filterType.ComplexNumberRange">
                                            <v-row no-gutters>
                                                <v-col cols="6">
                                                    <v-btn text block @click="addRangeFilter(column.filterType, column.key, multiRangePrimary[column.key] , multiRangeSecondary[column.key])" color="success">Filter</v-btn>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-btn text block @click="clearRangeFilter(column.key, column.filterType)" color="warning">Clear</v-btn>
                                                </v-col>
                                            </v-row>
                                            <v-text-field v-model="multiRangePrimary[column.key]"
                                                          type="number"
                                                          placeholder="Greater than or equal to"
                                                          :autofocus="true" />
                                            <v-text-field v-model="multiRangeSecondary[column.key]"
                                                          type="number"
                                                          placeholder="less than or equal to"
                                                          :autofocus="true" />
                                        </template>
                                    </div>

                                </v-card>
                            </v-menu>
                        </div>
                    </td>
                </template>
            </tr>
        </template>
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>

        <template #item.actions="{ item }">
            <v-row justify="end">
                <v-btn v-for="command in entityGrid.commands"
                       :prepend-icon="command.buttonIcon"
                       variant="text"
                       @click="command.action(item.raw.id)">
                    {{ command.buttonLabel }}
                </v-btn>
            </v-row>
        </template>
    </VDataTableServer>
</template>

<script setup lang="ts">
    import { ref, onMounted, nextTick } from "vue";
    import { VuetifyEntityGrid } from "@js/grids/vuetify/vuetifyEntityGrid";
    import { VDataTableServer } from "vuetify/lib/labs/components";
    import { FilterType, StringOperators, NumberOperators } from "@js/grids/vuetify/types";

    const entityGridRef = ref(0);
    defineExpose({ entityGridRef });
    const filterType = FilterType;
    const searchText = ref("");
    const key = ref(0);
    const multiSearch = ref({});
    const multiRangePrimary = ref({})
    const multiRangeSecondary = ref({})
    const multiOp = ref({});
    let updateNumber = 0;
    let menuNumber = 0;

    const booleanArray = [
        { id: 1, name: "Yes" },
        { id: 0, name: "No" }
    ];

    const stringOperators = Object.values(StringOperators);
    const numberOperators = Object.values(NumberOperators);

    const props = defineProps({
        entityGrid: { type: VuetifyEntityGrid, required: true }
    });

    onMounted(() => {
        props.entityGrid.setRefreshMethod(refresh);
    })

    // Refreshes grid by updating key value to force update
    function refresh(): void {
        key.value++;
    }

    async function search(): Promise<void> {
        props.entityGrid.search = searchText.value;
    }

    async function addFilter(type: FilterType, key: string, value: any): Promise<void> {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter(element => element.key != key);
        props.entityGrid.extraFilters.push({ type, key, value });
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function addRangeFilter(type: FilterType, key: string, primaryValue: any, secondaryValue: any): Promise<void> {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter(element => element.key != key);
        props.entityGrid.extraFilters.push({ type, key, primaryValue, secondaryValue });
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function addComplexFilter(type: FilterType, key: string, value: any, operator: string): Promise<void> {
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter(element => element.key != key);
        props.entityGrid.extraFilters.push({ type, key, value, operator });
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function clearRangeFilter(key: string, filterType: FilterType): Promise<void> {
        if (filterType == FilterType.ComplexNumberRange) {
            multiRangePrimary.value[key] = '';
            multiRangeSecondary.value[key] = '';
        }
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter(element => element.key != key);
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function clearComplexFilter(key: string, filterType: FilterType): Promise<void> {
        if (filterType == FilterType.ComplexMultiSelectCheckbox) {
            delete multiSearch.value[key];
            updateNumber++;
        }
        else {
            multiSearch.value[key] = '';
        }
        if (filterType == FilterType.ComplexText) {
            updateOperator(key, "Contains");
            updateNumber++;
        }
        if (filterType == FilterType.ComplexNumber) {
            multiOp.value[key] = 'Equals';
            updateNumber++;
        }
        props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter(element => element.key != key);
        props.entityGrid.refresh();
        menuNumber++;
    }

    async function toggleList(type: FilterType, key: string, items: any, selectedItems: any): Promise<void> {
        if (selectedItems && selectedItems.length == items.length) {
            delete multiSearch.value[key];
            updateNumber++;
            props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter(element => element.key != key);
        } else {
            const data = items.map(i => i.id);
            multiSearch.value[key] = data;
            props.entityGrid.extraFilters = props.entityGrid.extraFilters.filter(element => element.key != key);
            props.entityGrid.extraFilters.push({ type, key, value: data });
        }
        await nextTick();
        props.entityGrid.refresh();
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
        return key + '' + updateNumber;
    }

    function getMenuKey(key: string): string {
        return key + '' + menuNumber;
    }

    function checkSomeItems(key: string): boolean {
        return multiSearch.value[key] == undefined
            ? false
            : multiSearch.value[key].length > 0
    }

    function checkAllItems(key: string, items: any): boolean {
        return multiSearch.value[key] == undefined
            ? false
            : multiSearch.value[key].length == items.length;
    }
</script>
