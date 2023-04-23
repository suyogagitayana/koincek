import axios from 'axios';

const baseURL = 'https://api.coincap.io/v2/';

const apiCall = axios.create({
    baseURL
});

export const fetchAssets = (params, callback = () => {}) => {
    apiCall.get('assets', {
        params: {...params}
    }).then(result => {
        if (result?.status === 200) {
            callback(result?.data);
        }
    }).catch(() => {});
};

export const fetchRates = (params, callback = () => {}) => {
    apiCall.get('rates', {
        params: {...params}
    }).then(result => {
        if (result?.status === 200) {
            callback(result?.data);
        }
    }).catch(() => {});
};