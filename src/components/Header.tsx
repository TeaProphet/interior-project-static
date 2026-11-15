import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";
import { furnitureTypeService } from "@/services/furnitureTypeService";
import { FurnitureType } from "@/services/projectService";
import { contactsService, type Contacts } from "@/services/contactsService";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [furnitureTypes, setFurnitureTypes] = useState<FurnitureType[]>([]);
  const [contacts, setContacts] = useState<Contacts | null>(null);
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      const [types, contactsData] = await Promise.all([
        furnitureTypeService.getFurnitureTypes(),
        contactsService.getContacts()
      ]);
      setFurnitureTypes(types);
      setContacts(contactsData);
    };
    void loadData();
  }, []);

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link
        to="/"
        className={`transition-colors hover:text-primary ${
          location.pathname === "/" ? "text-primary font-medium" : "text-foreground"
        } ${mobile ? "block py-2" : ""}`}
        onClick={() => mobile && setIsOpen(false)}
      >
        Главная
      </Link>
      <Link
        to="/about"
        className={`transition-colors hover:text-primary ${
          location.pathname === "/about" ? "text-primary font-medium" : "text-foreground"
        } ${mobile ? "block py-2" : ""}`}
        onClick={() => mobile && setIsOpen(false)}
      >
        О нас
      </Link>
      
      {mobile ? (
        <div className="py-2">
          <div className="font-medium mb-2">Реализованные проекты</div>
          {furnitureTypes.map((type) => (
            <Link
              key={type.documentId}
              to={`/furniture/${type.documentId}`}
              className="block pl-4 py-1 text-sm transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {type.title}
            </Link>
          ))}
        </div>
      ) : (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="transition-colors hover:text-primary text-foreground font-normal text-base bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                  Реализованные проекты
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 w-48">
                  {furnitureTypes.map((type) => (
                    <Link
                      key={type.documentId}
                      to={`/furniture/${type.documentId}`}
                      className="block py-2 transition-colors hover:text-primary"
                    >
                      {type.title}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}

      
      
      <Link
        to="/contacts"
        className={`transition-colors hover:text-primary ${
          location.pathname === "/contacts" ? "text-primary font-medium" : "text-foreground"
        } ${mobile ? "block py-2" : ""}`}
        onClick={() => mobile && setIsOpen(false)}
      >
        Контакты
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="font-bold text-xl">Интерьер Проект</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            {contacts ? (
              <span>+{contacts.phoneNumber}</span>
            ) : (
              <Skeleton className="h-4 w-32" />
            )}
          </div>
          <Link to="/contacts"><Button variant="contact">Контакты</Button></Link>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Открыть меню навигации">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLinks mobile />
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-4">
                    <Phone className="h-4 w-4" />
                    {contacts ? (
                      <span>+{contacts.phoneNumber}</span>
                    ) : (
                      <Skeleton className="h-4 w-32" />
                    )}
                  </div>
                  <Link to="/contacts"><Button variant="contact">Контакты</Button></Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;