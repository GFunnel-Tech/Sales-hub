import { ServiceConfig } from "@/lib/serviceConfigs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  service: ServiceConfig;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();
  const Icon = service.badgeIcon;

  const handleClick = () => {
    navigate(`/${service.slug}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-accent/50 h-full flex flex-col"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 rounded-lg bg-accent/10 text-accent">
            <Icon className="w-6 h-6" />
          </div>
          <Badge variant="accent">
            {service.badgeText}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-accent transition-colors">
          {service.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 h-[44px] leading-snug">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="grid grid-cols-3 gap-2">
          {service.stats.slice(0, 3).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-bold text-accent text-base truncate">{stat.value}</div>
              <div className="text-xs text-muted-foreground line-clamp-2 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};