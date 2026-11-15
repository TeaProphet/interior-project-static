import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object | object[];
}

const DEFAULT_TITLE = "Интерьер Проект - Изготовление мебели на заказ";
const DEFAULT_DESCRIPTION = "Мебель на заказ по индивидуальным эскизам. Собственное производство, гарантия качества, бесплатный замер. Кухни, спальни, гостиные, офисная мебель.";
const DEFAULT_KEYWORDS = "мебель на заказ, кухни, спальни, шкафы-купе, производство мебели, дизайн интерьера, москва";
const DEFAULT_IMAGE = "/logo.png";
const SITE_URL = "https://teaprophet.github.io/interior-project-static";

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url = "/",
  type = "website",
  structuredData
}: SEOProps) => {
  const fullTitle = title ? `${title} | Интерьер Проект` : DEFAULT_TITLE;
  const fullUrl = SITE_URL + url;
  const fullImage = image.startsWith('http') ? image : SITE_URL + image;

  // Format structured data properly for JSON-LD
  // If array is provided, wrap it in @graph format for multiple schemas
  const formattedStructuredData = structuredData
    ? Array.isArray(structuredData)
      ? {
          "@context": "https://schema.org",
          "@graph": structuredData
        }
      : structuredData
    : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph - Required fields */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Интерьер Проект" />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data - JSON-LD format */}
      {formattedStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(formattedStructuredData)}
        </script>
      )}
    </Helmet>
  );
};
