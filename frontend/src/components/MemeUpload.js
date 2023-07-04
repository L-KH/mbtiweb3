import React, { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MemeUpload() {
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [memeImage, setMemeImage] = useState(null);
  const [client, setClient] = useState(null);
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    setClient(new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFjYTU2MTcxQUI5MkRmOGMzNjM0MzRlODcyOUJkZWNDNzhGOEMwRTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MjExNjY5NTg5NSwibmFtZSI6Im5mdCJ9.roO9LrntQk8MkfN0CVZE1lw99t4mjb6MCGPkAw7TCt0' }));
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  async function handleMemeSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      let memeImageBlob = await fetch(memeImage).then(r => r.blob());
      let memeImageCID = await client.storeBlob(memeImageBlob);
      let memeImageURI = `https://ipfs.io/ipfs/${memeImageCID}`;

      const signer = await provider.getSigner();
      const message = `I'm uploading this meme: ${memeImageURI}`;
      const signature = await signer.signMessage(message);
      console.log(`Message: ${message}`);
      console.log(`Signature: ${signature}`);
      toast.success('Meme uploaded successfully with your signature!');

      setMemes(prevMemes => [...prevMemes, { uri: memeImageURI, signature }]);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during the meme upload process.');
    }
    setIsLoading(false);
  }

  const onMemeImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setMemeImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div>
      <h1>Upload your Meme</h1>
      <form onSubmit={handleMemeSubmit}>
        <input type="file" accept="image/*" onChange={onMemeImageChange} />
        <button type="submit" disabled={isLoading}>Upload Meme</button>
      </form>
      <div>
        {memes.map((meme, index) => (
          <div key={index}>
            <img src={meme.uri} alt="Meme" />
            <p>Signature: {meme.signature}</p>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default MemeUpload;
