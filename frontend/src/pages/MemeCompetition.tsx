import Layout from '@/components/Layout/Layout'
import type { NextPage } from 'next'
import Head from 'next/head'


const Home: NextPage = () => {
  return (
    <Layout>


      <main className="flex-grow items-center justify-center py-10 px-20 text-center">
        <h1 className="my-12 text-6xl font-bold">
            <span className="text-secondary">Coming Soon ...</span>
        </h1>

</main>

    </Layout>
  )
}

export default Home
