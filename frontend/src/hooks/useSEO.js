// src/hooks/useSEO.js
import { useEffect } from 'react';

const DEFAULT_IMAGE = '/vite.svg';

const useSEO = ({ 
  title = 'My Website',
  description = '',
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  keywords = [],
  author = 'Cheol Sovandara'
}) => {
  const isDevelopment = import.meta.env.DEV;
  const siteUrl = isDevelopment 
    ? 'http://localhost:5173'
    : 'https://daracheol-6adc.onrender.com';

  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  const getImageUrl = (img) => {
    if (!img) return `${siteUrl}${DEFAULT_IMAGE}`;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${siteUrl}${img.startsWith('/') ? img : `/${img}`}`;
  };

  const imageUrl = getImageUrl(image);

  useEffect(() => {
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

    Object.entries(metaTags).forEach(([name, content]) => {
      if (!content) return;

      const existing = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const tag = document.createElement('meta');
        const attr = name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name';
        tag.setAttribute(attr, name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    });

    document.title = title;

    return () => {
      Object.keys(metaTags).forEach(name => {
        const tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        if (tag) tag.remove();
      });
    };
  }, [title, description, image, url, type, keywords, author]);
};

export default useSEO;
