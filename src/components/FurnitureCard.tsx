import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface FurnitureCardProps {
  title: string;
  image: string;
  href: string;
}

const FurnitureCard = ({ title, image, href }: FurnitureCardProps) => {
  return (
    <Link to={href} className="group">
      <Card className="overflow-hidden transition-transform group-hover:scale-105 shadow-card">
        <CardContent className="p-0">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={image}
              alt={`${title} - мебель на заказ`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-center">{title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FurnitureCard;