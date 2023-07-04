
// const imageNames = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import Head from 'next/head';
import styles from '@/styles/Gallery.module.css';


const imageNames = [
  {type: "enfp", images: ["enfp", "enfp1", "enfp2","enfp3", "enfp4", "enfp5","enfp6","enfp7"]},
  {type: "intj", images: ["intj", "intj1", "intj2","intj3","intj4","intj5","intj6"]},
  {type: "enfj", images: ["enfj", "enfj1", "enfj2","enfj3","enfj4","enfj5","enfj6"]},
  {type: "entp", images: ["entp", "entp1", "entp2","entp3","entp4","entp5"]},
  {type: "entj", images: ["entj", "entj1", "entj2","entj3","entj4","entj5","entj6"]},
  {type: "istj", images: ["istj", "istj1", "istj2","istj3","istj4","istj5","istj6","istj7"]},
  {type: "istp", images: ["istp", "istp1", "istp2","istp3","istp4","istp5","istp6","istp7"]},
  {type: "isfp", images: ["isfp", "isfp1", "isfp2","isfp3","isfp4","isfp5"]},
  {type: "esfp", images: ["estp", "estp1", "estp2","estp3","estp4","estp5"]},
  {type: "estj", images: ["estj", "estj1", "estj2","estj3","estj4","estj5"]},
  {type: "esfj", images: ["esfj", "esfj1", "esfj2","esfj3","esfj4","esfj5"]},
  {type: "esfp", images: ["esfp", "esfp1", "esfp2","esfp3","esfp4","esfp5"]},
  {type: "infj", images: ["infj", "infj1", "infj2","infj3","infj4","infj5","infj6","infj7"]},
  {type: "infp", images: ["infp", "infp1", "infp2","infp3","infp4","infp5","infp6"]},
  {type: "intp", images: ["intp", "intp1", "intp2","intp3","intp4","intp5","intp6"]},
  {type: "isfj", images: ["isfj", "isfj1", "isfj2","isfj3","isfj4"]},
  /* More sections... */ 
];
const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageName: string) => {
    setSelectedImage(imageName);
  }

  const handleCloseImage = (e: any) => {
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
    }
  }

  const downloadImage = () => {
    window.open(`/images/${selectedImage}.png`);
  }

  return (
    
    <Layout>
      <Head>
        <title>Gallery Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <a
        className="card flex-1 items-center justify-center bg-info  hover:bg-success mb-7"
        onClick={() => window.open('https://forms.gle/zWkFEqEVWdSpRZYn7', '_blank')}
        style={{ cursor: 'pointer' }}
      >
        <h3 className="text-center text-info-content text-xl">Join the PersonaChain community in showcasing your artistic abilities</h3>
        <p className="text-center text-info-content text-sm">Fill out the form by clicking here</p>
      </a>
      <div className={styles.gallery}>
      {imageNames.map((section, i: number) => (
        <>
          <div id={section.type} className="text-center py-4 text-black bg-base-100 mt-4 mb-2 text-2xl">{section.type.toUpperCase()}</div>
          <div className="flex flex-wrap justify-center">
            {section.images.map((imageName: string, j: number) => (
              <img
                key={`${i}-${j}`}
                src={`/images/${imageName}.png`}
                alt={`image-${i}-${j}`}
                className={`${styles.image} m-2`}
                onClick={() => handleImageClick(imageName)}
              />
            ))}
          </div>
        </>
      ))}

      {selectedImage && (
        <div className={`fixed inset-0 flex items-center justify-center z-50`} onClick={handleCloseImage}>
          <div className={`relative bg-base-300 rounded-lg shadow-lg max-w-3xl mx-auto w-full max-h-screen h-auto p-6 space-y-4 overflow-auto transform transition-transform duration-200 ${selectedImage ? 'scale-100' : 'scale-0'}`}>
            <img src={`/images/${selectedImage}.png`} alt={`selected-${selectedImage}`} className="max-w-full h-auto mx-auto max-h-1/2" />
            <div className="text-center mt-4">
              <button onClick={downloadImage} className="py-2 px-4 bg-blue-500 text-white rounded">Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}

export default Gallery;