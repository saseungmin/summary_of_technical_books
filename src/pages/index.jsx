import React from 'react';

import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import HomepageHeader from '../components/HomepageHeader';
import SummaryBooks from '../components/SummaryBooks';

function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <SummaryBooks />
      </main>
    </Layout>
  );
}

export default Home;
