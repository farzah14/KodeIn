import type { CompletionKind, Progress } from "@prisma/client";

export type ProgressDTO = {
  completedStepIds: Record<string, boolean | string[]>;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveISO?: string;
  };
};

type CompletionRow = Pick<Progress, never> & {
  kind: CompletionKind;
  activityId: string;
};

export function buildProgressDTO(
  progress: Pick<Progress, "xp" | "streakCurrent" | "streakLongest" | "lastActiveISO">,
  completions: readonly CompletionRow[]
): ProgressDTO {
  const completedStepIds: Record<string, boolean | string[]> = {};
  const practiceCompleted: string[] = [];

  for (const completion of completions) {
    if (completion.kind === "LESSON_STEP") {
      completedStepIds[completion.activityId] = true;
    } else if (completion.kind === "PRACTICE") {
      practiceCompleted.push(completion.activityId);
    }
  }

  completedStepIds.practice = practiceCompleted;

  return {
    completedStepIds,
    xp: progress.xp ?? 0,
    streak: {
      current: progress.streakCurrent ?? 0,
      longest: progress.streakLongest ?? 0,
      lastActiveISO: progress.lastActiveISO ?? undefined,
    },
  };
}
