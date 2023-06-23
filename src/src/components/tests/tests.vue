<template>
    <div>


        <v-card width="100%" class="text-center" flat tile>
            <v-card-text>
                <ObVuetifyGrid ref="entityGridRef" :entityGrid="entityGrid">
                </ObVuetifyGrid>
            </v-card-text>
        </v-card>



        <!--alert modal-->
        <v-modalPopup :namespace="'alertModal'" v-model:visible="alertVisible" />
    </div>
</template>

<script setup lang="ts">
    import { EntityGridAction } from "@js/grids/entityGrid";

    import { Test } from "@js/dataModels/tests/test";
    import { UserRole } from "@js/dataModels/users/userRole";

    import TestApiClient from "@js/api/tests/testApiClient";

    import useEntityGridCrud from "@js/entityCrud/useEntityGridCrud";
    import useUserContext from "@js/composables/useUserContext";
    import useRules from "@js/composables/useRules";
    import { computed, onBeforeMount, ref, reactive } from "vue";
    import { useI18n } from "vue-i18n";
    import { VuetifyEntityGrid } from "@js/grids/vuetify/vuetifyEntityGrid";
    import userDictionary from "@js/localizations/resources/components/users";
    import ObVuetifyGrid from "@components/obComponents/grids/obVuetifyGrid.vue";
    import { EntityUpdateUsingModalAndGrid, type ConstructorParams } from "@js/entityCrud/entityUpdateStrategy";
    import { VForm } from "vuetify/components";
    import { FilterType } from "@js/grids/vuetify/types";

    const entityApiClient = new TestApiClient();


    const entityGridRef = ref(null);
    const formRef = ref<VForm | null>(null);

    const { t } = useI18n({
        messages: userDictionary
    });

    const {
        entity,
        tGrid,
        showEntity,
        onError,
        alertVisible,
        isSaving,
        saveEntity,
        closeEntityModal,
        onEditEntityButtonClicked,
        onAddEntityButtonClicked
    } = useEntityGridCrud<Test, string, VuetifyEntityGrid>(
        Test,
        entityApiClient,
        provideGrid(),
        entityGridRef,
        provideEntityUpdateStrategy()
    );

    const entityGrid = reactive(tGrid) as VuetifyEntityGrid;

    const rules = useRules();

    onBeforeMount(() => {
        entityGrid.initDataAdaptor(entityApiClient.apiUrl, onError);
    });

    const { isAdmin, myId } = useUserContext();
    const roles = UserRole.AllRoles;

    function provideEntityUpdateStrategy() {
        return (params: ConstructorParams<User, string>, entityGrid: VuetifyEntityGrid) =>
            new EntityUpdateUsingModalAndGrid(params, entityGrid);
    }

    function onEditButtonClicked(id: string): Promise<void> {
        return onEditEntityButtonClicked(id);
    }

    function provideGrid(): VuetifyEntityGrid {
        const entityGrid = new VuetifyEntityGrid();

        entityGrid
            .setInitialSorting("number", "asc")
            // .enableComplexFilter()
            .setEditBehaviour(onEditButtonClicked)
            /* .addColumn({ title: "Number", sortable: true, key: "number", allowFiltering: true, filterType: FilterType.ComplexNumberRange })
             .addColumn({ title: "DateTime", sortable: true, key: "dateTime", allowFiltering: true, filterType: FilterType.ComplexDate })
             .addColumn({ title: "DateTimeOffset", sortable: true, key: "dateTimeOffset", allowFiltering: true, filterType: FilterType.ComplexDate, dataType: "dateTimeOffset" })
             .addColumn({ title: "DateOnly", sortable: true, key: "dateOnly", allowFiltering: true, filterType: FilterType: FilterType.ComplexDateOnly })*/
            .addColumn({ title: "Number", sortable: true, key: "number", allowFiltering: true, filterType: FilterType.SimpleNumber })
            .addColumn({ title: "DateTime", sortable: true, key: "dateTime", allowFiltering: true, filterType: FilterType.SimpleDate })
            .addColumn({ title: "DateTimeOffset", sortable: true, key: "dateTimeOffset", allowFiltering: true, filterType: FilterType.SimpleDate, dataType: "dateTimeOffset" })
            .addColumn({ title: "DateOnly", sortable: true, key: "dateOnly", allowFiltering: true, filterType: FilterType.SimpleDateOnly })

        return entityGrid;
    }

    const isMe = computed(() => entity.value.id == myId.value);

    async function onSubmit() {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            await saveEntity();
        }
    };

</script>