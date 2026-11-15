import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Lightbox } from "@/components/ui/lightbox";
import { furnitureTypeService } from "@/services/furnitureTypeService";
import { FurnitureType } from "@/services/projectService";
import { contactsService, type Contacts } from "@/services/contactsService";
import { ImageIcon } from "lucide-react";
import { SEO } from "@/components/SEO";
import { createProductSchema, createBreadcrumbSchema, createWebPageSchema } from "@/utils/structuredData";

const FurnitureCategory = () => {
  const { category } = useParams();
  const [furnitureType, setFurnitureType] = useState<FurnitureType | null>(null);
  const [contacts, setContacts] = useState<Contacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (category) {
        const [type, contactsData] = await Promise.all([
          furnitureTypeService.getFurnitureTypeById(category),
          contactsService.getContacts()
        ]);
        setFurnitureType(type);
        setContacts(contactsData);
        setLoading(false);
      }
    };
    void loadData();
  }, [category]);
  const allPhotos = furnitureType?.photos ?? [];
  const heroPhotos = allPhotos.slice(0, 5);

  // Memoize lightbox images to prevent recreation on every render
  const lightboxImages = useMemo(
    () =>
      allPhotos.map((photo, index) => ({
        url: furnitureTypeService.getMediaUrl(photo, furnitureType?.updatedAt),
        alt: `${furnitureType?.title || 'Фото'} - фото ${index + 1}`,
      })),
    [allPhotos, furnitureType?.title, furnitureType?.updatedAt]
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          {/* Breadcrumb Skeleton */}
          <Skeleton className="h-4 w-64 mb-8" />

          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-20 w-full max-w-3xl mb-6" />
            <Skeleton className="h-12 w-48" />
          </div>

          {/* Hero Carousel Skeleton */}
          <div className="space-y-12">
            <div>
              <Skeleton className="h-8 w-64 mb-6" />
              <Skeleton className="aspect-[16/9] w-full rounded-lg" />
            </div>

            {/* Photo Grid Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!furnitureType) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
          <Button asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  const firstImage = allPhotos.length > 0
    ? furnitureTypeService.getMediaUrl(allPhotos[0], furnitureType.updatedAt)
    : undefined;

  const structuredData = [
    createProductSchema({
      name: furnitureType.title,
      description: furnitureType.description || `${furnitureType.title} на заказ от Интерьер Проект`,
      image: firstImage,
      category: furnitureType.title
    }),
    createWebPageSchema({
      name: furnitureType.title,
      description: furnitureType.description || `${furnitureType.title} на заказ от Интерьер Проект`,
      url: `/furniture/${category}`
    }),
    createBreadcrumbSchema([
      { name: "Главная", url: "/" },
      { name: "Реализованные проекты", url: "/" },
      { name: furnitureType.title, url: `/furniture/${category}` }
    ])
  ];

  return (
    <>
      <SEO
        title={furnitureType.title}
        description={furnitureType.description || `${furnitureType.title} на заказ по индивидуальным проектам. Собственное производство, высокое качество, гарантия.`}
        keywords={`${furnitureType.title}, мебель на заказ, производство мебели, индивидуальный дизайн`}
        url={`/furniture/${category}`}
        image={firstImage}
        type="product"
        structuredData={structuredData}
      />
      <div className="min-h-screen py-16">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/">Главная</Link> / Реализованные проекты / <Link to={`/furniture/${category}`}>{furnitureType.title}</Link>
        </nav>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">{furnitureType.title}</h1>
            {allPhotos.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
                <span className="text-sm">{allPhotos.length} фото</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {furnitureType.description}
          </p>
          <div className="mt-6">
            <Link to="/contacts"><Button variant="contact">Контакты</Button></Link>
          </div>
        </div>

        {allPhotos.length > 0 ? (
          <div className="space-y-12">
            {/* Hero Carousel - First 5 photos */}
            {heroPhotos.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Избранные фотографии</h2>
                <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                  <CarouselContent>
                    {heroPhotos.map((photo, index) => (
                      <CarouselItem key={photo.id}>
                        <button
                          className="block w-full cursor-pointer p-1"
                          onClick={() => openLightbox(index)}
                          type="button"
                        >
                          <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted border-2 border-transparent hover:border-primary transition-colors">
                            <img
                              src={furnitureTypeService.getMediaUrl(photo, furnitureType.updatedAt)}
                              alt={`${furnitureType.title} - фото ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                              decoding="async"
                            />
                          </div>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

            {/* Photo Grid - All photos */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Все фотографии</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer relative bg-muted hover:ring-2 hover:ring-primary transition-shadow"
                    onClick={() => openLightbox(index)}
                    type="button"
                  >
                    <img
                      src={furnitureTypeService.getThumbnailUrl(photo, 'small', furnitureType.updatedAt)}
                      alt={`${furnitureType.title} - фото ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Фотографии отсутствуют</p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          key={lightboxIndex}
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
      </div>
    </>
  );
};

export default FurnitureCategory;