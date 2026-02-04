"use client";

import * as React from "react";
import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  unread?: boolean;
  time: string;
  type:
    | "project"
    | "submittedDatabase"
    | "approvedDatabase"
    | "reviewdApr"
    | "approvedApr";
  database_id?: string;
  project_id?: string;
  apr_id?: string;
}

export interface NotificationMenuProps {
  notifications?: Array<Notification>;
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationMenu = React.forwardRef<
  HTMLButtonElement,
  NotificationMenuProps
>(({ notifications, onNotificationClick }, ref) => {
  const unreadCount = notifications?.filter((n) => n.unread).length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={ref}
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="Notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications?.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="flex flex-col items-start p-3 cursor-pointer"
            onClick={() => {
              if (onNotificationClick) {
                onNotificationClick(notification);
              }
            }}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  {notification.unread && (
                    <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NotificationMenu.displayName = "NotificationMenu";

export default NotificationMenu;
