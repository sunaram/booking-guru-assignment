// cache the wikipedia data, let's assume the data is static
const wikipediaCache: Map<string, string> = new Map<string, string>();

export const getWikipediaData = async (city: string): Promise<string> => {
    try {
        if(wikipediaCache.has(city.toLocaleLowerCase())) {
            return wikipediaCache.get(city.toLocaleLowerCase())!;
        }
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(city)}&prop=description&format=json`);

        // check if error 429 (rate limit exceeded)
        if (response.status === 429) {
            // wait for an hour before retrying
            //await new Promise((resolve) => setTimeout(resolve, 60 * 60 * 1000));
            // return getWikipediaData(city);
            throw new Error('Wikipedia rate limit exceeded');
        }

        const data = await response.json();
        
        const pageId = Object.keys(data.query.pages)[0];
        if(pageId) {      
            const description = data.query.pages[pageId]?.description || "";      
            wikipediaCache.set(city.toLocaleLowerCase(), description);
            return description;
        }
        
    } catch(error) {
        // log wikipedia error here
        console.error(error);
    }  
    return "";  
}