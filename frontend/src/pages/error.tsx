import Layout from '@/components/Layout/Layout';

const Error = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Twitter authentication failed. Please try again.</h1>
      </div>
    </Layout>
  );
}

export default Error;
