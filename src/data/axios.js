import axios from 'axios';

const baseURL = 'https://api.coincap.io/v2/';

const requestCall = axios.create({
    baseURL
})

export const getAssets = (params) => {
    return requestCall.get('assets', {
        params: {...params}
    });
}

export const getRates = (params) => {
    return requestCall.get('rates', {
        params: {...params}
    });
}