"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { getProgressSnapshot, initProgress, subscribeProgress } from "./progressStore";

export function useProgress() {
  const snap = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressSnapshot
  );

  useEffect(() => {
    initProgress();
  }, []);

  return snap.progress;
}
