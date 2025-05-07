import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const DEFAULT_IMAGE = '/vite.svg';

const useSEO = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  keywords = [],
  author = 'Cheol Sovandara'
}) => {
  const isDevelopment = import.meta.env.DEV;
  const siteUrl = isDevelopment 
    ? 'http://localhost:5173'
    : 'https://daracheol-6adc.onrender.com';

  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  
  // Handle image URLs
  const getImageUrl = (img) => {
    if (!img) return `${siteUrl}${DEFAULT_IMAGE}`;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${siteUrl}${img.startsWith('/') ? img : `/${img}`}`;
  };

  const imageUrl = getImageUrl(image);

  useEffect(() => {
    // Update meta tags when SEO props change
    const metaTags = {
      'title': title,
      'description': description,
      'keywords': keywords.join(', '),
      'author': author,
      'og:type': type,
      'og:url': fullUrl,
      'og:title': title,
      'og:description': description,
      'og:image': imageUrl,
      'twitter:card': 'summary_large_image',
      'twitter:url': fullUrl,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': imageUrl
    };

    // Update each meta tag
    Object.entries(metaTags).forEach(([name, content]) => {
      if (!content) return;
      
      const existingTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });

    // Update title
    document.title = title;

    // Cleanup function
    return () => {
      // Remove meta tags when component unmounts
      Object.keys(metaTags).forEach(name => {
        const tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        if (tag) {
          tag.remove();
        }
      });
    };
  }, [title, description, image, url, type, keywords, author, fullUrl, imageUrl]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default useSEO; 