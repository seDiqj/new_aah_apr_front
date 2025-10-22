"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useParentContext } from "@/contexts/ParentContext";

type AprState = {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[];

const StatsCards = () => {
        
  const aprsState: AprState = useParentContext().aprStats;

  return (
    <div className="flex flex-row flex-wrap items-center justify-start gap-3 mt-4 ml-4">
      {aprsState.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="w-[150px] h-[100px] rounded-xl flex items-center justify-center shadow-sm"
          >
            <CardContent className="flex items-center justify-center gap-2 p-2">
              <Icon className={`${item.color} w-6 h-6`} />
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold">{item.title}</span>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
