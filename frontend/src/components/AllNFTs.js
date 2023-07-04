import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MBTICardABI from "../abis/MBTICard.json";
import config from './config.json';
import { cardColor } from './colorMapping.js';

const AllNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const MBTITypes = ["INTP", "INTJ", "INFJ", "INFP", "ISTJ", "ISFJ", "ISTP", "ISFP", "ENFP", "ENTJ", "ENFJ", "ENTP", "ESFJ", "ESTJ", "ESFP", "ESTP"];
  const [selectedMbtiTypes, setSelectedMbtiTypes] = useState(['ALL']);

  const handleCheckChange = (event) => {
    if (event.target.checked) {
      setSelectedMbtiTypes([...selectedMbtiTypes, event.target.name]);
    } else {
      setSelectedMbtiTypes(selectedMbtiTypes.filter(type => type !== event.target.name));
    }
  };
  const handleClick = (mbti) => {
    if (mbti === 'ALL') {
      setSelectedMbtiTypes(['ALL']);
    } else {
      if (selectedMbtiTypes.includes('ALL')) {
        setSelectedMbtiTypes([mbti]);
      } else if (selectedMbtiTypes.includes(mbti)) {
        setSelectedMbtiTypes(selectedMbtiTypes.filter(type => type !== mbti));
      } else {
        setSelectedMbtiTypes([...selectedMbtiTypes, mbti]);
      }
    }
  }
  const loadNfts = async (provider) => {
    try {
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(config[network.chainId].nft.address, MBTICardABI, provider);
      const totalSupply = (await contract.tokenCounter()).toNumber();
      console.log('Total supply:', totalSupply);  // Check the total supply
  
      const nftsData = await Promise.all(
        Array.from({ length: totalSupply }, async (_, i) => {
          const tokenId = i;
          try {
            const tokenUri = await contract.tokenURI(tokenId);
            console.log('Token URI:', tokenUri);  // Check the token URI
  
            const response = await fetch(tokenUri);
            if (response.ok) {
              const tokenMetaData = await response.json();
              console.log('Token metadata:', tokenMetaData);  // Check the token metadata
  
              return {
                tokenId,
                ...tokenMetaData
              };
            } else {
              console.log(`HTTP error for tokenId ${tokenId}, status: ${response.status}`);
              return {};  // resolve to an empty object in case of HTTP error
            }
          } catch (err) {
            console.log(`Failed to fetch or parse metadata for tokenId ${tokenId}:`, err);
            return {};  // resolve to an empty object in case of error
          }
        })
      );
  
      setNfts(nftsData);
    } catch (error) {
      console.error(error);
    }
  };
  

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
  //     setProvider(providerInstance);
  //   }
  // }, []);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(providerInstance);
    } else {
      const providerInstance = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/785f7bb2ad57482d9e033f63e08d24a3');
      setProvider(providerInstance);
    }
  }, []);
  
  // useEffect(() => {
  //   if (provider) {
  //     loadNfts();
  //     if (ethers.utils.isAddress(provider.selectedAddress)) {
  //       setErrorMessage(null);  // Clear the error message when the wallet is connected
  //     }
  //   }
  // }, [provider]);
  useEffect(() => {
    if (provider) {
      loadNfts(provider);
    }
  }, [provider]);



  return (

    <div className="flex flex-wrap justify-around gap-0.5">
      <div>
        {['ALL', ...MBTITypes].map(mbti => (
          <button
            key={mbti}
            onClick={() => handleClick(mbti)}
            className={`px-4 py-2 mb-7 text-white  ${mbti === 'ALL' ? 'rainbow-background' : cardColor[mbti]} ${selectedMbtiTypes.includes(mbti) ? 'opacity-100' : 'opacity-50'}`}          >
            {mbti}
          </button>
        ))}
      </div>
      {nfts.filter(nft => nft && nft.image && (selectedMbtiTypes.includes('ALL') || selectedMbtiTypes.includes(nft.attributes.find(attr => attr.trait_type === "MBTI Type")?.value))).map((nft, i) => {
        const personalityAttr = nft.attributes.find(attr => attr.trait_type === "MBTI Type");
        const color = personalityAttr ? cardColor[personalityAttr.value] : 'bg-purple-100';
        const textColor = personalityAttr && (personalityAttr.value === 'INTP') || (personalityAttr.value === 'INFJ') || ((personalityAttr.value === 'ENTJ')) ? 'text-white' : 'text-black';
        return (
          <div key={i} className={`m-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4`}> {/* Adjust the fractions in `w-...` and `m-...` to suit your needs */}
            <div className={`card max-w-lg w-full border border-gray-100 ${color} ${textColor} transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-glow`}>
              <div className="relative h-48 -mt-16">
                <img src={nft.cover_image || "https://image.freepik.com/free-vector/abstract-binary-code-techno-background_1048-12836.jpg"} className="w-full h-full object-cover" alt={nft.name} />
              </div>
              <div className="p-4">
                <div className="relative w-24 h-24 mx-auto mb-4 -mt-16">
                  <img src={nft.image || "https://avatars3.githubusercontent.com/u/11801238?v=4"} className="h-full w-full rounded-full mx-auto shadow-xl" alt={nft.name} />
                </div>
                <div className="p-4 h-40 overflow-y-auto text-lg"> {/* Adjust this h-40 to the fixed height that suits your design */}
                  <p><b>Name:  </b> <span className="text-sm">{nft.name}</span></p>
                  {nft.attributes.map((attr, j) => {
                    if (attr.trait_type.toLowerCase() === "twitter" && attr.value) {
                      return (
                        <p key={j} className="text-left overflow-ellipsis overflow-hidden">
                          <b>{attr.trait_type}: </b>
                          <a href={`https://twitter.com/${attr.value}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">{attr.value}</a>
                        </p>
                      )
                    } else {
                      return (
                        <p key={j} className="text-left overflow-ellipsis overflow-hidden ">
                          <b>{attr.trait_type}: </b><span className="text-sm">{attr.value}</span>
                        </p>
                      )
                    }
                  })}
                </div>

              </div>
            </div>
          </div>
        );
      })}


      {errorMessage &&
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-error-content bg-opacity-50"
        >
          <div
            className="bg-white p-4 rounded-lg max-w-sm flex flex-col items-center justify-center" // Add flex properties here
          >
            <p className='text-error'>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-2 px-4 py-1 bg-red-500 self-center rounded"
            >
              Close
            </button>
          </div>
        </div>
      }


    </div>




  );

};

export default AllNFTs;
