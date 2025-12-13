"use client";

import KeyboardManager from "@/core/KeyboardManager";
import { ShourtcutifyEvents } from "@/enums/Enums";
import React, { createContext, useContext, ReactNode } from "react";

type EventContextType = {
  KeyboardManager: KeyboardManager;
  Events: typeof ShourtcutifyEvents;
};

const defaultValue: EventContextType = {
  KeyboardManager: new KeyboardManager(),
  Events: ShourtcutifyEvents,
};

const EventContext = createContext<EventContextType>(defaultValue);

type EventProviderPropsType = {
  children: ReactNode;
};

export const EventProvider = ({ children }: EventProviderPropsType) => {
  return (
    <EventContext.Provider value={{ ...defaultValue }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventProvider = () => useContext(EventContext);
