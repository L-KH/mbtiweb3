
import { NFTStorage, File } from 'nft.storage';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MBTICardABI from "../abis/MBTICard.json";
import { wagmiClient } from './Layout/Web3Wrapper';
import config from './config.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CameraIcon } from '@heroicons/react/outline';  // For heroicons
import { CircularProgress } from '@mui/material';
import TwitterLogin from 'react-twitter-login';





function ProfileCard() {
  const [provider, setProvider] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(null);
  const endpoint = "https://api.scorer.gitcoin.co";
    const SCORER_ID = "4939";
    const API_KEY = "ixWOGoSs.Li6dUUSG0Cilq4uGSt4tF1pxLedCigvu";
    const [scoreStatus, setScoreStatus] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [isLoadingScore, setIsLoadingScore] = useState(false); // State to determine if score is being loaded
  //const [coverImage, setCoverImage] = useState('/default_cover.jpg');
  const [coverImage, setCoverImage] = useState(null);

  const [profileImage, setProfileImage] = useState(null);

  const [twitterHandle, setTwitterHandle] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [quote, setQuote] = useState('');
  const [MBTICard, setMBTICard] = useState(null)

  const [isFormValid, setIsFormValid] = useState(false);  // Add this state

  const personalities = ["Select MBTI type (*)", "INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
  const [name, setName] = useState('');
  // -------------------------
  const isValidTwitterUrl = (url) => {
    return /^https?:\/\/twitter\.com\/([a-zA-Z0-9_]+)$/.test(url);
  }
  const validateForm = () => {
    if (
      name.trim() !== "" &&
      twitterHandle.trim() !== "" &&  // Just check if it's not empty
      telegramHandle.trim() !== "" &&
      selectedPersonality !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };
  

  useEffect(() => {
    validateForm();
  }, [name, twitterHandle, telegramHandle, selectedPersonality]);
  //-------------------------------
  const handleScoringWithoutSignature = async () => {
    setIsLoadingScore(true); // Set loading to true

    if (!provider) {
        toast.error('Please connect your wallet first.');
        return;
    }

    const accounts = await provider.listAccounts();
    const address = accounts[0];

    try {
        const response = await fetch(
            `${endpoint}/registry/submit-passport`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-API-Key": API_KEY,
                },
                body: JSON.stringify({
                    address: address,
                    community: SCORER_ID,
                }),
            }
        );

        const data = await response.json();

        if (data && data.status === "DONE") {
            setScoreStatus(`Your score is: ${data.score}`);
        } else {
            setScoreStatus(data.error || 'Error fetching score');
        }
    } catch (error) {
        toast.error('An error occurred while checking the score.');
    }
    setIsLoadingScore(false); // Set loading to false at the end

};
const determineProgressBarColor = (percentage) => {
  if (percentage <= 25) return 'red';
  if (percentage <= 50) return 'orange';
  if (percentage <= 75) return 'yellowgreen';
  return 'green';
}
const percentage = Math.min((score / 60) * 100, 100); // Ensuring it doesn't exceed 100%
const progressBarFillColor = determineProgressBarColor(percentage);

const progressBarFillDynamicStyles = {
  width: `${percentage}%`,
  backgroundColor: progressBarFillColor,
}

  // --------------------------- Blockchain

  const [client, setClient] = useState(null);
  useEffect(() => {
    setClient(new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFjYTU2MTcxQUI5MkRmOGMzNjM0MzRlODcyOUJkZWNDNzhGOEMwRTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MjExNjY5NTg5NSwibmFtZSI6Im5mdCJ9.roO9LrntQk8MkfN0CVZE1lw99t4mjb6MCGPkAw7TCt0' }));
  }, []);
  useEffect(() => {
    if(score !== null) {
        setScoreStatus(`Your score is: ${score}`);
    }
  }, [score]);
  const handleAccountChange = (newChain) => {
    // Perform actions when the account changes
    loadBlockchainData()
  }
  const allowedChains = [534353, 57000, 5, 10, 59140, 167005, 59140, 59144 ]; // Add more chain IDs as needed

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const network = await provider.getNetwork();

      if (!allowedChains.includes(network.chainId)) {
        const optimismChainId = '0xe704';
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: optimismChainId }],
          });
        } catch (switchError) {
          console.error(switchError);
          toast.error('Please connect to the network manually');
          return; // If the switch to Goerli failed, don't try to load the NFT contract
        }
      }
      // Check the network again after attempting to switch
      const switchedNetwork = await provider.getNetwork();
      const nft = new ethers.Contract(config[switchedNetwork.chainId].nft.address, MBTICardABI, provider);
      setMBTICard(nft);
    } catch (error) {
      console.error(error);
      toast.error('Please connect to the network manually');
    }
  };


  async function handleSubmit(event) {

    event.preventDefault();
    if (!isValidTwitterUrl(twitterHandle)) {
      toast.error('Please enter a valid Twitter profile URL.');
      return;
    }
    if (!isFormValid) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      let coverImageBlob = await fetch(coverImage).then(r => r.blob());
      let profileImageBlob = await fetch(profileImage).then(r => r.blob());
      // Convert coverImage to IPFS URI
      //let coverImageBlob = await fetch(coverImage).then(r => r.blob());
      let coverImageCID = await client.storeBlob(coverImageBlob);
      let coverImageURI = `https://ipfs.io/ipfs/${coverImageCID}`;

      // Convert profileImage to IPFS URI
      //let profileImageBlob = await fetch(profileImage).then(r => r.blob());
      let profileImageCID = await client.storeBlob(profileImageBlob);
      let profileImageURI = `https://ipfs.io/ipfs/${profileImageCID}`;
      // Add this line


      let metadata = {
        "name": name,
        "description": "This is a short description of the NFT",
        "image": profileImageURI,
        "cover_image": coverImageURI,  // add this line
        "attributes": [
          {
            "trait_type": "MBTI Type",
            "value": selectedPersonality
          },
          {
            "trait_type": "Twitter",
            "value": twitterHandle
          },
          {
            "trait_type": "Telegram",
            "value": telegramHandle
          },
          {
            "trait_type": "Quote",
            "value": quote
          }
        ]

      };
      // Convert metadata to a Blob and then store it on IPFS
      let metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      let metadataCID = await client.storeBlob(metadataBlob);
      let metadataURI = `https://ipfs.io/ipfs/${metadataCID}`;

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      let tx = await MBTICard.connect(signer).mintCard(name, profileImageURI, coverImageURI, selectedPersonality, twitterHandle, telegramHandle, quote, metadataURI);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during the minting process. You cannot mint twice');
    }
    setIsLoading(false);

  }
  const authHandler = (err, data) => {
    if (!err) {
      setTwitterHandle(data.screen_name);
    } else {
      console.error(err);
      toast.error('Twitter authentication failed.');
    }
  };




  const onCoverImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setCoverImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onImageChange = (setImage) => (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onloadend = (e) => {
        setImage(reader.result);
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const cardColor = {
    'INTJ': 'bg-intj',
    'INTP': 'bg-intp',
    'ENTJ': 'bg-entj',
    'ENTP': 'bg-entp',
    'INFJ': 'bg-infj',
    'INFP': 'bg-infp',
    'ENFJ': 'bg-enfj',
    'ENFP': 'bg-enfp',
    'ISTJ': 'bg-istj',
    'ISTP': 'bg-istp',
    'ESTJ': 'bg-estj',
    'ESTP': 'bg-estp',
    'ISFJ': 'bg-isfj',
    'ISFP': 'bg-isfp',
    'ESFJ': 'bg-esfj',
    'ESFP': 'bg-esfp',
    // Add remaining colors for all personalities
  }[selectedPersonality] || 'bg-purple-100';
  useEffect(() => {
    loadBlockchainData()
  }, [])
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center items-center h-screen">
        <div className={`card max-w-lg w-full border border-gray-100 ${cardColor} transition-shadow shadow-xl hover:shadow-xl`}>
          <div className="relative h-48 ">
            <input
              type='file'
              accept='.jpg,.png,.gif'
              onChange={onImageChange(setCoverImage)}
              className="opacity-0 w-full h-full absolute inset-0 z-50 cursor-pointer "
            />
            {!coverImage &&
              <div className="absolute inset-0 flex items-center justify-center z-20 text-sm text-white bg-black bg-opacity-40">
                <div className="flex items-center space-x-2">
                  <CameraIcon className="h-6 w-6" />  {/* For heroicons */}
                  <p>Click to choose cover image</p>
                </div>
              </div>
            }
            {coverImage ?
              <div className="h-full w-full object-cover " style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
              :
              <img src="/default_cover.jpg" className="w-full h-full object-cover " alt="Cover" />
            }
          </div>

          <div className="p-4">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <input
                type='file'
                accept='.jpg,.png,.gif'
                onChange={onImageChange(setProfileImage)}
                className="opacity-0 w-full h-full absolute inset-0 z-50 cursor-pointer"
              />
              {!profileImage &&
                <div className="absolute inset-0 flex items-center justify-center z-20 text-sm text-white bg-black bg-opacity-20 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <CameraIcon className="h-6 w-6" />  {/* For heroicons */}
                  </div>
                </div>
              }
              {profileImage ?
                <div className="h-full w-full object-cover  rounded-full shadow-lg" style={{ backgroundImage: `url(${profileImage})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
                :
                <img src="/default_profile.jpg" className="w-full h-full object-cover rounded-full shadow-lg" alt="Profile" />
              }
            </div>
            <div className="mt-4 text-center">
            <h4>Get Your Gitcoin Passport Score</h4>
            <button 
                type="button" 
                className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition-colors duration-300"
                onClick={handleScoringWithoutSignature}
                disabled={isLoadingScore} // Disable the button while loading
            >
                { isLoadingScore ? 'Loading...' : 'Check Score' }
            </button>

            { isLoadingScore ? <CircularProgress className="mt-4" /> : <div className="mt-4 text-2xl font-bold">{scoreStatus}</div> }
        </div>
        {score !== null && (
          <>
            <div className="progressBar mt-4">
              <div className="progressBarFill" style={{...progressBarFillDynamicStyles}}>
                {score}
              </div>
            </div>
          </>
        )}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter your name (*)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input block w-full text-center"
                required  // This field is required
              />
            </div>
            <div className="text-center">

              <div className="mt-4">
                <select value={selectedPersonality} onChange={(e) => setSelectedPersonality(e.target.value)} className="form-select block w-full mt-1">
                  {personalities.map(personality => <option key={personality} value={personality}>{personality}</option>)}
                </select>


              </div>

              <div className="mt-4">

                <input
                  type="text"
                  placeholder="Telegram Handle (*)"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  className="form-input block w-full mt-2"
                  required  // This field is required
                />
                <textarea placeholder="Your Quote" value={quote} onChange={(e) => setQuote(e.target.value)} className="form-textarea block w-full mt-2" />
              </div>

              <div className="mt-4">
                {!isFormValid && (
                  <p className="text-red-500">Please fill in all required fields before you can mint the card.</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 mt-10 bg-indigo-600 text-white rounded-md focus:outline-none"
                  disabled={!isFormValid || isLoading} // Disable button when loading
                >
                  {isLoading ? 'Loading...' : 'Mint Card'}
                </button>
              </div>

            </div>

          </div>
        </div></div>
      <ToastContainer />
    </form>
  );
}

export default ProfileCard;