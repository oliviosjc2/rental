import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  change?: number;
  changeLabel?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  change,
  changeLabel = "from last month"
}: StatCardProps) => {
  const isPositiveChange = change && change > 0;
  
  return (
    <Card className="p-5 border border-neutral-light">
      <div className="flex items-center">
        <div className={cn(
          "flex-shrink-0 p-3 rounded-md",
          iconBgColor
        )}>
          <i className={`${icon} text-xl ${iconColor}`}></i>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-neutral-dark">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      
      {change !== undefined && (
        <div className="mt-4">
          <div className="flex items-center">
            <span className={cn(
              "text-sm flex items-center",
              isPositiveChange ? "text-green-600" : "text-red-600"
            )}>
              <i className={cn(
                "mr-1",
                isPositiveChange ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
              )}></i>
              {Math.abs(change)}%
            </span>
            <span className="ml-2 text-sm text-neutral-dark">{changeLabel}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
