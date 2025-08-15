import { getPollutionData as getPollutionDataUtil, type AuthenticatedUserToken } from "../utils/pollution-api.js";
import { cleanPollutionData, enrichPollutionData, formatPollutionData } from "../utils/pollution-data.js";
import { type CountryPollutionDataResult, type EnrichedPollutionData } from "../types/pollution.js";

// ideally this record would cached in db. but for simplicity, we will keep it in memory. race condition can occure if two or more requests come in at the same time
const allCountryPollutionData: EnrichedPollutionData[] = [];

/*
* @description - get pollution data
* @param country - string - country name
* @param page - number - page number
* @param limit - number - number of items per page
* @returns - CountryPollutionDataResult - formatted pollution data
*/
export const getPollutionData = async (country: string, page: number = 1, limit: number = 10): Promise<CountryPollutionDataResult> => {
    const countryPollutionData = allCountryPollutionData.find((countryData) => countryData.country === country);
    // return if already cached and is at max 1 hour old
    if( countryPollutionData && (countryPollutionData.lastUpdated.getTime() + 60 * 60 * 1000) > Date.now() ) {
        const myData = formatPollutionData(countryPollutionData, page, limit);
        return myData;
    }
    // invalidate otherwise
    allCountryPollutionData.splice(allCountryPollutionData.findIndex((countryData) => countryData.country === country), 1);

    // get pollution data
    const pollutionRecords = [];
    let apiPage = 1; 
    const apiLimit = 20;
    while(true) {        
        const pollutionData = await getPollutionDataUtil(country, apiPage, apiLimit);
        pollutionRecords.push(...pollutionData.results);
        if( apiPage >= pollutionData.meta.totalPages ) {
            break;
        }
        apiPage++;
    }    

    // lets cache for 1 hour
    const newCountryPollutionData = { country, cities: pollutionRecords as [{name: string, pollution: number}], lastUpdated: new Date() };
    // clean the data
    const cleanedPollutionData = cleanPollutionData(newCountryPollutionData);
    // enrich the data
    const enrichedPollutionData = await enrichPollutionData(cleanedPollutionData);
    // race condition will create duplicates for the country. we could use a lock to prevent that
    allCountryPollutionData.push(enrichedPollutionData);
    const myData = formatPollutionData(enrichedPollutionData, page, limit);
    return myData;
    
}