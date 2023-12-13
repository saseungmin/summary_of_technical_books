import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HomepageHeader from '../components/HomepageHeader';
import SummaryBooks from '../components/SummaryBooks';

function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description={siteConfig.tagline}
    >
      <HomepageHeader />
      <main>
        <SummaryBooks />
      </main>
    </Layout>
  );
}

export default Home;
