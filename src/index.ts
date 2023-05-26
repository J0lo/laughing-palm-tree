import DataRepository from './repository/dataRepository';

export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    let repo = new DataRepository();
    let constraints = repo.getServiceRequiredOtherServices();
    let requiredOtherServices = constraints.filter(x => x.service === action.service);

    if(requiredOtherServices.length === 1) {
        let doesContain = previouslySelectedServices.some(x => requiredOtherServices[0].requires.includes(x));
        if (!doesContain) {
            return previouslySelectedServices;
        }
    }

    if (action.type === "Select" && !previouslySelectedServices.includes(action.service)) {
        previouslySelectedServices.push(action.service);
    }
    else if (action.type === "Deselect" && previouslySelectedServices.includes(action.service)) {
        let relatedServices = constraints.filter(x => x.requires.includes(action.service));
        if (relatedServices.length > 0) {
            relatedServices.forEach(relatedService => {
                if (relatedService.requires.length === 1) {
                    previouslySelectedServices = previouslySelectedServices.filter(x => x !== relatedService.service);
                }
                else {
                    let otherRequiredService = relatedService.requires.filter(x => x !== action.service);
                    if (previouslySelectedServices.some(x => !otherRequiredService.includes(x))) {
                        previouslySelectedServices = previouslySelectedServices.filter(x => x !== relatedService.service);
                    }
                }

            });
            previouslySelectedServices = previouslySelectedServices.filter(x => !relatedServices.some(y => y.service === x));
        }

        return previouslySelectedServices.filter(x => x !== action.service)
    }

    return previouslySelectedServices;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let repo = new DataRepository();
    let singles = repo.getServicePricesSingle();
    let price = 0

    selectedServices.forEach(service => {
        let servicePrice = singles.filter(x => x.service === service && x.year == selectedYear)[0].price;
        price += servicePrice;      
    });

    return { basePrice: price, finalPrice: 0 };
};