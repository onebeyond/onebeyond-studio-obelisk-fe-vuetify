import { GuidEntity } from "@js/dataModels/entity";

export class PurchaseOrder extends GuidEntity {
    public orderDate: Date = new Date();
    public customerId: any;
}
