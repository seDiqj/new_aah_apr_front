"use client";

import * as React from "react";
import { useEffect, useId, useState } from "react";
import { LayoutGridIcon } from "lucide-react";
import InfoMenu from "./InfoMenu";
import NotificationMenu from "./NotificationMenu";
import SettingsMenu from "./SettingsMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../../sidebar";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../card";

// Types
export interface Navbar14Props extends React.HTMLAttributes<HTMLElement> {
  searchPlaceholder?: string;
  searchValue?: string;
  testMode?: boolean;
  showTestMode?: boolean;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    unread?: boolean;
  }>;
  onSearchChange?: (value: string) => void;
  onTestModeChange?: (enabled: boolean) => void;
  onLayoutClick?: () => void;
  onAddClick?: () => void;
  onInfoItemClick?: (item: string) => void;
  onNotificationClick?: (notificationId: string) => void;
  onSettingsItemClick?: (item: string) => void;
}

export const Navbar14 = React.forwardRef<HTMLElement, Navbar14Props>(
  (
    {
      className,
      searchPlaceholder = "Search...",
      searchValue,
      showTestMode = true,
      notifications,
      onSearchChange,
      onLayoutClick,
      onInfoItemClick,
      onNotificationClick,
      onSettingsItemClick,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const id = useId();
    const { theme, setTheme } = useTheme();
    const isDark: boolean = theme === "dark";

    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchValue || "");
    const [searchResults, setSearchResults] = useState<
      { contentTitle: string; contentUrl: string }[]
    >([]);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    const webSiteContentList = [
      { contentTitle: "Dashboard", contentUrl: "/" },
      { contentTitle: "Projects", contentUrl: "/projects" },
      { contentTitle: "Create New Project", contentUrl: "/create_new_project" },
      { contentTitle: "Main Database", contentUrl: "/main_db" },
      { contentTitle: "Kit Distribution", contentUrl: "/kit" },
      { contentTitle: "Psychoeducation", contentUrl: "/psychoeducation" },
      { contentTitle: "Community Dialogue", contentUrl: "/community_dialogue" },
      { contentTitle: "Training", contentUrl: "/training" },
      { contentTitle: "Referral", contentUrl: "/referral" },
      { contentTitle: "Settings", contentUrl: "/settings" },
      { contentTitle: "Notifications", contentUrl: "/notifications" },
    ];

    const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (!value) {
        setSearchResults([]);
        return;
      }

      const filtered = webSiteContentList.filter((item) =>
        item.contentTitle.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      onSearchChange?.(value);
    };

    return (
      <header
        ref={ref}
        className={cn("border-b px-4 md:px-2 [&_*]:no-underline", className)}
        {...props}
      >
        <div className="flex h-16 items-center w-full justify-between gap-4">
          {/* Left side */}
          <div className="relative flex-1">
            {/* Input + dropdown */}
            <div className="flex flex-row relative w-full max-w-xs">
              <SidebarTrigger />
              <Input
                id={`input-${id}`}
                className="peer h-8 w-full ps-8 pe-2"
                placeholder={searchPlaceholder}
                type="search"
                value={searchQuery}
                onChange={handleGlobalSearch}
              />
              {searchResults.length > 0 && (
                <Card className="absolute top-full left-0 mt-1 w-full max-h-64 overflow-auto z-50 shadow">
                  <CardContent className="p-0">
                    {searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          router.push(item.contentUrl);
                        }}
                      >
                        {item.contentTitle}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {showTestMode && (
              <div className="inline-flex items-center gap-2 max-md:hidden">
                <Label htmlFor={`switch-${id}`} className="text-sm font-medium">
                  Dark Mode
                </Label>
                <Switch
                  id={`switch-${id}`}
                  defaultChecked={isDark}
                  onCheckedChange={() => setTheme(isDark ? "light" : "dark")}
                  className="h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3"
                  aria-label="Toggle dark mode"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground size-8 rounded-full shadow-none"
                aria-label="Open layout menu"
                onClick={(e) => {
                  e.preventDefault();
                  onLayoutClick?.();
                }}
              >
                <LayoutGridIcon size={16} aria-hidden="true" />
              </Button>
              <InfoMenu onItemClick={onInfoItemClick} />
              <NotificationMenu
                notifications={notifications}
                onNotificationClick={onNotificationClick}
              />
              <SettingsMenu onItemClick={onSettingsItemClick} />
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar14.displayName = "Navbar14";

export { InfoMenu, NotificationMenu, SettingsMenu };
