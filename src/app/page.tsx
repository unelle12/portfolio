"use client";

import { Layout } from "~/components/layout/Layout";
import { ParallaxHero } from "~/components/hero/ParallaxHero";
import { Introduction } from "~/components/sections/Introduction";
import { SelfAssessment } from "~/components/sections/SelfAssessment";
import { EvidenceOfLearning } from "~/components/sections/EvidenceOfLearning";
import { Reflections } from "~/components/sections/Reflections";
import { OverallRetrospection } from "~/components/sections/OverallRetrospection";
import { Contact } from "~/components/sections/Contact";
import { ContentProvider, useContent } from "~/context/ContentContext";

function HomeContent() {
  const { isLoading } = useContent();

  if (isLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading portfolio...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ParallaxHero />
      <Introduction />
      <SelfAssessment />
      <EvidenceOfLearning />
      <Reflections />
      <OverallRetrospection />
      <Contact />
    </Layout>
  );
}

export default function Home() {
  return (
    <ContentProvider>
      <HomeContent />
    </ContentProvider>
  );
}
