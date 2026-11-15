// Utility functions for creating structured data (Schema.org JSON-LD)

const SITE_URL = "https://teaprophet.github.io/interior-project-static";

interface Contact {
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export const createOrganizationSchema = (contacts?: Contact | null) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Интерьер Проект",
    "legalName": "ООО \"Интерьер Проект\"",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "image": `${SITE_URL}/logo.png`,
    "description": "Производство мебели на заказ по индивидуальным проектам",
    "taxID": "3662269552",
    "vatID": "1183668045560",
    "telephone": "+79038574090",
    "email": "a.efremov-ivk@yandex.ru",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Проспект Труда, д. 48",
      "addressLocality": "Воронеж",
      "addressRegion": "Воронежская область",
      "postalCode": "394026",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.677389",
      "longitude": "39.171409"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+79038574090",
      "contactType": "customer service",
      "availableLanguage": ["Russian"],
      "areaServed": "RU",
      "contactOption": "TollFree"
    },
    "sameAs": [
      "https://vk.com/efremovandre",
      "https://t.me/Andrey_EFREM0V",
      "https://wa.me/79038574090"
    ],
    "areaServed": [
      {
        "@type": "State",
        "name": "Воронежская область"
      },
      {
        "@type": "State",
        "name": "Липецкая область"
      },
      {
        "@type": "State",
        "name": "Белгородская область"
      },
      {
        "@type": "State",
        "name": "Курская область"
      },
      {
        "@type": "State",
        "name": "Тамбовская область"
      },
      {
        "@type": "City",
        "name": "Москва"
      },
      {
        "@type": "State",
        "name": "Московская область"
      }
    ]
  };
};

export const createLocalBusinessSchema = (contacts?: Contact | null) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Интерьер Проект",
    "legalName": "ООО \"Интерьер Проект\"",
    "image": `${SITE_URL}/logo.png`,
    "url": SITE_URL,
    "description": "Производство мебели на заказ по индивидуальным проектам. Встречи в офисе проводятся по предварительной записи.",
    "telephone": "+79038574090",
    "email": "a.efremov-ivk@yandex.ru",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Проспект Труда, д. 48",
      "addressLocality": "Воронеж",
      "addressRegion": "Воронежская область",
      "postalCode": "394026",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.677389",
      "longitude": "39.171409"
    },
    "priceRange": "$$",
    "paymentAccepted": "Bank Transfer",
    "currenciesAccepted": "RUB",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "10:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://vk.com/efremovandre",
      "https://t.me/Andrey_EFREM0V",
      "https://wa.me/79038574090"
    ],
    "hasMap": `https://yandex.ru/maps/?pt=39.171409,51.677389&z=16&l=map`
  };
};

export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.url}`
    }))
  };
};

export const createProductSchema = (product: {
  name: string;
  description: string;
  image?: string;
  category?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    ...(product.image && {
      "image": product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`
    }),
    "brand": {
      "@type": "Brand",
      "name": "Интерьер Проект"
    },
    ...(product.category && { "category": product.category }),
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock"
    }
  };
};

export const createWebPageSchema = (page: {
  name: string;
  description: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.name,
    "description": page.description,
    "url": `${SITE_URL}${page.url}`,
    "inLanguage": "ru-RU",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Интерьер Проект",
      "url": SITE_URL
    }
  };
};

