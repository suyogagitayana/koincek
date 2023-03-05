import React, { useEffect, useState } from 'react'
import { getCoinAssets } from '../data/axios'
import { round } from 'lodash';

const App = () => {
    const [assets, setAssets] = useState(null)
    const [openFilters, setOpenFilters] = useState(false)
    const [filters, setFilters] = useState({
        changes: true,
        marketCap: true,
        supplyPercent: true,
        supplyNormal: false,
        volumes: false,
    });

    useEffect(() => {
        getCoinAssets()
            .then(result => {
                if (result?.status === 200) {
                    setAssets(result?.data);
                }
            })
            .catch(e => console.error(e));
    }, []);

    const formatPrice = (val) => {
        const price = parseFloat(val);
        let value = round(price, 8);

        if (price > 1) {
            value = round(price, 2);
        } else if (price < 1 && price > 0.0005) {
            value = round(price, 4);
        }

        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
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

    console.log(filters)

    const onFiltering = (key) => {
        return (e) => setFilters({...filters, [key]: e.target.checked})
    }

    return (
        <div className='content'>
            <h1>Koin Cek</h1>
            <div className='notice'>This project is just for fun. I didn't guarantee the accuracy of any information here. All data is provided by <a href='https://docs.coincap.io/'>CoinCap API 2.0</a></div>
            <button className='filter-button' onClick={() => setOpenFilters(!openFilters)}>Filters</button>
            {openFilters && <div className='filters'>
                <h5>Changes in 24 Hours</h5>
                <label className="switch">
                    <input type="checkbox" checked={filters?.changes} onChange={onFiltering('changes')}/>
                    <span className="slider round"></span>
                </label>
                <h5>Market Cap</h5>
                <label className="switch">
                    <input type="checkbox" checked={filters?.marketCap} onChange={onFiltering('marketCap')}/>
                    <span className="slider round"></span>
                </label>
                <h5>Supply Number in Percent</h5>
                <label className="switch">
                    <input type="checkbox" checked={filters?.supplyPercent} onChange={onFiltering('supplyPercent')}/>
                    <span className="slider round"></span>
                </label>
                <h5>Supply Number</h5>
                <label className="switch">
                    <input type="checkbox" checked={filters?.supplyNormal} onChange={onFiltering('supplyNormal')}/>
                    <span className="slider round"></span>
                </label>
                <h5>Volume Traded in 24 Hours</h5>
                <label className="switch">
                    <input type="checkbox" checked={filters?.volumes} onChange={onFiltering('volumes')}/>
                    <span className="slider round"></span>
                </label>
            </div>}
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
    )
}

export default App
