import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SmartContrat from './artifacts/contracts/SmartContrat.sol/SmartContrat.json';
import './App.css';
import dataNft from './_metadata.json';

const smartcontratAdress = '0x0374EfB7E10b9528664B2D9584514360c4dAc318';
function SetPriceForm({ nftId, setPriceFunction }) {
  const [price, setPrice] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPriceFunction(nftId, price);
  };

  return (
      <form onSubmit={handleSubmit}>
        <label>
          Set price (in ETH):
          <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <button type="submit">Set Price</button>
      </form>
  );
}

function NFTCard({ nft, mintFunction, setPriceFunction }) {
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
        <SetPriceForm nftId={nft.edition} setPriceFunction={setPriceFunction} />
      </div>
  );
}


function App() {
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [account, setAccount] = useState([]);
  const [nftData, setNftData] = useState([]);

  useEffect(() => {
    fetchData();
    getAccounts();
    setNftData(dataNft);
  }, []);

  async function getAccounts() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        setAccount(accounts);
        console.log(accounts[0]);
      } catch (err) {
        setError(err.message);
      }
    }
  }

  async function fetchData() {
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
  }

  async function mint(edition) {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
        const overrides = {
          from: accounts[0],
          value: ethers.utils.parseEther(String(Number(data.cost) / 10 ** 18)),
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
  async function setNftPrice(nftId, price) {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);

        // Ajoutez cette vérification
        const contractOwner = await contract.owner();
        if (accounts[0].toLowerCase() !== contractOwner.toLowerCase()) {
          throw new Error("Only the contract owner can set the NFT price.");
        }

        const overrides = {
          from: accounts[0],
          gasLimit: 2900000,
        };
        const transaction = await contract.setNftPrice(nftId, ethers.utils.parseEther(price), overrides);
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
                <NFTCard key={nft.edition} nft={nft} mintFunction={mint} setPriceFunction={setNftPrice}/>
            ))}
          </div>
          {error && <p>{error}</p>}
          <h1>Mint a Jox NFT</h1>
          <p className="count">
            {data.totalSupply}/{data.maxSupply}
          </p>
          <p className="cost">
            Jox Collection NFT cost {Number(data.cost) / 10 ** 18} ETH (excluding gas fees)
          </p>
        </div>
      </div>
  );
}
export default App;