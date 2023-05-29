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
                    if (!otherRequiredService.some(x => previouslySelectedServices.includes(x as ServiceType))) {
                        previouslySelectedServices = previouslySelectedServices.filter(x => x !== relatedService.service);
                    }
                }
            });
        }

        return previouslySelectedServices.filter(x => x !== action.service)
    }

    return previouslySelectedServices;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let repo = new DataRepository();
    let price = 0;
    let servicesLeft = selectedServices;

    let pricePackages = repo.getServicePricesPackage().filter(p => p.year === selectedYear || p.year == null);
    let singles = repo.getServicePricesSingle();
    let specialCases = repo.getServiceSpecialCases();

    pricePackages.forEach(pricePackage => {
        if (pricePackage.services.every(s => servicesLeft.includes(s as ServiceType))) {
            price += pricePackage.price;
            servicesLeft = servicesLeft.filter(s => !pricePackage.services.includes(s));
        }
    });

    servicesLeft.forEach(service => {
        let currentService = singles.filter(x => x.service === service && (x.year == selectedYear || x.year === null));
        if (currentService.length === 1) {
            let servicePrice = currentService[0].price;
            price += servicePrice;
            servicesLeft = servicesLeft.filter(s => s !== service);
        }
    });

    servicesLeft.forEach(service => {
        let specialCaseService = specialCases.filter(sc => sc.service === service);
        if (specialCaseService.length === 1 && selectedServices.some(s => specialCaseService[0].service.includes(s))) {
            price += specialCaseService[0].price;
        }
    });

    return { basePrice: price, finalPrice: price };
};