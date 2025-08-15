import { type CountryPollutionData, type EnrichedPollutionData, type CountryPollutionDataResult, type EnhancedCityPollution } from "../types/pollution.js";
import { getWikipediaData } from "./wikipedia.js";
import * as countryList from 'country-list';

/*
* @description - clean pollution data
* @param data - pollution data
* @returns - CountryPollutionData - cleaned pollution data 
*/
export const cleanPollutionData = (data: CountryPollutionData): CountryPollutionData => {
    // first trim and case transform city names
    data.cities = data.cities.map((city) => {
        // convert city name to first uppercase
        let name = city.name.trim().toLowerCase();
        if(name.length > 0) { 
            name = name.charAt(0).toUpperCase() + name.slice(1); 
        }
        return { ...city, name }
    });
    // remove duplicate city names
    data.cities = data.cities.filter((city, index) => data.cities.findIndex((c) => c.name === city.name) === index);
    // filter city name to remove invalid characters
    // International (with Unicode support, allowing spaces, hyphens, apostrophes, periods)
    data.cities = data.cities.filter((city) => /^[\p{Letter}\s\-]+$/u.test(city.name));
    
    return data;
}

/*
* @description - enrich pollution data
* @param data - CountryPollutionData - pollution data
* @returns - Promise<EnrichedPollutionData>
*/
export const enrichPollutionData = async (data: CountryPollutionData): Promise<EnrichedPollutionData> => {
    // get the wikipedia data for each city
    // data.cities = await Promise.all(data.cities.map(async (city) => ({ ...city, description: await getWikipediaData(city.name) })));
    // let's process it in batches of 30 to avoid rate limits
    let cities: EnhancedCityPollution[] = [];
    const batchSize = 30;
    for (let i = 0; i < data.cities.length; i += batchSize) {
        const batch = data.cities.slice(i, i + batchSize);
        const descriptions = await Promise.all(batch.map(async (city) => ({ ...city, description: await getWikipediaData(city.name) })));
        cities = [...cities, ...descriptions];
        data.cities.splice(i, batchSize, ...descriptions);
        // wait for a scond before processing the next batch
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const countryName = countryList.getName(data.country) || data.country;
    return { ...data, country: countryName, cities };


    //const cities = data.cities.map((city) => ({ ...city, description: city.name + ' is a city in ' + data.country }));
    //return { ...data, cities: cities };
    
}

/*
* @description - format pollution data
* @param data - EnrichedPollutionData - pollution data
* @param page - number - page number
* @param limit - number - number of items per page
* @returns - CountryPollutionDataResult - formatted pollution data
*/
export const formatPollutionData = (data: EnrichedPollutionData, page: number, limit: number): CountryPollutionDataResult => {
    // get the pollution data for the page and limit
    const pollutionData = data.cities.slice((page - 1) * limit, page * limit);
    const total = data.cities.length;
    const cities = pollutionData.map((city) => ({
        name: city.name,
        country: data.country,
        pollution: city.pollution,
        description: city.description
    }));
    return { page, limit, total, cities };
}