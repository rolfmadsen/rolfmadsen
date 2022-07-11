// pages/index.jsx
import Layout from '../../../components/Layout';
import OpensearchMarcxchange from '../../../components/OpensearchMarcxchange';

const Home = () => (
  <Layout>
    <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
      <p className="block">This page is identical to the frontpage.</p>
    </div>
    <OpensearchMarcxchange />
  </Layout>
)

export default Home