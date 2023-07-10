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
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>

        <template #item.actions="{ item }">
            <v-row justify="end">
                <v-btn
                    v-for="command in entityGrid.commands"
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
    import { ref, onMounted } from "vue";
    import { VuetifyEntityGrid } from "@js/grids/vuetify/vuetifyEntityGrid";
    import { VDataTableServer } from "vuetify/lib/labs/components";

    const entityGridRef = ref(0);
    defineExpose({ entityGridRef });

    const searchText = ref("");
    const key = ref(0);

    const props = defineProps({
        entityGrid: { type: VuetifyEntityGrid, required: true },
    });

    onMounted(() => {
        props.entityGrid.setRefreshMethod(refresh);
    });

    // Refreshes grid by updating key value to force update
    function refresh(): void {
        key.value++;
    }

    async function search(): Promise<void> {
        props.entityGrid.search = searchText.value;
    }
</script>
