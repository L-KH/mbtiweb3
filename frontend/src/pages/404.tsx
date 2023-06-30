import Layout from '@/components/Layout/Layout'
import { NextPage } from 'next'
import React, { useState } from "react";


import ProfileCard from '../components/ProfileCard';

const Page404: NextPage = () => {
  const [showCard, setShowCard] = useState(false);

  return (
    <Layout>
<main className="flex-grow items-center justify-center py-10 px-20 text-center">
<div className="m-12 flex-row gap-6">
      <a className="btn btn-primary m-3" onClick={() => window.location.href='https://www.16personalities.com/free-personality-test'} >
        Take Test
      </a>

      <div className="btn btn-secondary m-3" onClick={() => setShowCard(true)}>
        Already know my type
      </div></div>
      {showCard && <ProfileCard />}
      {/* Other components and content */}
    
      </main></Layout>
  )
}

export default Page404
