<template>
    <div>
        <div class="title-bar">
            <h1 class="page-title">{{ t("entityName.plural") }}</h1>
            <div>
                <v-btn id="createNewBtn"
                       color="primary"
                       :loading="isSaving"
                       v-if="isAdmin"
                       @click="onAddEntityButtonClicked">
                    <v-icon small>mdi-plus-thick</v-icon>
                    &nbsp;{{ t("button.createNew") }}
                </v-btn>
            </div>
        </div>

        <v-card width="100%" class="text-center" flat tile>
            <v-card-text>
                <ObVuetifyGrid ref="entityGridRef" :entityGrid="entityGrid">
                    <template #item.isActive="props">
                        <v-checkbox v-model="props.item.raw.isActive" disabled></v-checkbox>
                    </template>

                    <template #item.isLockedOut="props">
                        <v-checkbox v-model="props.item.raw.isLockedOut" disabled></v-checkbox>
                    </template>
                </ObVuetifyGrid>
            </v-card-text>
        </v-card>

        <!--add/edit modal-->
        <v-modalPopup v-model:visible="showEntity" :title="t('message.addEditUserTitle')">
            <template #content>
                <v-card-text>
                    <v-form ref="formRef">
                        <v-text-field v-model="entity.email"
                                      class="py-1"
                                      clearable
                                      dense
                                      outlined
                                      :label="t('entityColumn.emailAddress')"
                                      name="email"
                                      :rules="[rules.required, rules.email]"></v-text-field>
                        <v-text-field v-model="entity.userName"
                                      class="py-1"
                                      clearable
                                      dense
                                      outlined
                                      :label="t('entityColumn.userName')"
                                      name="userName"
                                      :rules="[rules.required, rules.max(entity.userName, 150)]"></v-text-field>
                        <v-select v-show="!isMe"
                                  v-model="entity.roleId"
                                  class="py-1"
                                  outlined
                                  dense
                                  :items="roles"
                                  name="roleId"
                                  :label="t('entityColumn.roleId')"
                                  :rules="[rules.required]"></v-select>
                        <v-checkbox v-show="isMe"
                                    v-model="entity.isActive"
                                    :label="t('entityColumn.isActive')"></v-checkbox>
                    </v-form>
                </v-card-text>
            </template>
            <template #footer>
                <v-btn id="closePopupBtn" @click="closeEntityModal">{{ t("button.close") }}</v-btn>
                <v-btn id="unlockBtn"
                       color="success"
                       v-if="!entity.isNew && entity.isLockedOut"
                       @click="unlock">{{ t("button.unlock") }}</v-btn>
                <v-btn v-if="!entity.isNew"
                       color="blue"
                       id="resetPasswordBtn"
                       @click="resetPassword">{{ t("button.resetPassword") }}</v-btn>
                <v-btn id="confirmSaveBtn"
                       color="primary"
                       :loading="isSaving"
                       @click="onSubmit">{{ t("button.save") }}</v-btn>
            </template>
        </v-modalPopup>

        <!--alert modal-->
        <v-modalPopup :namespace="'alertModal'" v-model:visible="alertVisible" />
    </div>
</template>

<script setup lang="ts">
    import { EntityGridAction } from "@js/grids/entityGrid";

    import { User } from "@js/dataModels/users/user";
    import { UserRole } from "@js/dataModels/users/userRole";

    import UserApiClient from "@js/api/users/userApiClient";

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

    const entityApiClient = new UserApiClient();
    const roleArray = [
        { id: UserRole.ADMINISTRATOR, name: UserRole.ADMINISTRATOR },
        { id: UserRole.USER, name: UserRole.USER }
    ];

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
    } = useEntityGridCrud<User, string, VuetifyEntityGrid>(
        User,
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
            .setInitialSorting("userName", "asc")
            // .enableComplexFilter()
            .setEditBehaviour(onEditButtonClicked)
            /*.addColumn({ title: t("entityColumn.identity"), sortable: true, key: "identity", allowFiltering: true, filterType: FilterType.ComplexNumberRange })
            .addColumn({ title: t("entityColumn.emailAddress"), sortable: true, key: "email", allowFiltering: true, filterType: FilterType.ComplexText })
            .addColumn({ title: t("entityColumn.userName"), sortable: true, key: "userName", allowFiltering: true, filterType: FilterType.ComplexText })
            .addColumn({ title: t("entityColumn.roleId"), sortable: true, key: "roleId", allowFiltering: true, filterType: FilterType.ComplexMultiSelectCheckbox, valueAccessor: roleArray })
            .addColumn({ title: t("entityColumn.isActive"), sortable: true, key: "isActive", allowFiltering: true, filterType: FilterType.ComplexBoolean })
            .addColumn({ title: t("entityColumn.isLockedOut"), sortable: true, key: "isLockedOut", allowFiltering: true, filterType: FilterType.ComplexBoolean });*/
            .addColumn({ title: t("entityColumn.identity"), sortable: true, key: "identity", allowFiltering: true, filterType: FilterType.SimpleNumber })
            .addColumn({ title: t("entityColumn.emailAddress"), sortable: true, key: "email", allowFiltering: true, filterType: FilterType.SimpleText })
            .addColumn({ title: t("entityColumn.userName"), sortable: true, key: "userName", allowFiltering: true, filterType: FilterType.SimpleText })
            .addColumn({ title: t("entityColumn.roleId"), sortable: true, key: "roleId", allowFiltering: true, filterType: FilterType.SimpleMultiSelectCheckbox, valueAccessor: roleArray })
            .addColumn({ title: t("entityColumn.isActive"), sortable: true, key: "isActive", allowFiltering: true, filterType: FilterType.SimpleBoolean })
            .addColumn({ title: t("entityColumn.isLockedOut"), sortable: true, key: "isLockedOut", allowFiltering: true, filterType: FilterType.SimpleBoolean });
        return entityGrid;
    }

    const isMe = computed(() => entity.value.id == myId.value);

    async function onSubmit() {
        const { valid } = await formRef.value!.validate();

        if (valid) {
            await saveEntity();
        }
    };

    async function resetPassword(): Promise<void> {
        try {
            await entityApiClient.resetPassword(entity.value.loginId);
            showEntity.value = false;
        } catch (e) {
            onError(e);
        }
    }

    async function unlock(): Promise<void> {
        try {
            entityGrid.rememberCurrentPageBeforeGridAction(EntityGridAction.EntityEdit);
            await entityApiClient.unlock(entity.value.id);
            showEntity.value = false;
            entityGrid.restoreCurrentPage();
        } catch (e) {
            onError(e);
        }
    }
</script>