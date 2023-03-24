// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import SmartContrat from './artifacts/contracts/SmartContrat.sol/SmartContrat.json';
// import './App.css';
// import dataNft from './_metadata.json';
//
// const smartcontratAdress = '0x6C0F01619fE0303419cB6158Cc3639418E4DDaF0';
// async function setCost(newCost) {
//   if (typeof window.ethereum !== 'undefined') {
//     try {
//       const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
//       const overrides = {
//         from: accounts[0],
//         gasLimit: 2900000,
//       };
//       const transaction = await contract.setCost(ethers.utils.parseEther(newCost), overrides);
//       await transaction.wait();
//       fetchData();
//     } catch (err) {
//       setError(err.message);
//     }
//   }
// }
//
// function NFTCard({ nft, mintFunction, setPriceFunction }) {
//   return (
//       <div className="nft-card">
//         <h2>{nft.name}</h2>
//         <img
//             className="nftImage"
//             src={nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
//             alt={nft.name}
//         />
//         <button onClick={() => mintFunction(nft.edition)}>
//           Mint NFT {nft.edition}
//         </button>
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           setCost(e.target.cost.value);
//         }}>
//           <input type="number" step="0.01" name="cost" placeholder="New cost" required />
//           <button type="submit">Set cost</button>
//         </form>
//       </div>
//   );
// }
//
//
// function App() {
//   const [error, setError] = useState('');
//   const [data, setData] = useState({});
//   const [account, setAccount] = useState([]);
//   const [nftData, setNftData] = useState([]);
//
//   useEffect(() => {
//     fetchData();
//     getAccounts();
//     setNftData(dataNft);
//   }, []);
//
//   async function getAccounts() {
//     if (typeof window.ethereum !== 'undefined') {
//       try {
//         const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
//         setAccount(accounts);
//         console.log(accounts[0]);
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   }
//
//   async function fetchData() {
//     if (typeof window.ethereum !== 'undefined') {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, provider);
//       try {
//         const cost = await contract.cost();
//         const totalSupply = await contract.totalSupply();
//         const object = {cost: String(cost), totalSupply: String(totalSupply)};
//         setData(object);
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   }
//
//   async function mint(edition) {
//     if (typeof window.ethereum !== 'undefined') {
//       try {
//         const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
//         const overrides = {
//           from: accounts[0],
//           value: ethers.utils.parseEther(String(Number(data.cost) / 10 ** 18)),
//           gasLimit: 9900000,
//         };
//         const transaction = await contract.mint(accounts[0], edition, overrides);
//         await transaction.wait();
//         fetchData();
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   }
//   async function setNftPrice(nftId, price) {
//     if (typeof window.ethereum !== 'undefined') {
//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
//
//         // Ajoutez cette vérification
//         const contractOwner = await contract.owner();
//         if (accounts[0].toLowerCase() !== contractOwner.toLowerCase()) {
//           throw new Error("Only the contract owner can set the NFT price.");
//         }
//
//         const overrides = {
//           from: accounts[0],
//           gasLimit: 2900000,
//         };
//         const transaction = await contract.setNftPrice(nftId, ethers.utils.parseEther(price), overrides);
//         await transaction.wait();
//         fetchData();
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   }
//
//
//   async function withdraw() {
//     if (typeof window.ethereum !== 'undefined') {
//       try {
//         const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(smartcontratAdress, SmartContrat.abi, signer);
//         const transaction = await contract.withdraw();
//         await transaction.wait();
//         fetchData();
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   }
//
//
//   return (
//       <div className="App">
//         {account[0] === "0x0ca22262c953bf13f89be2e1ff1742f9d227b18c" && (
//             <button className="withdraw" onClick={withdraw}>
//               Withdraw
//             </button>
//         )}
//         <div className="container">
//           <div className="nft-gallery">
//             {nftData.map((nft) => (
//                 <NFTCard key={nft.edition} nft={nft} mintFunction={mint} setPriceFunction={setNftPrice}/>
//
//             ))}
//           </div>
//           {error && <p>{error}</p>}
//           <h1>Mint a Jox NFT</h1>
//           <p className="count">
//             {data.totalSupply}/{data.maxSupply}
//           </p>
//           <p className="cost">
//             Jox Collection NFT cost {Number(data.cost) / 10 ** 18} ETH (excluding gas fees)
//           </p>
//         </div>
//       </div>
//   );
// }
// export default App;

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SmartContrat from './artifacts/contracts/SmartContrat.sol/SmartContrat.json';
import './App.css';
import dataNft from './_metadata.json';

const smartcontratAdress = '0x0b701613d9E84124682b7d719F01e5B31E786f21';
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

const App = () => {
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


  // async function mint(edition) {
  //   if (typeof window.ethereum !== "undefined") {
  //     try {
  //       const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const contract = new ethers.Contract(
  //           smartcontratAdress,
  //           SmartContrat.abi,
  //           signer
  //       );
  //
  //       const overrides = {
  //         from: accounts[0],
  //         value: ethers.utils.parseEther(
  //             String(Number(data.cost) / 10 ** 18)
  //         ),
  //         gasLimit: 9900000,
  //       };
  //       const transaction = await contract.mint(accounts[0], edition, overrides);
  //
  //       await transaction.wait();
  //       fetchData();
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   }
  // }


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
export default App;
