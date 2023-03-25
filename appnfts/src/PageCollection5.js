
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SmartContrat from './artifacts/contracts/SmartContrat.sol/SmartContrat.json';
import './App.css';
import dataNft from '../src/JSON/CollectionUniversMetaDonnés.json';


const smartcontratAdress = '0x880ccE857f5429E209Ff6318405045CD574Df250';
const setNftSpecificPrice = async (edition, newPrice, fetchData, setError) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
            const transaction = await contract.setNftSpecificPrice(edition, ethers.utils.parseEther(newPrice));
            await transaction.wait();
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    }
};

const setCost = async (newCost, fetchData, setError) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
            const overrides = {
                from: accounts[0],
                gasLimit: 2900000,
            };
            const transaction = await contract.setCost(ethers.utils.parseEther(newCost), overrides);
            await transaction.wait();
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    }
};

const NFTCard = ({ nft, mintFunction, setPriceFunction, fetchData, setError }) => {

    return (
        <div className="nft-card">
            <h2>{nft.name}</h2>
            <img
                className="nftImage"
                src={nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                alt={nft.name}
            />
            <button onClick={() => mintFunction(nft.edition)}>
                Mint NFT {nft.edition}
            </button>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setNftSpecificPrice(nft.edition, e.target.newPrice.value, fetchData, setError);
                }}
            >
                <input
                    type="number"
                    step="0.01"
                    name="newPrice"
                    placeholder="New specific price"
                    required
                />
                <button type="submit">Set specific price</button>
            </form>



        </div>
    );
};

const PageCollection5 = () => {
    const [error, setError] = useState('');
    const [data, setData] = useState({});
    const [account, setAccount] = useState([]);
    const [nftData, setNftData] = useState([]);

    useEffect(() => {
        fetchData();
        getAccounts();
        setNftData(dataNft);
    }, []);

    const getAccounts = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                setAccount(accounts);
                console.log(accounts[0]);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const fetchData = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, provider);
            try {
                const cost = await contract.cost();
                const totalSupply = await contract.totalSupply();
                const object = {cost: String(cost), totalSupply: String(totalSupply)};
                setData(object);
            } catch (err) {
                setError(err.message);
            }
        }
    };
    async function mint(edition) {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    smartcontratAdress,
                    SmartContrat.abi,
                    signer
                );

                // Récupérez le prix spécifique de l'édition NFT
                const specificPrice = await contract.nftPrices(edition);
                const priceToUse = specificPrice.gt(0) ? specificPrice : data.cost;

                const overrides = {
                    from: accounts[0],
                    value: priceToUse,
                    gasLimit: 9900000,
                };
                const transaction = await contract.mint(accounts[0], edition, overrides);

                await transaction.wait();
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    }

    async function withdraw() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
                const transaction = await contract.withdraw();
                await transaction.wait();
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    }

    return (

        <div className="App">
            {account[0] === "0x0ca22262c953bf13f89be2e1ff1742f9d227b18c" && (
                <button className="withdraw" onClick={withdraw}>
                    Withdraw
                </button>
            )}
            <div className="container">
                <div className="nft-gallery">
                    {nftData.map((nft) => (
                        <NFTCard key={nft.edition}
                                 nft={nft}
                                 mintFunction={mint}
                                 fetchData={fetchData}
                                 setError={setError}/>
                    ))}
                </div>
                {error && <p>{error}</p>}
                <h1>Mint a Jox NFT</h1>
                <p className="count">
                    {data.totalSupply}/{data.maxSupply}
                </p>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setCost(e.target.cost.value, fetchData, setError);
                }}>
                    <input type="number" step="0.01" name="cost" placeholder="New cost" required />
                    <button type="submit">Set cost</button>
                </form>
                <p className="cost">
                    Jox Collection NFT cost {Number(data.cost) / 10 ** 18} ETH (excluding gas fees)
                </p>
            </div>
        </div>
    );
}
export default PageCollection5;
