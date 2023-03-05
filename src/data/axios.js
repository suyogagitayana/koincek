import axios from 'axios';

const baseURL = 'https://api.coincap.io/v2/';

const requestCall = axios.create({
    baseURL
})

export const getCoinAssets = () => {
    return requestCall.get('assets');
}