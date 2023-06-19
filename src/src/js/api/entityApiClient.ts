import { plainToInstance } from "class-transformer";

import type { Entity, EntityBuilder } from "@js/dataModels/entity";
import ObResourceApiClient from "@js/api/obResourceApiClient";

export default class EntityApiClient<TEntity extends Entity<T>, T> extends ObResourceApiClient {
    constructor(private readonly entityBuilder: EntityBuilder<TEntity, T>, resource: string, version: string | null) {
        super(resource, version);
    }

    public get apiUrl(): string {
        return this.apiBaseUrl;
    }

    // Please use with care, this will retrieve all entities without any paging!
    public async getAll(): Promise<any> {
        const data = await this.get();
        return await data.json();
    }

    public async getEntity(id: T): Promise<TEntity> {
        const data = await this.get(`${id}`);
        return await this.toJsonEntity(data);
    }

    public async addEntity(entity: TEntity): Promise<T> {
        const data = await this.post("", entity);
        return (await data.json()) as T; //returns new entity Id
    }

    public async updateEntity(entity: TEntity): Promise<void> {
        await this.put(`${entity.id}`, entity);
    }

    public async deleteEntity(id: T): Promise<void> {
        await this.delete(`${id}`);
    }

    protected async toJsonEntity(response: any): Promise<TEntity> {
        return plainToInstance(this.entityBuilder, await response.json());
    }
}
