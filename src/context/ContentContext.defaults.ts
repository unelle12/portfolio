import portfolioData from '../data/portfolio.json';
import selfAssessmentData from '../data/selfAssessment.json';
import reflectionsData from '../data/reflections.json';
import retrospectionData from '../data/retrospection.json';
import contactData from '../data/contact.json';

export const heroDefaults = {
  giantText: 'PORTFOLIO',
  badge: 'Year 1 at PNU',
  headline: 'Welcome to My',
  headlineAccent: 'Growth Journey',
  description: 'Documenting my personal and professional development through evidence-based learning at Philippine Normal University.',
  ctaText: 'Explore My Work',
};

export const sectionDefaults = {
  hero: heroDefaults,
  introduction: {
    personal: portfolioData.personal,
    ...portfolioData.introduction,
  },
  selfAssessment: selfAssessmentData,
  reflections: reflectionsData,
  retrospection: retrospectionData,
  contact: contactData,
};
