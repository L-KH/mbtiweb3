import Layout from '@/components/Layout/Layout'
import { NextPage } from 'next'
import AllNFTs from '../components/AllNFTs';

const Page500: NextPage = () => {
  return (
    <Layout>
      <div className="flex h-full content-center ">
      <AllNFTs />
      </div>
    </Layout>
  )
}

export default Page500
