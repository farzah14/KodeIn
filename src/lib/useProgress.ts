"use client";

import { useSyncExternalStore } from "react";
import { defaultProgress, getProgressSnapshot, subscribeProgress } from "./storage";

export function useProgress() {
  return useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    () => defaultProgress
  );
}
