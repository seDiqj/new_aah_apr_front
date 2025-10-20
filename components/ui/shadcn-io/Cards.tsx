"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Folder } from "lucide-react"

// Temporary mock data (replace with API data later)
const mockStats = [
  { title: "Total Projects", value: 12, icon: Folder, color: "text-blue-500" },
  { title: "Pending Requests", value: 6, icon: Clock, color: "text-yellow-500" },
  { title: "Rejected", value: 3, icon: XCircle, color: "text-red-500" },
  { title: "Approved", value: 9, icon: CheckCircle, color: "text-green-500" },
]

/**
 * StatsCards Component (shadcn/ui)
 * - Uses Card from shadcn/ui
 * - Centers icon, title, and value vertically and horizontally
 * - Can later receive data from API instead of mockStats
 */
const StatsCards = () => {
  return (
    <div className="flex flex-row items-center justify-around flex-wrap gap-4 mt-6 ml-6">
      {mockStats.map((item, index) => {
        const Icon = item.icon
        return (
          <Card
            key={index}
            className="w-[212px] h-[139px] rounded-[15px] flex items-center justify-center shadow-md"
          >
            <CardContent className="flex items-center justify-center gap-4 p-4">
              {/* Icon on the left */}
              <Icon className={`${item.color} w-10 h-10`} />
              {/* Title + Value in the center */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-bold">{item.title}</span>
                <p className="text-4xl font-bold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default StatsCards