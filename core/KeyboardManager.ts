"use client";

import {
  IsAltKeyPressed,
  IsCtrlKeyPressed,
  IsDefined,
  IsMetaKeyPressed,
  IsShiftKeyPressed,
} from "@/constants/Constants";
import ShourtcutifyConstants from "@/constants/ShourtcutifyConstants";
import {
  ShourtcutifyModifierKeys,
  ShourtcutifySupportedEvents,
} from "@/enums/Enums";
import Lexer from "@/lexer/lexer";
import "@/types/ShourtcutifyTypes";
import {
  ShourtcutifyEventKeysType,
  ShourtcutifyIdentifiersType,
  ShourtcutifyKeysType,
  ShourtcutifyModifierKeysType,
  ShourtcutifySupportedEventsType,
} from "@/types/ShourtcutifyTypes";

class KeyboardManager {
  private keyMap: Partial<Record<any, VoidFunction>> = {};
  private shouldPreventKeys: ShourtcutifyKeysType[] = [];

  private occurredEvent: ShourtcutifySupportedEventsType | null = null;

  private globalEvent: KeyboardEvent | null = null;

  private pressedKeys: string[] = [];

  constructor() {
    this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);
    window.addEventListener("keydown", this.handleKeyboardEvent);
    window.addEventListener("keyup", this.handleKeyboardEvent);
  }

  public registerKey(key: string, callback: VoidFunction) {
    this.keyMap[key] = callback;
  }

  public registerShouldPrevents(
    key: ShourtcutifyKeysType | ShourtcutifyKeysType[]
  ) {
    if (Array.isArray(key)) {
      this.shouldPreventKeys = key;
      return;
    }

    this.shouldPreventKeys.push(key);
  }

  private handleKeyboardEvent(e: KeyboardEvent) {
    this.occurredEvent = e.type as ShourtcutifySupportedEvents;
    this.globalEvent = e;

    const key: ShourtcutifyKeysType = this.generateSuitableKey(e);

    if (this.checkIfShouldBePrevent(key as unknown as ShourtcutifyKeysType)) {
      e.preventDefault();
      return;
    }

    this.test(e.key);

    const callback: VoidFunction | undefined = this.getSuitableCallback(key);
    if (IsDefined(callback)) {
      callback();
      this.globalEvent?.preventDefault();
    }
  }

  private generateSuitableKey(e: KeyboardEvent): ShourtcutifyKeysType {
    const mainKey: ShourtcutifyEventKeysType = [
      IsCtrlKeyPressed(e.ctrlKey) ? "ctrl" : "",
      IsAltKeyPressed(e.altKey) ? "alt" : "",
      IsShiftKeyPressed(e.shiftKey) ? "shift" : "",
      IsMetaKeyPressed(e.metaKey) ? "meta" : "",
      this.checkIfTheMainKeyISModifierKeyInKeyDownEvent(e.key.toLowerCase())
        ? ""
        : e.key.toLowerCase() == "control"
        ? "ctrl"
        : e.key.toLowerCase(),
    ]
      .filter(Boolean)
      .join("+") as ShourtcutifyEventKeysType;

    const identifier: ShourtcutifyIdentifiersType =
      this.generateSuitableIdentifier(e);

    return (identifier + "-" + mainKey) as ShourtcutifyKeysType;
  }

  private generateSuitableIdentifier(
    e: KeyboardEvent
  ): ShourtcutifyIdentifiersType {
    return e.type as ShourtcutifyIdentifiersType;
  }

  private getSuitableCallback(
    key: ShourtcutifyKeysType
  ): VoidFunction | undefined {
    const callback: VoidFunction | undefined = this.keyMap[key];
    return callback;
  }

  private checkIfTheMainKeyISModifierKeyInKeyDownEvent(
    key: any
  ): key is ShourtcutifyModifierKeysType {
    if (this.occurredEvent == ("keyup" as ShourtcutifySupportedEvents))
      return false;
    return Object.values(ShourtcutifyModifierKeys).includes(key);
  }

  private checkIfShouldBePrevent(key: ShourtcutifyKeysType): boolean {
    if (this.shouldPreventKeys.includes(key)) return true;
    return false;
  }

  private test(key: string) {
    if (this.occurredEvent == ("keydown" as ShourtcutifySupportedEvents)) {
      this.pressedKeys.push(key);
      const finalKey: any = this.pressedKeys.join("->");

      const isKeyRegestered: boolean = Object.keys(this.keyMap).includes(
        finalKey
      );

      if (isKeyRegestered) {
        const callback: VoidFunction | undefined =
          this.getSuitableCallback(finalKey);
        if (IsDefined(callback)) {
          callback();
          this.globalEvent?.preventDefault();
        }
      }
    } else this.pressedKeys.pop();
  }

  public destroy() {
    window.removeEventListener("keydown", this.handleKeyboardEvent);
  }
}

export default KeyboardManager;
