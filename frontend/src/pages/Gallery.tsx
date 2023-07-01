import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import Head from 'next/head';
import styles from '@/styles/Gallery.module.css';

const imageNames = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

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
      
      <div className={styles.gallery}>
      {imageNames.map((imageName: string, i: number) => (
        <img
          key={i}
          src={`/images/${imageName}.png`}
          alt={`image-${i}`}
          className={styles.image}
          onClick={() => handleImageClick(imageName)}
        />
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
