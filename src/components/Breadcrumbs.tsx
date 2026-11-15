import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { createBreadcrumbSchema } from "@/utils/structuredData";
import { Helmet } from "react-helmet-async";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  // Always include Home as the first item if not already present
  const breadcrumbItems: BreadcrumbItem[] =
    items[0]?.url === "/"
      ? items
      : [{ name: "Главная", url: "/" }, ...items];

  // Generate Schema.org JSON-LD structured data
  const structuredData = createBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      {/* Add JSON-LD structured data to page head */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Visual breadcrumb navigation */}
      <nav
        className={`flex items-center text-sm text-muted-foreground mb-8 ${className}`}
        aria-label="Навигационная цепочка"
      >
        <ol className="flex items-center flex-wrap gap-1">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isFirst = index === 0;

            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className="h-4 w-4 mx-1 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="text-foreground font-medium"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.url}
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {isFirst && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
