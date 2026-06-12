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

function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 90) {
      const timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => setVisible(false), 300);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div className="loading-bar-container">
      <div
        className="loading-bar"
        style={{ width: `${progress}%` }}
      />
      <style>{`
        .loading-bar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          z-index: 9999;
          background: transparent;
        }
        .loading-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-teal), var(--color-yellow), var(--color-orange));
          background-size: 200% 100%;
          animation: gradientRotate 2s ease infinite;
          transition: width 0.3s var(--ease-snappy);
          border-radius: 0 var(--radius-full) var(--radius-full) 0;
          box-shadow: 0 0 10px var(--color-accent);
        }
      `}</style>
    </div>
  );
}

function HomeContent() {
  const { isLoading } = useContent();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setHasLoaded(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (hasLoaded) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [hasLoaded]);

  return (
    <Layout>
      {!hasLoaded && (
        <div className="skeleton-container">
          <PageSkeleton />
        </div>
      )}
      {hasLoaded && (
        <div className={`content-container ${showContent ? 'content-visible' : ''}`}>
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
        .skeleton-container {
          animation: skeletonFadeOut 0.5s ease-out 0.2s forwards;
        }
        .content-container {
          opacity: 0;
          filter: blur(4px);
          transform: translateY(8px);
          transition: opacity 0.6s ease-out, filter 0.6s ease-out, transform 0.6s ease-out;
        }
        .content-container.content-visible {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }
        @keyframes skeletonFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-container {
            animation: none;
          }
          .content-container {
            opacity: 1;
            filter: none;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </Layout>
  );
}

export default function Home() {
  return (
    <ContentProvider>
      <LoadingBar />
      <HomeContent />
    </ContentProvider>
  );
}
