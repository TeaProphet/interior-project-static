import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import FurnitureCard from "@/components/FurnitureCard";
import WorkStepCard from "@/components/WorkStepCard";
import AdvantageCard from "@/components/AdvantageCard";
import { SEO } from "@/components/SEO";
import { Phone, Clock, Award, Users, Wrench, ShieldCheck, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FurnitureType } from "@/services/projectService";
import { furnitureTypeService } from "@/services/furnitureTypeService";
import { contactsService, type Contacts } from "@/services/contactsService";
import { createOrganizationSchema, createLocalBusinessSchema } from "@/utils/structuredData";

import heroImage from "@/assets/Image_2.jpg";

const Home = () => {
  const [furnitureTypes, setFurnitureTypes] = useState<FurnitureType[]>([]);
  const [contacts, setContacts] = useState<Contacts | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [furnitureTypesData, contactsData] = await Promise.all([
        furnitureTypeService.getFurnitureTypes(),
        contactsService.getContacts()
      ]);
      setFurnitureTypes(furnitureTypesData);
      setContacts(contactsData);
    };
    void loadData();
  }, []);

  const workSteps = [
    {
      step: 1,
      title: "Заявка",
      description: "Связываетесь с нами по телефону"
    },
    {
      step: 2,
      title: "Предварительный расчёт",
      description: "Согласование стоимости мебели исходя из выбранных материалов и фурнитуры"
    },
    {
      step: 3,
      title: "Замер",
      description: "Выезжаем к вам для замера помещения"
    },
    {
      step: 4,
      title: "Проект",
      description: "Создание 3D модели изделия"
    },
    {
      step: 5,
      title: "Производство",
      description: "Изготавливаем мебель на собственном производстве"
    },
    {
      step: 6,
      title: "Сервис",
      description: "Доставляем и собираем мебель"
    },
    {
      step: 7,
      title: "Гарантия",
      description: "Предоставляем гарантию на всю продукцию"
    }
  ];

  const advantages = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Собственное производство",
      description: "Полный контроль качества на всех этапах изготовления на современном высокоточном оборудовании"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Профессиональные дизайнеры-конструкторы",
      description: "Более 20 лет опыта в создании и изготовлении мебели для интерьеров жилых и офисных помещений"
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Сервисный пакет",
      description: "Консультация дизайнера, замер помещения, доставка и сборка мебели - бесплатно"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Гарантия качества",
      description: "12 месяцев гарантии на мебель и комплектующие, пост-гарантийное обслуживание на весь срок эксплуатации"
    },
    {
      icon: <Map className="h-8 w-8 text-primary" />,
      title: "Территориальный охват",
      description: "Воронежская, Липецкая, Белгородская, Курская, Тамбовская области, Москва и Подмосковье"
    }
  ];

  const structuredData = [
    createOrganizationSchema(contacts),
    createLocalBusinessSchema(contacts)
  ];

  return (
    <>
      <SEO
        url="/"
        structuredData={structuredData}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="container relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Создание и производство мебели<br />
              по индивидуальным проектам
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                {contacts ? (
                  <span className="text-xl">+{contacts.phoneNumber}</span>
                ) : (
                  <Skeleton className="h-7 w-48" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <Clock className="h-4 w-4" />
                <span>ежедневно с 10:00 до 18:00</span>
              </div>
            </div>
            <Link to="/contacts"><Button variant="contact">Контакты</Button></Link>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <AdvantageCard key={index} {...advantage} />
            ))}
          </div>
        </div>
      </section>

      {/* Furniture Types Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Реализованные проекты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {furnitureTypes.length > 0 ? (
              furnitureTypes.map((furniture) => (
                <FurnitureCard
                  key={furniture.documentId}
                  title={furniture.title}
                  image={furniture.photos && furniture.photos.length > 0 ? furnitureTypeService.getMediaUrl(furniture.photos[0], furniture.updatedAt) : `${import.meta.env.BASE_URL}placeholder.svg`}
                  href={`/furniture/${furniture.documentId}`}
                />
              ))
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">О компании</h2>
              <p className="text-muted-foreground mb-6">
                Наша компания изготавливает мебель только по индивидуальным проектам (никаких стандартов, ограничений в размерах и выборе материалов не предусмотрено).
              </p>
              <p className="text-muted-foreground mb-6">
                Для просчёта и дальнейшей реализации может быть использован как ваш дизайн проект, так и проработанный нашими дизайнерами, которые создадут концепцию исходя из ваших пожеланий и предпочтений.
              </p>
              <Link to="/contacts"><Button variant="contact">Контакты</Button></Link>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={heroImage}
                alt="О компании Интерьер Проект - производство мебели на заказ"
                className="w-full h-full object-cover"
                loading="lazy"
                width="800"
                height="600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Как мы работаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workSteps.map((step, index) => (
              <WorkStepCard key={index} {...step} />
            ))}
          </div>
        </div>
      </section>

      
      </div>
    </>
  );
};

export default Home;