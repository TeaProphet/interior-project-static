import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Mail, Clock, MapPin, MessageCircle, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { contactsService, type Contacts } from "@/services/contactsService";
import SocialNetworks from "@/components/SocialNetworks";
import { SEO } from "@/components/SEO";
import { createLocalBusinessSchema, createWebPageSchema, createBreadcrumbSchema } from "@/utils/structuredData";

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contacts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      const contactsData = await contactsService.getContacts();
      setContacts(contactsData);
      setLoading(false);
    };
    void loadContacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <Skeleton className="h-4 w-48 mb-8" />
          <Skeleton className="h-12 w-64 mb-12" />

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information Skeleton */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-10 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Skeleton */}
            <div>
              <Card>
                <CardContent className="p-0">
                  <Skeleton className="w-full h-[400px] lg:h-[500px] rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contacts) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Контакты временно недоступны</h1>
          <Button asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  const structuredData = [
    createLocalBusinessSchema(contacts),
    createWebPageSchema({
      name: "Контакты",
      description: "Контактная информация компании Интерьер Проект",
      url: "/contacts"
    }),
    createBreadcrumbSchema([
      { name: "Главная", url: "/" },
      { name: "Контакты", url: "/contacts" }
    ])
  ];

  return (
    <>
      <SEO
        title="Контакты"
        description={`Свяжитесь с компанией Интерьер Проект. Телефон: +${contacts.phoneNumber}, Email: ${contacts.email}. Адрес: ${contacts.address}`}
        keywords="контакты, адрес, телефон, email, связаться"
        url="/contacts"
        structuredData={structuredData}
      />
      <div className="min-h-screen py-16">
      <div className="container">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/">Главная</Link> / <Link to="/contacts">Контакты</Link>
        </nav>
        
        <h1 className="text-4xl font-bold mb-12">Контакты</h1>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Телефон:</p>
                    <p>+{contacts.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Режим работы:</p>
                    <p>Пн—Пт с 10:00 до 18:00</p>
                    <p>Сб—Вс Выходной</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Адрес:</p>
                    <p>{contacts.address}</p>
                    <p className="text-sm text-amber-600 mt-1">Встречи в офисе проводятся по предварительной записи</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p>{contacts.email}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="font-semibold mb-2">Реквизиты:</p>
                  <p className="text-sm text-muted-foreground">ООО "Интерьер Проект"</p>
                  <p className="text-sm text-muted-foreground">ИНН {contacts.inn} ОГРН {contacts.ogrn}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <SocialNetworks contacts={contacts} variant="icon-only" />
              </CardContent>
            </Card>
          </div>
          
          {/* Map */}
          <div>
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden relative">
                  <a
                    href="https://yandex.ru/maps/org/interyer_proyekt/68250848417/?utm_medium=mapframe&utm_source=maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#eee',
                      fontSize: '12px',
                      position: 'absolute',
                      top: '0px'
                    }}
                  >
                    Интерьер проект
                  </a>
                  <a
                    href="https://yandex.ru/maps/193/voronezh/category/interior_design/184107539/?utm_medium=mapframe&utm_source=maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#eee',
                      fontSize: '12px',
                      position: 'absolute',
                      top: '14px'
                    }}
                  >
                    Дизайн интерьеров в Воронеже
                  </a>
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=39.206323%2C51.670984&mode=search&oid=68250848417&ol=biz&sctx=ZAAAAAgBEAAaKAoSCQbxgR3%2FmUNAEX9skh%2Fx1UlAEhIJBU62gTtQlz8RZ7lsdM5PgT8iBgABAgMEBSgKOABAs80GSAFqAnJ1nQHNzMw9oAEAqAEAvQEL%2BFHVggId0LjQvdGC0LXRgNGM0LXRgCDQv9GA0L7QtdC60YKKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=39.206323%2C51.670984&sspn=0.028767%2C0.014718&text=%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%8C%D0%B5%D1%80%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82&z=15.6"
                    width="100%"
                    height="100%"
                    frameBorder="1"
                    allowFullScreen={true}
                    style={{ position: 'relative' }}
                    title="Интерьер проект на карте Воронежа"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Contacts;