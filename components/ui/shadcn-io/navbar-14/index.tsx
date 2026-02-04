"use client";

import * as React from "react";
import { useEffect, useId, useState } from "react";
import NotificationMenu from "./NotificationMenu";
import SettingsMenu from "./SettingsMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../../sidebar";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../card";
import { useParentContext } from "@/contexts/ParentContext";
import SubmitSummary from "../submitSummary";
import { webSiteContentList } from "@/constants/SingleAndMultiSelectOptionsList";
import { Navbar14Props, Notification } from "@/interfaces/Interfaces";
import { SIDEBAR_OPEN_TOGGLER_PROVIDER } from "@/config/System";

export const Navbar14 = React.forwardRef<HTMLElement, Navbar14Props>(
  (
    {
      className,
      searchPlaceholder = "Search...",
      searchValue,
      showTestMode = true,
      onSearchChange,
      onLayoutClick,
      onInfoItemClick,
      ...props
    },
    ref,
  ) => {
    const {
      notifications,
      setNotifications,
      requestHandler,
      reqForToastAndSetMessage,
    } = useParentContext();
    const router = useRouter();
    const id = useId();
    const { theme, setTheme } = useTheme();
    const isDark: boolean = theme === "dark";

    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchValue || "");
    const [searchResults, setSearchResults] = useState<
      { contentTitle: string; contentUrl: string }[]
    >([]);

    const [reqForSubmittedDatabaseSummary, setReqForSubmittedDatabaseSummary] =
      useState<boolean>(false);

    const [databaseId, setDatabaseId] = useState<string | null>(null);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (!value) {
        setSearchResults([]);
        return;
      }

      const filtered = webSiteContentList.filter((item) =>
        item.contentTitle.toLowerCase().includes(value.toLowerCase()),
      );
      setSearchResults(filtered);
      onSearchChange?.(value);
    };

    const onNotificationClick = (notification: Notification) => {
      if (notification.unread) {
        requestHandler()
          .post(`/notification/mark_as_read/${notification.id}`)
          .then((response: any) =>
            setNotifications((prev: Notification[]) =>
              prev.map((n) =>
                n.id == notification.id ? { ...n, unread: !n.unread } : n,
              ),
            ),
          )
          .catch((error: any) =>
            reqForToastAndSetMessage(error.response.data.message, "error"),
          );
      }

      switch (notification.type) {
        case "project":
          if (notification.project_id)
            router.push(`/projects/project_show/${notification.project_id}`);
          break;
        case "submittedDatabase":
          if (notification.apr_id) {
            setDatabaseId(notification.apr_id);
            setReqForSubmittedDatabaseSummary(true);
          }
          break;
        case "approvedDatabase":
          if (notification.apr_id) setDatabaseId(notification.apr_id);
          setReqForSubmittedDatabaseSummary(true);
          break;
        case "reviewdApr":
          if (notification.apr_id) setDatabaseId(notification.apr_id);
          setReqForSubmittedDatabaseSummary(true);
          break;
        case "approvedApr":
          if (notification.apr_id) setDatabaseId(notification.apr_id);
          setReqForSubmittedDatabaseSummary(true);
          break;
      }
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
              <SidebarTrigger id={SIDEBAR_OPEN_TOGGLER_PROVIDER} />
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
              <NotificationMenu
                notifications={notifications}
                onNotificationClick={onNotificationClick}
              />
            </div>
          </div>
          {reqForSubmittedDatabaseSummary && databaseId && (
            <SubmitSummary
              open={reqForSubmittedDatabaseSummary}
              onOpenChange={setReqForSubmittedDatabaseSummary}
              databaseId={databaseId as unknown as string}
            />
          )}
        </div>
      </header>
    );
  },
);

Navbar14.displayName = "Navbar14";

export { NotificationMenu, SettingsMenu };
