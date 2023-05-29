import { ServiceType } from "./originalModels"
import SpecialCasesConditions from "./specialCasesConditions";

export default class ServiceSpecialCases
{ 
    service: ServiceType; 
    price: number; 
    conditions: SpecialCasesConditions[];
}

