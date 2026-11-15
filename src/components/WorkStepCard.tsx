import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WorkStepCardProps {
  step: number;
  title: string;
  description: string;
  onClick?: () => void;
}

const WorkStepCard = ({ step, title, description, onClick }: WorkStepCardProps) => {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105" onClick={onClick}>
      <CardContent className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
          {step}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default WorkStepCard;