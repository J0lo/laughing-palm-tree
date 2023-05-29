import * as dataJson from '../data/data.json';
import { ServiceType, ServiceYear } from '../model/originalModels';
import ServicePricesPackage from '../model/servicePricesPackage';
import ServicePricesSingle from '../model/servicePricesSingle';
import ServiceRequiredOtherServices from '../model/serviceRequiredOtherServices';
import ServiceSpecialCases from '../model/serviceSpecialCases';

export default class DataRepository {
    public getServiceYears = (): ServiceYear[] => { return dataJson.serviceYears as ServiceYear[]; };
    public getServiceTypes = (): ServiceType[] => { return dataJson.serviceTypes as ServiceType[]; };
    public getServicePricesSingle = (): ServicePricesSingle[] => { return dataJson.servicePricesSingle as ServicePricesSingle[]; };
    public getServicePricesPackage = (): ServicePricesPackage[] => { return dataJson.servicePricesPackage as ServicePricesPackage[]; };
    public getServiceSpecialCases = (): ServiceSpecialCases[] => { return dataJson.serviceSpecialCases as ServiceSpecialCases[]; };
    public getServiceRequiredOtherServices = (): ServiceRequiredOtherServices[] => { return dataJson.serviceRequiredOtherServices as ServiceRequiredOtherServices[]; };
}