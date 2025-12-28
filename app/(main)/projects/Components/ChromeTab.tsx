"use client";

import React, { useState, useEffect, useRef } from "react";

interface Tab {
  id: number;
  value: string;
  title: string;
  stateSetter: (value: string) => void;
  icon?: React.ReactNode;
}

interface InputTab {
  value: string;
  title: string;
  stateSetter: (value: string) => void;
  icon?: React.ReactNode;
}

interface ChromeTabsProps {
  initialTabs: InputTab[];
}

const ChromeTabs: React.FC<ChromeTabsProps> = ({ initialTabs }) => {

  const [tabs, setTabs] = useState<Tab[]>(
    initialTabs.map((tab, index) => ({ id: index, ...tab }))
  );
  const [activeTabId, setActiveTabId] = useState<number>(
    initialTabs.map((tab, index) => ({ id: index, ...tab }))[0].id
  );

  useEffect(() => {
    setTabs(initialTabs.map((tab, index) => ({ id: index, ...tab })));
  }, [initialTabs]);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-start min-h-[40px] mx-auto rounded-lg bg-background w-full overflow-hidden pt-1 relative">
      {/* Tabs */}
      <div
        ref={containerRef}
        className="flex flex-row flex-grow whitespace-nowrap w-full  mx-auto overflow-auto  z-50"
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`chrome-tab w-[100%] relative cursor-pointer ${
              activeTabId === tab.id ? "z-2" : ""
            }`}
          >
            <div
              className={`chrome-tab-inner flex items-center text-center gap-1 px-4 py-1  transition-all ${
                activeTabId === tab.id
                  ? `bg-primary rounded-t-lg ${
                      activeTabId == tabs.length - 1 ? "rounded-r-lg" : ""
                    }`
                  : `bg-gray-400 hover:bg-gray-300 ${
                      activeTabId - 1 == tab.id
                        ? "rounded-r-lg"
                        : activeTabId + 1 == tab.id
                        ? "rounded-l-lg"
                        : ""
                    }`
              }`}
              onClick={() => {
                setActiveTabId(tab.id);
                tab.stateSetter(tab.value);
              }}
            >
              <span className="icon text-gray-700">{tab.icon}</span>
              <span
                className={`mx-auto w-full text-md ${
                  activeTabId == tab.id ? "text-white" : "text-black"
                }`}
              >
                {tab.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary h-3 w-full absolute top-7 z-1"></div>
    </div>
  );
};

export default ChromeTabs;
