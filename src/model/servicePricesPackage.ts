import { ServiceType, ServiceYear } from "./originalModels"

export default class ServicePricesPackage {
    services: ServiceType[];
    year: ServiceYear;
    price: number;
}