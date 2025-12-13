// The component will only create a single instance of class KeyboardManager and one instance of class KeyboardEventHundler.
// and register some keyboard events on window for appling shortcuts on entire system.
// It will automatically remove all the registered listeners from window .

"use client";

import { useEventProvider } from "@/contexts/EventContext";
import KeyboardEventHundler from "@/core/KeyboardEventHundlers";
import { useEffect } from "react";

const GlobaleListenersRegisterer = () => {
  const { KeyboardManager, Events } = useEventProvider();

  useEffect(() => {
    const KEH = new KeyboardEventHundler();

    KeyboardManager.registerKey(
      Events.ShourtcutifyKeyboardEvents.KeyDownEvent.KeyDownEnter,
      KEH.onEnterPressed
    );
    KeyboardManager.registerKey(
      Events.ShourtcutifyKeyboardEvents.KeyDownEvent.KeyDownDelete,
      KEH.onDeletePressed
    );
    KeyboardManager.registerKey(
      Events.ShourtcutifyKeyboardEvents.KeyDownEvent.KeyDownCtrlA,
      KEH.onCtrlPlusAPressed
    );
    KeyboardManager.registerKey(
      Events.ShourtcutifyKeyboardEvents.KeyDownEvent.KeyDownCtrlB,
      KEH.onCtrlPlusBPressed
    );

    KeyboardManager.registerKey(
      Events.ShourtcutifyKeyboardEvents.KeyDownEvent.KeyDownArrowLeft,
      KEH.onArrowLeftPressed
    );

    KeyboardManager.registerKey(
      Events.ShourtcutifyKeyboardEvents.KeyDownEvent.KeyDownArrowRight,
      KEH.onArrowRightPressed
    );

    return () => {
      KeyboardManager.destroy();
    };
  }, []);

  return null;
};

export default GlobaleListenersRegisterer;
