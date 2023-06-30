import Layout from '@/components/Layout/Layout'
import { NextPage } from 'next'
import React, { useState } from "react";


import ProfileCard from '../components/ProfileCard';

const Page404: NextPage = () => {
  const [showCard, setShowCard] = useState(false);

  return (
    <Layout>
      <main className="flex-grow items-center justify-center py-10 px-20 text-center">
        <div className="text-xl mb-4">
        Welcome to PersonaChain! Here, you can find out your personality type and turn it into a special digital token called an NFT. Already know your personality type? Great, you can start making your NFT right away. Just remember, you can only make one NFT. Let's get started🌟
        </div>
        <div className="m-12 flex-row gap-6">
          <a className="btn btn-primary m-3" onClick={() => window.open('https://www.16personalities.com/free-personality-test', '_blank')} >
            Take Test
          </a>
  
          <div className="btn btn-secondary m-3" onClick={() => setShowCard(true)}>
            Already know my type
          </div>
        </div>
        {showCard && <ProfileCard />}
        {/* Other components and content */}
      </main>
    </Layout>
  )
  
}

export default Page404
