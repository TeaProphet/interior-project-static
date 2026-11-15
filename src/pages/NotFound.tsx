import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Страница не найдена - 404 | Интерьер Проект</title>
        <meta name="description" content="К сожалению, запрашиваемая страница не найдена." />

        {/* Критично для SEO: запрещаем индексацию 404 страниц */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />

        {/* Open Graph */}
        <meta property="og:title" content="Страница не найдена - 404" />
        <meta property="og:description" content="К сожалению, запрашиваемая страница не найдена." />

        {/* Canonical URL указывает на главную, чтобы избежать дублирования */}
        <link rel="canonical" href={`${window.location.origin}/`} />

        {/* Устанавливаем статус 404 через meta (для pre-rendering сервисов) */}
        <meta name="prerender-status-code" content="404" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="container max-w-2xl text-center px-4">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Страница не найдена</h2>
          <p className="text-xl text-muted-foreground mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">Вернуться на главную</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contacts">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
