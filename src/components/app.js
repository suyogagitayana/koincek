import React, { useEffect, useState } from 'react'
import { getCoinAssets } from '../data/axios'
import { round } from 'lodash';

const App = () => {
    const [assets, setAssets] = useState(null)

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

        if (price > 1) return round(price, 2);

        if (price < 1 && price > 0.0005) return round(price, 4);

        return round(price, 8);
    }

    const sortRank = () => {
        const data = assets?.data;

        setAssets({
            ...assets,
            data: data.reverse()
        });
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th onClick={sortRank}>Rank</th>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Market Cap (USD)</th>
                        <th>Supply</th>
                        <th>Change (24hr)</th>
                    </tr>
                </thead>
                <tbody>
                    {assets && assets?.data && assets.data.map((asset, key) => {
                        return <tr key={key}>
                            <td>{asset.rank}</td>
                            <td><a href={asset.explorer}>{asset.name}</a></td>
                            <td>{asset.symbol}</td>
                            <td>{`$${formatPrice(asset.priceUsd)}`}</td>
                            <td>{round(asset.marketCapUsd)}</td>
                            <td>{`${round(asset.supply)}/${asset.maxSupply ? round(asset.maxSupply) : '~'}`}</td>
                            <td>{`${round(asset.changePercent24Hr, 2)}%`}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default App
