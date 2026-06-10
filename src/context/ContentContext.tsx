"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { api } from '~/trpc/react';

interface ContentContextType {
  content: Record<string, unknown>;
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  updateSection: (sectionKey: string, data: unknown) => void;
  updateReflection: (evidenceId: string, paragraphs: string[]) => void;
  resetSection: (sectionKey: string) => void;
  resetAllContent: () => void;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all content from API
  const { data: serverContent, isLoading: isFetching, error } = api.section.getAll.useQuery();

  useEffect(() => {
    if (serverContent) {
      setContent(serverContent as Record<string, unknown>);
      setIsLoading(false);
    } else if (error) {
      console.error("Failed to load content:", error);
      setIsLoading(false);
    }
  }, [serverContent, error]);

  // Mutations
  const updateHero = api.section.updateHero.useMutation();
  const updateIntroduction = api.section.updateIntroduction.useMutation();
  const updateSelfAssessment = api.section.updateSelfAssessment.useMutation();
  const updateRetrospection = api.section.updateRetrospection.useMutation();
  const updateContact = api.section.updateContact.useMutation();
  const updateReflectionMutation = api.section.updateReflection.useMutation();
  const resetSectionMutation = api.section.resetSection.useMutation();

  const updateSection = useCallback((sectionKey: string, data: unknown) => {
    // Update local state immediately for responsive UI
    setContent((prev) => ({ ...prev, [sectionKey]: data }));

    // Send to server
    const mutation = {
      hero: updateHero,
      introduction: updateIntroduction,
      selfAssessment: updateSelfAssessment,
      retrospection: updateRetrospection,
      contact: updateContact,
    }[sectionKey];

    if (mutation) {
      mutation.mutate(data as never);
    }
  }, [updateHero, updateIntroduction, updateSelfAssessment, updateRetrospection, updateContact]);

  const updateReflection = useCallback((evidenceId: string, paragraphs: string[]) => {
    // Update local state
    setContent((prev) => {
      const reflections = (prev.reflections as Array<{ evidenceId: string; paragraphs: string[] }>) ?? [];
      const updated = reflections.map((r) =>
        r.evidenceId === evidenceId ? { ...r, paragraphs } : r
      );
      return { ...prev, reflections: updated };
    });

    // Send to server
    updateReflectionMutation.mutate({ evidenceId, paragraphs });
  }, [updateReflectionMutation]);

  const resetSection = useCallback((sectionKey: string) => {
    resetSectionMutation.mutate({ section: sectionKey }, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  }, [resetSectionMutation]);

  const resetAllContent = useCallback(() => {
    const sections = ['hero', 'introduction', 'selfAssessment', 'retrospection', 'contact'];
    sections.forEach((section) => {
      resetSectionMutation.mutate({ section });
    });
  }, [resetSectionMutation]);

  const setEditMode = useCallback((val: boolean) => {
    setIsEditMode(val);
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        isEditMode,
        setEditMode,
        updateSection,
        updateReflection,
        resetSection,
        resetAllContent,
        isLoading: isLoading || isFetching,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
