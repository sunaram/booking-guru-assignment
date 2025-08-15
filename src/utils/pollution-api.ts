import dotenv from 'dotenv';
dotenv.config();
import { type UserCredential } from "../types/user.js";
import { type PollutionData } from "../types/pollution.js";

export type AuthenticatedUserToken = {
    token: string,
    expiresIn: number,
    refreshToken: string
}
export type RefreshedToken = {
    token: string,
    expiresIn: number
}
export type AuthenticationError = {
    error: string
}

// we assume only one pollution data api credentials are to be used and avaialable as .env variables
const apiBase = process.env.POLLUTION_DATA_API_ENPOINT_BASE as string;
const apiUser = process.env.POLLUTION_DATA_API_USERNAME as string;
const apiPass = process.env.POLLUTION_DATA_API_PASSWORD as string;

// it would be best to store it in the database to ensure no race condition can occur
const authenticatedUser: AuthenticatedUserToken = {
    token: '',
    expiresIn: 0,
    refreshToken: ''
};

/*
* @description - authenticate user and return token
* @param input - UserCredential
* @returns - Promise<AuthenticatedUserToken | AuthenticationError> - user token or error
*/
export const authenticateUser = async (input: UserCredential): Promise<AuthenticatedUserToken | AuthenticationError> => {
    const {  username, password } = input;
    const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const token: AuthenticatedUserToken | AuthenticationError = await response.json();
    return token;    
}

/*
* @description - refresh token
* @param refreshToken - string
* @returns - Promise<RefreshedToken | AuthenticationError> - refreshed token or error
*/
export const refreshToken = async (refreshToken: string): Promise<RefreshedToken | AuthenticationError> => {
    const response = await fetch(`${apiBase}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const token: RefreshedToken | AuthenticationError = await response.json();
    return token;
}

/*
* @description - get pollution data
* @param country - string - e.g. IN
* @param page - number - default 1
* @param limit - number - default 10
* @param tryCount - number  
* @returns - Promise<PollutionData> - pollution data
*/
export const getPollutionData = async (country: string, page: number = 1, limit: number = 10, tryCount: number = 0): Promise<PollutionData> => {
    // check if user is autheticate
    if(!authenticatedUser.token) {
        const userToken = await authenticateUser({ username: apiUser, password: apiPass });
        if( (userToken as AuthenticationError).error ) {
            throw new Error((userToken as AuthenticationError).error);
        } 
        authenticatedUser.token = (userToken as AuthenticatedUserToken).token;
        authenticatedUser.expiresIn = (userToken as AuthenticatedUserToken).expiresIn;
        authenticatedUser.refreshToken = (userToken as AuthenticatedUserToken).refreshToken;
    }
    if(tryCount > 3) {
        // but first, let's invalidate the userToken
        authenticatedUser.token = '';
        authenticatedUser.expiresIn = 0;
        authenticatedUser.refreshToken = '';
        throw new Error('Failed to get pollution data due to authentication error');
    };
    tryCount += 1;
    const response = await fetch(`${apiBase}/pollution?country=${country}&page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authenticatedUser.token}`
        }
    });    

    if(response.status === 401) {
        // try refreshing token
        const refreshedToken = await refreshToken(authenticatedUser.refreshToken);
        if((refreshedToken as AuthenticationError).error) {
            throw new Error((refreshedToken as AuthenticationError).error);
        }
        // store the refreshed token
        // now use the new token to make the request
        authenticatedUser.token = (refreshedToken as RefreshedToken).token;
        authenticatedUser.expiresIn = (refreshedToken as RefreshedToken).expiresIn;
        // let's avoid infinite loop with tryCount
        return getPollutionData(country, page, limit, tryCount);
    }
    // check for error 429
    if(response.status === 429) {
        // wait for 10 seconds and try again
        await new Promise(resolve => setTimeout(resolve, 10000));
        return getPollutionData(country, page, limit);
    }
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PollutionData = await response.json();

    return data;
}