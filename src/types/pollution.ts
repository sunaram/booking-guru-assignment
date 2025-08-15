export type CityPollution = {
    name: string,
    pollution: number
}
export type EnhancedCityPollution = CityPollution & { description: string };
export type ResultCityPollution = EnhancedCityPollution & { country: string };

export type PollutionData = {
    meta: {
        page: number,
        totalPages: number,
    }, 
    results: CityPollution[]
}

export type CountryPollutionData = {
    country: string,
    cities: CityPollution[],
    lastUpdated: Date
}

export type EnrichedPollutionData = {
    country: string,
    cities: EnhancedCityPollution[],
    lastUpdated: Date
}

export type CountryPollutionDataResult = {
    page: number,
    limit: number,
    total: number,
    cities: ResultCityPollution[],
}