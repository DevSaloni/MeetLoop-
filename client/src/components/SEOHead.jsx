import { useEffect } from 'react';

/**
 * SEO Head Component
 * Sets document title, meta description, canonical URL, and Open Graph tags
 * for each page to ensure proper Google indexing and social media previews.
 */
const SEOHead = ({ 
  title, 
  description, 
  path = '', 
  keywords = '',
  type = 'website' 
}) => {
  const baseUrl = 'https://meetloop-jet.vercel.app';
  const fullUrl = `${baseUrl}${path}`;
  const fullTitle = title.includes('MeetLoop') ? title : `${title} | MeetLoop`;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Helper to set or create meta tags
    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Primary SEO
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullUrl);
    setMeta('property', 'og:type', type);

    // Twitter
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', fullUrl);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Cleanup on unmount - reset to defaults
    return () => {
      document.title = 'MeetLoop | AI-Powered Meeting Accountability Platform';
      setMeta('name', 'description', 'MeetLoop transforms meetings into measurable results. AI-powered task extraction, commitment tracking, and team accountability.');
      
      let can = document.querySelector('link[rel="canonical"]');
      if (can) can.setAttribute('href', baseUrl + '/');
    };
  }, [fullTitle, description, fullUrl, keywords, type]);

  return null; // This component only manages <head> tags
};

export default SEOHead;
