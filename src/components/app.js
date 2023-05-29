import React, { useEffect, useState } from 'react';
import { fetchAssets, fetchRates } from '../data/axios';
import { round } from 'lodash';
import { Filter } from 'react-feather';
import SearchBar from './search-bar';

const DEFAULT_RATE = {
    rateUsd: 1,
    symbol: 'USD'
};

const App = () => {
    const [currency, setCurrency] = useState(DEFAULT_RATE);
    const [assets, setAssets] = useState(null);
    const [rates, setRates] = useState(null);
    const [openFilters, setOpenFilters] = useState(false);
    const [filters, setFilters] = useState({
        changes: true,
        marketCap: true,
        supplyPercent: true,
        supplyNormal: false,
        volumes: false,
    });

    useEffect(() => {
        getAssets();
        getRates();
    }, []);

    const formatPrice = (val) => {
        const price = parseFloat(val) * (1/currency?.rateUsd);
        let value = round(price, 8);

        if (price > 1) {
            value = round(price, 2);
        } else if (price < 1 && price > 0.0005) {
            value = round(price, 4);
        }

        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: currency?.symbol,
            maximumSignificantDigits: 8
        });
    };

    const sortRank = () => {
        const data = assets?.data;

        setAssets({
            ...assets,
            data: data.reverse()
        });
    };

    const formatSupply = (supply, max = null, percent = false) => {
        if (!percent) return `${round(supply)}/${max ? round(max) : '∞' }`;

        if (!max) return '∞';

        const total = round((supply/max)*100, 2);

        return isFinite(total) ? `${total}%` : '100%';
    };

    const formatChanges = (val) => {
        const percent = round(val, 2);

        return <span className={`${percent > 0 ? 'cl-green' : 'cl-red'}`}><strong>{`${percent > 0 ? `+${percent}` : percent}%`}</strong></span>;
    };

    const onFiltering = (key) => {
        return (e) => setFilters({...filters, [key]: e.target.checked});
    };

    const onChangeRate = (e) => {
        const selected = e.target.value;

        if (selected === 'default') {
            return setCurrency(DEFAULT_RATE);
        }

        rates && rates?.data && rates.data.map((rate) => {
            const {rateUsd, symbol, type} = rate;

            if (selected === symbol && type === 'fiat') {
                setCurrency({
                    rateUsd,
                    symbol
                });
            }

            return null;
        });
    };

    const getRates = (params = {}) => fetchRates({...params}, setRates);

    const getAssets = (params = {}) => fetchAssets({...params}, setAssets);

    return (
        <>
            <div className='text-center text-xs p-2 bg-yellow cl-yellow sticky inset-x-0 top-0 left-0'>This project is just for fun. I didnt guarantee the accuracy of any information here. All data is provided by <a className='cl-blue' href='https://docs.coincap.io/' target='_blank' rel='noreferrer'>CoinCap API 2.0</a></div>
            <header className='flex justify-between sticky inset-x-0 top-8 left-0 bg-white mx-auto my-0 border-solid border-b-1 border-gray-200 px-4 py-4 md:px-8'>
                <h3 className='text-2xl font-bold cursor-pointer text-gray-800 hidden md:block'>
                    <a href='/'>KOIN<span className='text-xl cl-blue font-normal'>cek</span></a>
                </h3>
                <div className='flex items-center w-full md:w-2/3 lg:w-1/3'>
                    <SearchBar onSearch={getAssets}/>
                    <div className='flex justify-center items-center p-2 cl-blue cursor-pointer mx-3' onClick={() => setOpenFilters(!openFilters)}><Filter size={16}/></div>
                    <select className='cursor-pointer border-solid border-1 border-gray-200' name='rates' id='rates' value={currency?.symbol} onChange={onChangeRate}>
                        <option key={'default'} value={'USD'}>{'USD'}</option>;
                        {rates && rates?.data && rates.data.map((rate) => {
                            return rate?.type === 'fiat' && <option key={rate?.id} value={rate?.symbol}>{rate?.symbol}</option>;
                        })}
                    </select>
                </div>
            </header>
            <div className=' text-gray-800'>

                {openFilters && <div className='filters bg-white sticky inset-x-0 top-24 right-0 pb-4'>
                    <div className='flex items-center justify-between h-10 pt-8 pb-4 px-8 border-solid border-t-2 border-gray-100 '>
                        <h5 className='text-sm'>Changes in 24 Hours</h5>
                        <label className='switch'>
                            <input type='checkbox' checked={filters?.changes} onChange={onFiltering('changes')}/>
                            <span className='slider round'></span>
                        </label>
                    </div>
                    <div className='flex items-center justify-between h-10 py-4 px-8'>
                        <h5 className='text-sm'>Market Cap</h5>
                        <label className='switch'>
                            <input type='checkbox' checked={filters?.marketCap} onChange={onFiltering('marketCap')}/>
                            <span className='slider round'></span>
                        </label>
                    </div>
                    <div className='flex items-center justify-between h-10 py-4 px-8'>
                        <h5 className='text-sm'>Supply Number in Percent</h5>
                        <label className='switch'>
                            <input type='checkbox' checked={filters?.supplyPercent} onChange={onFiltering('supplyPercent')}/>
                            <span className='slider round'></span>
                        </label>
                    </div>
                    <div className='flex items-center justify-between h-10 py-4 px-8'>
                        <h5 className='text-sm'>Supply Number</h5>
                        <label className='switch'>
                            <input type='checkbox' checked={filters?.supplyNormal} onChange={onFiltering('supplyNormal')}/>
                            <span className='slider round'></span>
                        </label>
                    </div>
                    <div className='flex items-center justify-between h-10 py-4 px-8'>
                        <h5 className='text-sm'>Volume Traded in 24 Hours</h5>
                        <label className='switch'>
                            <input type='checkbox' checked={filters?.volumes} onChange={onFiltering('volumes')}/>
                            <span className='slider round'></span>
                        </label>
                    </div>
                </div>}

                <div className='mx-auto my-0 p-4 max-w-6xl'>
                    <h1 className='text-2xl font-semibold my-4'>Current Cryptocurrency Price</h1>
                    <p className='text-sm mt-0 mb-8'>The following is a comprehensive list of cryptocurrency prices sourced from CoinCap, an API that offers real-time data on various cryptocurrencies.</p>
                </div>

                <div className='table-wrapper mx-auto my-0 p-4 max-w-6xl overflow-x-scroll'>

                    <table className='styled-table w-full'>
                        <thead>
                            <tr className='border-solid border-gray-200 border-y-1 text-left'>
                                <th className='cursor-pointer underline px-2 py-4 text-sm' onClick={sortRank}>Rank</th>
                                <th className='px-2 py-4 text-sm'>Name</th>
                                <th className='px-2 py-4 text-sm'>Symbol</th>
                                <th className='pl-2 pr-6 py-4 text-sm text-right'>Price</th>
                                {filters?.changes && <th className='pl-2 pr-6 py-4 text-sm text-right'>Changes 24H</th>}
                                {filters?.marketCap && <th className='pl-2 pr-6 py-4 text-sm text-right'>Market Cap</th>}
                                {filters?.supplyNormal && <th className='px-2 py-4 text-sm'>Total Supply</th>}
                                {filters?.supplyPercent && <th className='px-2 py-4 text-sm'>Total Supply %</th>}
                                {filters?.volumes && <th className='pl-2 pr-6 py-4 text-sm text-right'>Volumes Traded 24H</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {assets && assets?.data && assets.data.map((asset, key) => {
                                return <tr key={key} className='border-solid border-gray-200 border-b-1 text-left'>
                                    <td className='px-2 py-4 text-sm text-black'><strong>{`#${asset.rank}`}</strong></td>
                                    <td className='px-2 py-4 text-sm underline cl-blue'><a href={asset.explorer}>{asset.name}</a></td>
                                    <td className='px-2 py-4 text-sm'>{asset.symbol}</td>
                                    <td className='pl-2 pr-6 py-4 text-sm text-right'>{formatPrice(asset.priceUsd)}</td>
                                    {filters?.changes && <td className='pl-2 pr-6 py-4 text-sm text-right'>{formatChanges(asset.changePercent24Hr)}</td>}
                                    {filters?.marketCap && <td className='pl-2 pr-6 py-4 text-sm text-right'>{formatPrice(asset.marketCapUsd)}</td>}
                                    {filters?.supplyNormal && <td className='px-2 py-4 text-sm'>{formatSupply(asset.supply, asset.maxSupply)}</td>}
                                    {filters?.supplyPercent && <td className='px-2 py-4 text-sm flex gap-4 items-center'>
                                        <div className='bg-gray-300 w-2/3 h-1 rounded-2xl'>
                                            {'∞' !== formatSupply(asset.supply, asset.maxSupply, true) && <div className='bg-blue h-1 rounded-2xl' style={{width: `${formatSupply(asset.supply, asset.maxSupply, true)}`}}></div>}
                                        </div>
                                        <p className='w-1/3'>{formatSupply(asset.supply, asset.maxSupply, true)}</p>
                                    </td>}
                                    {filters?.volumes && <td className='pl-2 pr-6 py-4 text-sm text-right'>{formatPrice(asset.volumeUsd24Hr)}</td>}
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default App;
