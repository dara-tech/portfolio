export const testSEO = () => {
  // Get all meta tags
  const metaTags = document.getElementsByTagName('meta');
  const metaInfo = {};

  // Convert HTMLCollection to Array and map through meta tags
  Array.from(metaTags).forEach(tag => {
    const name = tag.getAttribute('name') || tag.getAttribute('property');
    if (name) {
      metaInfo[name] = tag.getAttribute('content');
    }
  });

  // Log the results
  console.group('SEO Meta Tags Test');
  console.log('Title:', document.title);
  console.log('Meta Tags:', metaInfo);
  console.groupEnd();

  return metaInfo;
};

// Usage in browser console:
// testSEO(); 