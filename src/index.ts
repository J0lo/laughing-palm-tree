import DataRepository from './repository/dataRepository';
import { ServiceType, ServiceYear }  from './model/originalModels';

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    let repo = new DataRepository();
    let constraints = repo.getServiceRequiredOtherServices();
    let requiredOtherServices = constraints.filter(x => x.service === action.service);
    let selectedServices = [...previouslySelectedServices];

    // Firstly the service required services are considered
    if(requiredOtherServices.length === 1) {
        let doesContain = selectedServices.some(x => requiredOtherServices[0].requires.includes(x));
        if (!doesContain) {
            return selectedServices;
        }
    }

    // If the service isn't already present, it is added to the selected services
    if (action.type === "Select" && !selectedServices.includes(action.service)) {
        selectedServices.push(action.service);
    }
    else if (action.type === "Deselect" && selectedServices.includes(action.service)) {
        // Services dependant on the deselected service are found and removed from the list
        let relatedServices = constraints.filter(x => x.requires.includes(action.service));
        if (relatedServices.length > 0) {
            relatedServices.forEach(relatedService => {
                if (relatedService.requires.length === 1) {
                    selectedServices = selectedServices.filter(x => x !== relatedService.service);
                }
                else {
                    let otherRequiredService = relatedService.requires.filter(x => x !== action.service);
                    if (!otherRequiredService.some(x => selectedServices.includes(x as ServiceType))) {
                        selectedServices = selectedServices.filter(x => x !== relatedService.service);
                    }
                }
            });
        }

        // Deselected service are removed
        return selectedServices.filter(x => x !== action.service)
    }

    return selectedServices;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let repo = new DataRepository();
    let discountedPrice = 0;
    let basePrice = 0;
    let servicesLeft = selectedServices;

    let pricePackages = repo.getServicePricesPackage().filter(p => p.year === selectedYear || p.year == null);
    let singles = repo.getServicePricesSingle();
    let specialCases = repo.getServiceSpecialCases();

    // Firstle any and all packages are considered, they are already sorted in the data file,
    // would probably need to figure out a way to ensure that the most attractive packages
    // are always considered first (currently can and is achieved by order in data.json)
    // ideas: index in the data (lowest value is considered first) or package size (bigger
    // package is considered first). Other way is to consider all options but that would be
    // more time-consuming in terms of processing.
    pricePackages.forEach(pricePackage => {
        if (pricePackage.services.every(s => servicesLeft.includes(s as ServiceType))) {
            discountedPrice += pricePackage.price;
            servicesLeft = servicesLeft.filter(s => !pricePackage.services.includes(s));
        }
    });

    // Secondly single services are consideredfrom the remaining service list
    servicesLeft.forEach(service => {
        let currentService = singles.filter(x => x.service === service && x.year === selectedYear);
        if (currentService.length === 0) {
            currentService = singles.filter(x => x.service === service && x.year === null);
        }

        if (currentService.length === 1) {
            let servicePrice = currentService[0].price;
            discountedPrice += servicePrice;
            servicesLeft = servicesLeft.filter(s => s !== service);
        }
    });

    // Thirdly service prices are added for base price, without considering packages
    selectedServices.forEach(service => {
        let singlePrice = singles.filter(s => s.service == service && s.year === selectedYear);
        if (singlePrice.length === 0) {
            singlePrice = singles.filter(s => s.service == service && s.year === null);
        }

        if (singlePrice.length === 1) {
            basePrice += singlePrice[0].price;
        }
    })

    // Lastly services that rely on special cases (i.e. Bluray requiring video recording) are considered
    // for both base and discounted price
    servicesLeft.forEach(service => {
        let specialCaseService = specialCases.filter(sc => sc.service === service);
        if (specialCaseService.length === 1 && selectedServices.some(s => specialCaseService[0].service.includes(s))) {
            discountedPrice += specialCaseService[0].price;
            basePrice += specialCaseService[0].price;
        }
    });

    return { basePrice: basePrice, finalPrice: discountedPrice };
};