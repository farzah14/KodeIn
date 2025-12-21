"use client";

export type ProgressDTO = {
  completedStepIds: Record<string, boolean>;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveISO?: string;
  };
};

type Snap = {
  status: "idle" | "loading" | "ready" | "error";
  progress: ProgressDTO;
};

const empty: ProgressDTO = {
  completedStepIds: {},
  xp: 0,
  streak: { current: 0, longest: 0 },
};

let snap: Snap = { status: "idle", progress: empty };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeProgress(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getProgressSnapshot() {
  return snap;
}

export async function initProgress() {
  if (snap.status === "loading" || snap.status === "ready") return;

  snap = { ...snap, status: "loading" };
  emit();

  try {
    const res = await fetch("/api/progress", { cache: "no-store" });
    if (!res.ok) throw new Error(`GET /api/progress failed: ${res.status}`);
    const data = (await res.json()) as ProgressDTO;

    snap = { status: "ready", progress: data };
    emit();
  } catch {
    snap = { ...snap, status: "error" };
    emit();
  }
}

export async function completeStep(stepId: string, xpEarned: number) {
  const res = await fetch("/api/progress/complete-step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ stepId, xpEarned }),
  });

  if (!res.ok) throw new Error(`POST /api/progress/complete-step failed: ${res.status}`);

  const data = (await res.json()) as ProgressDTO;
  snap = { status: "ready", progress: data };
  emit();

  return data;
}

export function resetProgressStore() {
  snap = { status: "idle", progress: empty };
  emit();
}
