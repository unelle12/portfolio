"use client";

import { useState, useEffect } from "react";
import { Layout } from "~/components/layout/Layout";
import { ParallaxHero } from "~/components/hero/ParallaxHero";
import { Introduction } from "~/components/sections/Introduction";
import { SelfAssessment } from "~/components/sections/SelfAssessment";
import { EvidenceOfLearning } from "~/components/sections/EvidenceOfLearning";
import { Reflections } from "~/components/sections/Reflections";
import { OverallRetrospection } from "~/components/sections/OverallRetrospection";
import { Contact } from "~/components/sections/Contact";
import { ContentProvider, useContent } from "~/context/ContentContext";
import { PageSkeleton } from "~/components/skeleton/Skeleton";

function HomeContent() {
  const { isLoading } = useContent();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setHasLoaded(true), 700);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <Layout>
      {isLoading && (
        <div className="skeleton-fade-out" style={{ opacity: 1, transition: 'opacity 500ms ease-out' }}>
          <PageSkeleton />
        </div>
      )}
      {!isLoading && !hasLoaded && (
        <div className="content-fade-in">
          <PageSkeleton />
        </div>
      )}
      {hasLoaded && (
        <div className="content-visible">
          <ParallaxHero />
          <Introduction />
          <SelfAssessment />
          <EvidenceOfLearning />
          <Reflections />
          <OverallRetrospection />
          <Contact />
        </div>
      )}

      <style>{`
        .skeleton-fade-out {
          opacity: 1;
          animation: skeletonFadeOut 500ms ease-out forwards;
        }
        .content-fade-in {
          opacity: 0;
          animation: contentFadeIn 600ms ease-out forwards;
        }
        .content-visible {
          opacity: 1;
        }
        @keyframes skeletonFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes contentFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
