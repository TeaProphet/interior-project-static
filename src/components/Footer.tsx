import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { contactsService, type Contacts } from "@/services/contactsService";
import { FEATURE_FLAGS } from "@/config/api";

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const VKIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.39 14.47h-1.46c-.66 0-.86-.53-2.05-1.72-1.03-1-1.49-1.14-1.75-1.14-.36 0-.46.1-.46.58v1.57c0 .42-.13.67-1.24.67-1.85 0-3.89-1.12-5.33-3.21-2.16-3.08-2.75-5.4-2.75-5.88 0-.26.1-.5.58-.5h1.46c.43 0 .6.2.76.65.85 2.35 2.28 4.41 2.87 4.41.22 0 .32-.1.32-.66v-2.56c-.07-1.09-.64-1.18-.64-1.57 0-.21.17-.42.44-.42h2.3c.36 0 .49.19.49.62v3.46c0 .36.16.49.26.49.22 0 .4-.13.82-.54 1.27-1.42 2.18-3.6 2.18-3.6.12-.26.31-.5.74-.5h1.46c.53 0 .65.27.53.63-.19.94-2.26 3.66-2.26 3.66-.18.3-.25.44 0 .77.18.25.76.74 1.15 1.19.71.82 1.26 1.51 1.41 1.99.14.48-.08.72-.6.72z"/>
  </svg>
);

const Footer = () => {
  const [contacts, setContacts] = useState<Contacts | null>(null);

  useEffect(() => {
    const loadContacts = async () => {
      const contactsData = await contactsService.getContacts();
      setContacts(contactsData);
    };
    void loadContacts();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            СВЯЗАТЬСЯ С НАМИ
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="h-5 w-5" />
                {contacts ? (
                  <span className="text-lg">+{contacts.phoneNumber}</span>
                ) : (
                  <Skeleton className="h-7 w-48 bg-primary-foreground/20" />
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="h-5 w-5" />
                {contacts ? (
                  <span className="text-lg">{contacts.email}</span>
                ) : (
                  <Skeleton className="h-7 w-48 bg-primary-foreground/20" />
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2 pt-4">
                <span className="text-sm opacity-90">Мессенджеры:</span>
              </div>
              <div className="flex justify-center md:justify-start space-x-4">
                {contacts?.whatsappNumber && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => window.open(`https://wa.me/${contacts.whatsappNumber}`, '_blank')}
                  >
                    <WhatsAppIcon />
                    <span className="sr-only">WhatsApp</span>
                  </Button>
                )}
                {contacts?.telegram && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => window.open(`https://t.me/${contacts.telegram}`, '_blank')}
                  >
                    <TelegramIcon />
                    <span className="sr-only">Telegram</span>
                  </Button>
                )}
                {contacts?.vk && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => window.open(`https://vk.com/${contacts.vk}`, '_blank')}
                  >
                    <VKIcon />
                    <span className="sr-only">VK</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm opacity-90 mb-2">Адрес:</p>
                {contacts ? (
                  <p>{contacts.address}</p>
                ) : (
                  <Skeleton className="h-6 w-full max-w-xs bg-primary-foreground/20" />
                )}
              </div>
              <div className="pt-4">
                <p className="text-sm opacity-90 mb-2">Реквизиты:</p>
                {contacts ? (
                  <>
                    <p className="text-sm">ИНН {contacts.inn}</p>
                    <p className="text-sm">ОГРН {contacts.ogrn}</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48 bg-primary-foreground/20" />
                    <Skeleton className="h-5 w-56 bg-primary-foreground/20" />
                  </div>
                )}
              </div>
              <Link to="/contacts"><Button variant="contact">Контакты</Button></Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/60">
          {!FEATURE_FLAGS.HIDE_PRIVACY_AND_FORMS && (
            <>
              <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors underline underline-offset-4">
                Политика конфиденциальности
              </Link>
              <span className="mx-2">·</span>
            </>
          )}
          <span>© {new Date().getFullYear()} ООО «Интерьер Проект»</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;