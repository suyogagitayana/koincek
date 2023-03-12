import React, { useEffect, useState } from 'react'
import { getAssets, getRates } from '../data/axios'
import { round } from 'lodash';
import { Filter, Search } from 'react-feather'

const DEFAULT_RATE = {
    rateUsd: 1,
    symbol: 'USD'
};

const App = () => {
    const [currency, setCurrency] = useState(DEFAULT_RATE);
    const [search, setSearch] = useState('')
    const [assets, setAssets] = useState(null)
    const [rates, setRates] = useState(null)
    const [openFilters, setOpenFilters] = useState(false)
    const [filters, setFilters] = useState({
        changes: true,
        marketCap: true,
        supplyPercent: true,
        supplyNormal: false,
        volumes: false,
    });

    useEffect(() => {
        getAssets()
            .then(result => {
                if (result?.status === 200) {
                    setAssets(result?.data);
                }
            })
            .catch(e => console.error(e));

        getRates()
            .then(result => {
                if (result?.status === 200) {
                    setRates(result?.data);
                }
            })
            .catch(e => console.error(e));
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
    }

    const sortRank = () => {
        const data = assets?.data;

        setAssets({
            ...assets,
            data: data.reverse()
        });
    }

    const formatSupply = (supply, max = null, percent = false) => {
        if (!percent) {
            return `${round(supply)}/${max ? round(max) : '∞' }`
        }

        if (!max) return '∞';

        const total = round((supply/max)*100, 2);

        return isFinite(total) ? `${total}%` : '100%';
    }

    const formatChanges = (val) => {
        const percent = round(val, 2);

        return <span className={`${percent > 0 ? 'green' : 'red'}`}><strong>{`${percent}%`}</strong></span>;
    }

    const onFiltering = (key) => {
        return (e) => setFilters({...filters, [key]: e.target.checked})
    }

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
                })
            }

            return null;
        })
    }

    const updateAssets = () => {
        getAssets({
            search
        })
            .then(result => {
                if (result?.status === 200) {
                    setAssets(result?.data);
                }
            })
            .catch(e => console.error(e));
    }

    return (
        <div className='content'>
            <h1 className='title'>Koin Cek</h1>
            <div className='notice'>This project is just for fun. I didn't guarantee the accuracy of any information here. All data is provided by <a href='https://docs.coincap.io/'>CoinCap API 2.0</a></div>
            <div className='toolbar'>
                <input className='search-input' type='text' value={search} onChange={e => setSearch(e.target.value)}/>
                <div className='search-button' onClick={updateAssets}><Search size={14}/></div>
                <div className='filter-button' onClick={() => setOpenFilters(!openFilters)}><Filter size={14}/></div>
            </div>
            {openFilters && <div className='filters'>
                <div className='switch-button'>
                    <h5>Select Currency</h5>
                    <select name="rates" id="rates" value={currency?.symbol} onChange={onChangeRate}>
                        <option key={'default'} value={'USD'}>{'USD'}</option>;
                        {rates && rates?.data && rates.data.map((rate) => {
                            return rate?.type === 'fiat' && <option key={rate?.id} value={rate?.symbol}>{rate?.symbol}</option>;
                        })}
                    </select>
                </div>
                <div className='switch-button'>
                    <h5>Changes in 24 Hours</h5>
                    <label className="switch">
                        <input type="checkbox" checked={filters?.changes} onChange={onFiltering('changes')}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className='switch-button'>
                    <h5>Market Cap</h5>
                    <label className="switch">
                        <input type="checkbox" checked={filters?.marketCap} onChange={onFiltering('marketCap')}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className='switch-button'>
                    <h5>Supply Number in Percent</h5>
                    <label className="switch">
                        <input type="checkbox" checked={filters?.supplyPercent} onChange={onFiltering('supplyPercent')}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className='switch-button'>
                    <h5>Supply Number</h5>
                    <label className="switch">
                        <input type="checkbox" checked={filters?.supplyNormal} onChange={onFiltering('supplyNormal')}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className='switch-button'>
                    <h5>Volume Traded in 24 Hours</h5>
                    <label className="switch">
                        <input type="checkbox" checked={filters?.volumes} onChange={onFiltering('volumes')}/>
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>}
            <div className='table-wrapper'>
                <table className='styled-table'>
                    <thead>
                        <tr>
                            <th className='rank' onClick={sortRank}>Rank</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Price</th>
                            {filters?.changes && <th>Changes in 24H</th>}
                            {filters?.marketCap && <th>Market Cap</th>}
                            {filters?.supplyNormal && <th>Circulating Supply</th>}
                            {filters?.supplyPercent && <th>Circulating Supply %</th>}
                            {filters?.volumes && <th>Volumes Traded in 24H</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {assets && assets?.data && assets.data.map((asset, key) => {
                            return <tr key={key}>
                                <td className='rank'><strong>{`#${asset.rank}`}</strong></td>
                                <td><a href={asset.explorer}>{asset.name}</a></td>
                                <td>{asset.symbol}</td>
                                <td>{formatPrice(asset.priceUsd)}</td>
                                {filters?.changes && <td>{formatChanges(asset.changePercent24Hr)}</td>}
                                {filters?.marketCap && <td>{formatPrice(asset.marketCapUsd)}</td>}
                                {filters?.supplyNormal && <td>{formatSupply(asset.supply, asset.maxSupply)}</td>}
                                {filters?.supplyPercent && <td>{formatSupply(asset.supply, asset.maxSupply, true)}</td>}
                                {filters?.volumes && <td>{formatPrice(asset.volumeUsd24Hr)}</td>}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default App
