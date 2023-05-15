<template>
    <div>
        <div class="title-bar">
            <h1 class="page-title">{{ $t("entityName.plural") }}</h1>
            <div>
                <v-btn
                    id="createNewBtn"
                    color="primary"
                    :loading="isSaving"
                    v-if="isAdmin"
                    @click="onAddEntityButtonClicked"
                >
                    <v-icon small>mdi-plus-thick</v-icon>
                    &nbsp;{{ $t("button.createNew") }}
                </v-btn>
            </div>
        </div>

        <v-card width="100%" class="text-center" flat tile>
            <v-card-text>
                <text-field-grid-search
                    @search="gridSearch"
                    class="table-search"
                    :minLength="3"
                    :delay="1000"
                ></text-field-grid-search>
                <v-data-table
                    id="mainTable"
                    :headers="entityGrid.columns"
                    ref="entityGrid"
                    :page.sync="entityGrid.currentPage"
                    :items="entityGrid.data"
                    :server-items-length="entityGrid.count"
                    :loading="entityGrid.isLoading"
                    :sort-by.sync="entityGrid.currentOrderByField"
                    :sort-desc.sync="entityGrid.currentOrderDescending"
                    @update:page="pageChanged"
                    @update:items-per-page="pageItemCountChanged"
                    @update:sort-by="sortByChanged"
                    @update:sort-desc="sortDirectionChanged"
                >
                    <template v-slot:item.isActive="props">
                        <v-simple-checkbox v-model="props.item.isActive" disabled></v-simple-checkbox>
                    </template>

                    <template v-slot:item.isLockedOut="props">
                        <v-simple-checkbox v-model="props.item.isLockedOut" disabled></v-simple-checkbox>
                    </template>

                    <template v-slot:item.actions="props">
                        <v-container>
                            <v-row justify="end">
                                <v-btn
                                    class="mr-2"
                                    color="primary"
                                    @click="onEditEntityButtonClicked(props.item.id)"
                                >
                                    <v-icon small>mdi-pencil</v-icon>
                                    &nbsp;{{ $t("button.edit") }}
                                </v-btn>
                            </v-row>
                        </v-container>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!--add/edit modal-->
        <v-dialog v-model="showEntity" persistent max-width="550px">
            <v-card>
                <v-container>
                    <h1>{{ $t("message.addEditUserTitle") }}</h1>
                    <v-card-text>
                        <v-form>
                            <v-row>
                                <v-col class="pb-0" cols="12">
                                    <v-text-field
                                        v-model="entity.email"
                                        clearable
                                        class="pt-1"
                                        dense
                                        outlined
                                        :label="$t('entityColumn.emailAddress')"
                                        name="email"
                                        v-validate="'required|email'"
                                        data-vv-name="email"
                                        :data-vv-as="$t('entityColumn.emailAddress')"
                                        :error-messages="errors.collect('email')"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="pt-0 pb-0" cols="12">
                                    <v-text-field
                                        v-model="entity.userName"
                                        clearable
                                        class="pt-1"
                                        dense
                                        outlined
                                        :label="$t('entityColumn.userName')"
                                        name="userName"
                                        v-validate="'required'"
                                        data-vv-name="userName"
                                        :labeln="$t('entityColumn.userName')"
                                        :data-vv-as="$t('entityColumn.userName')"
                                        :error-messages="errors.collect('userName')"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row v-show="!isMe">
                                <v-col class="pt-0 pb-0" cols="12">
                                    <v-select
                                        outlined
                                        dense
                                        :items="roles"
                                        name="roleId"
                                        data-vv-name="roleId"
                                        v-validate="'required'"
                                        :data-vv-as="$t('entityColumn.roleId')"
                                        :label="$t('entityColumn.roleId')"
                                        :error-messages="errors.collect('roleId')"
                                        v-model="entity.roleId"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row v-show="isMe">
                                <v-col class="pt-0 pb-0" cols="12">
                                    <v-checkbox
                                        class="mt-0"
                                        v-model="entity.isActive"
                                        :label="$t('entityColumn.isActive')"
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn id="closePopupBtn" @click="closeEntityModal">{{ $t("button.close") }}</v-btn>
                        <v-btn
                            id="unlockBtn"
                            color="success"
                            v-if="!entity.isNew && entity.isLockedOut"
                            @click="unlock"
                        >{{ $t("button.unlock") }}</v-btn>
                        <v-btn
                            v-if="!entity.isNew"
                            color="blue"
                            id="resetPasswordBtn"
                            @click="resetPassword"
                        >{{ $t("button.resetPassword") }}</v-btn>
                        <v-btn
                            id="confirmSaveBtn"
                            color="primary"
                            :loading="isSaving"
                            @click="saveEntity"
                        >{{ $t("button.save") }}</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <!--alert modal-->
        <v-alertModal
            :bus="this"
            :namespace="'alertModal'"
            :visible="alertVisible"
            @close="hideAlert"
        ></v-alertModal>
    </div>
</template>

<script lang="ts">
    import { Component, Mixins } from "vue-property-decorator";
    import UserContextMixin from "@js/mixins/userContextMixin";

    import EntityCrudMixin from "@js/entityCrud/entityCrudMixin";
    import { EntityGridAction } from "@js/grids/entityGrid";
    import userDictionary from "@js/localizations/resources/components/users";
    import { VuetifyEntityGrid } from "@js/grids/vuetify/vuetifyEntityGrid";

    import { EntityBuilder } from "@js/dataModels/entity";
    import { User } from "@js/dataModels/users/user";
    import { UserRole } from "@js/dataModels/users/userRole";

    import UserApiClient from "@js/api/users/userApiClient";
    import TextFieldGridSearch from "@components/util/vuetify/textFieldGridSearch.vue";

    @Component({
        name: "usersApp",
        components: {
            "text-field-grid-search": TextFieldGridSearch
        },
        i18n: {
            messages: userDictionary
        }
    })
    export default class Users extends Mixins<EntityCrudMixin<User, string, VuetifyEntityGrid>, UserContextMixin>(
        EntityCrudMixin,
        UserContextMixin
    ) {
        entityApiClient!: UserApiClient;

        roles: any = UserRole.AllRoles;

        checkbox: boolean = false;

        constructor() {
            super();
        }

        //Note, there are two basic parameters we need to provide for each class that is using EntityCrudMixin:

        //Entity builder, this is actually a class, which constructor will be used to create a new instance of the entity
        public provideEntityBuilder(): EntityBuilder<User, string> {
            return User;
        }

        // Entity Api Client, which is the class responsible to perform the HTTP requests against the server
        public provideEntityApiClient(): UserApiClient {
            return new UserApiClient();
        }

        created(): void { }

        public provideGrid(): VuetifyEntityGrid {
            var columns = [
                { text: this.$t("entityColumn.emailAddress"), sortable: true, value: "email" },
                { text: this.$t("entityColumn.userName"), sortable: true, value: "userName" },
                { text: this.$t("entityColumn.roleId"), sortable: true, value: "roleId" },
                { text: this.$t("entityColumn.isActive"), sortable: true, value: "isActive" },
                { text: this.$t("entityColumn.isLockedOut"), sortable: true, value: "isLockedOut" }
            ];

            return new VuetifyEntityGrid(columns, false);
        }

        public async mounted(): Promise<void> {
            await this.entityGrid.changeOrderByField("email");
        }

        async pageChanged(): Promise<void> {
            await this.entityGrid.changePage();
        }

        async pageItemCountChanged(count: number): Promise<void> {
            await this.entityGrid.changePageItemCount(count);
        }

        async sortByChanged(column: string): Promise<void> {
            if (column != undefined) {
                await this.entityGrid.changeOrderByField(column);
            }
        }

        async sortDirectionChanged(sortDesc: boolean): Promise<void> {
            await this.entityGrid.changeOrderByDirection(sortDesc);
        }

        gridSearch(search: string): void {
            this.entityGrid.search = search;
            this.entityGrid.refresh();
        }

        get isMe(): boolean {
            return this.entity.id == this.myId;
        }

        async resetPassword(): Promise<void> {
            try {
                await this.entityApiClient.resetPassword(
                    this.entity.loginId
                );
                this.showEntity = false;
            } catch (e) {
                this.onError(e);
            }
        }

        async unlock(): Promise<void> {
            try {
                this.entityGrid.rememberCurrentPageBeforeGridAction(EntityGridAction.EntityEdit);
                await this.entityApiClient.unlock(this.entity.id);
                this.showEntity = false;
                this.entityGrid.restoreCurrentPage();
            } catch (e) {
                this.onError(e);
            }
        }
    }
</script>
