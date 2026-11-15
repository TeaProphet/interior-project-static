import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { createWebPageSchema, createBreadcrumbSchema } from "@/utils/structuredData";

const About = () => {
  const structuredData = [
    createWebPageSchema({
      name: "О нас",
      description: "Информация о компании Интерьер Проект - производство мебели на заказ по индивидуальным проектам",
      url: "/about"
    }),
    createBreadcrumbSchema([
      { name: "Главная", url: "/" },
      { name: "О нас", url: "/about" }
    ])
  ];

  return (
    <>
      <SEO
        title="О нас"
        description="Компания Интерьер Проект - производство мебели на заказ по индивидуальным проектам. Собственное производство, опытные дизайнеры, гарантия качества."
        keywords="о компании, производство мебели, индивидуальные проекты, дизайн интерьера"
        url="/about"
        structuredData={structuredData}
      />
      <div className="min-h-screen py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/">Главная</Link> / <Link to="/about">О нас</Link>
          </nav>
          
          <h1 className="text-4xl font-bold mb-8">О нас</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p>
              Вот уже несколько лет наша компания занимает уверенные позиции на рынке и предоставляет только самые 
              современные решения, позволяя нашим клиентам делать заказы через сайт. За годы успешной работы 
              компания приобрела бесценный опыт, о чем свидетельствуют лестные отзывы наших клиентов. В случае если 
              у Вас возникли вопросы при оформлении заказа, Вы всегда можете обратиться к нам по
              телефону или адресу электронной почты.
            </p>
          </div>
          
          <Card className="mt-12 bg-muted/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Наши преимущества</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Собственное производство с полным контролем качества</li>
                <li>✓ Опытная команда дизайнеров и мастеров</li>
                <li>✓ Индивидуальный подход к каждому клиенту</li>
                <li>✓ Использование качественных материалов и фурнитуры</li>
                <li>✓ Гарантия на всю изготовленную продукцию</li>
                <li>✓ Бесплатный выезд дизайнера для замера</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default About;