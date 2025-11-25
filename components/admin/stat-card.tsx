'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Car,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  fileText: FileText,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  dollarSign: DollarSign,
  car: Car,
};

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: keyof typeof ICONS;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon = 'trendingUp',
  trend,
  className,
}: StatCardProps) {
  const Icon = ICONS[icon] || TrendingUp;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span
                className={cn(
                  'font-medium mr-1',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}


