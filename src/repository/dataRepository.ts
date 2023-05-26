import * as dataJson from '../data/data.json';

export default class DataRepository {
    public getServiceYears = () => dataJson.serviceYears;
    public getServiceTypes = () => dataJson.serviceTypes;
    public getServicePricesSingle = () => dataJson.servicePricesSingle;
    public getServicePricesPackage = () => dataJson.servicePricesPackage;
    public getServiceSpecialCases = () => dataJson.serviceSpecialCases;
    public getServiceRequiredOtherServices = () => dataJson.serviceRequiredOtherServices;
}