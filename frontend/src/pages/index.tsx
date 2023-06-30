import Layout from '@/components/Layout/Layout'
import { BigNumber } from 'ethers'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSendTransaction } from 'wagmi'

const Home: NextPage = () => {
  const { data, isIdle, isError, isLoading, isSuccess, sendTransaction } =
    useSendTransaction({
      request: {
        to: '0xce4a9990251944b625c11d2f4a28b38197aa29e1',
        value: BigNumber.from('10000000000000000'), // .01 ETH
      },
    })

  return (
    <Layout>
      <Head>
        <title>Dashboard Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow items-center justify-center py-10 px-20 text-center">
  <h1 className="my-12 text-6xl font-bold">
    Welcome to <span className="text-secondary">PersonaChain</span>
  </h1>

  <div className="mx-auto max-w-xl">
    <p className="text-xl mb-4">
      Explore the world of personalities, connect with others and create your unique digital identity. All on the blockchain.
    </p>

    <ul className="list-outside list-disc text-left text-xl">
      <li>Mint your unique personality NFT for <b>free</b></li>
      <li>Find and connect with people who share your <b>MBTI</b> type</li>
      <li>Secure and decentralized with <b>Web3</b> technology</li>
      <li>Each user is allowed to mint one and only one <b>NFT</b></li>
    </ul>

    <p className="text-xl mt-4">
      Start your journey by discovering your MBTI type or if you already know it, create your NFT now!
    </p>
  </div>
</main>

    </Layout>
  )
}

export default Home
