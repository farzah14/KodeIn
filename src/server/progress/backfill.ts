import { prisma } from "@/lib/prisma";
import { content } from "@/lib/content";
import { practiceChallenges } from "@/lib/practiceChallenges";

export async function runBackfill() {
  console.log("Starting progress completion backfill...");
  const progressRows = await prisma.progress.findMany();

  // Create maps for quick XP lookup from canonical catalogs
  const lessonStepXpMap = new Map<string, number>();
  for (const lesson of Object.values(content.lessons)) {
    for (const step of lesson.steps) {
      lessonStepXpMap.set(step.id, step.type === "code" ? 10 : 2);
    }
  }

  const practiceXpMap = new Map<string, number>();
  for (const challenge of practiceChallenges) {
    practiceXpMap.set(challenge.id, challenge.xp);
  }

  let totalLessonsBackfilled = 0;
  let totalPracticesBackfilled = 0;

  for (const row of progressRows) {
    try {
      const completed = JSON.parse(row.completedJson || "{}");
      const lessonCompletions = new Map<string, {
        userId: string;
        kind: "LESSON_STEP";
        activityId: string;
        xpAwarded: number;
      }>();
      const practiceCompletions = new Map<string, {
        userId: string;
        kind: "PRACTICE";
        activityId: string;
        xpAwarded: number;
      }>();

      for (const [key, value] of Object.entries(completed)) {
        if (key === "practice") {
          if (Array.isArray(value)) {
            for (const challengeId of value) {
              if (typeof challengeId !== "string") continue;
              const xp = practiceXpMap.get(challengeId);
              if (xp === undefined) continue;
              practiceCompletions.set(challengeId, {
                userId: row.userId,
                kind: "PRACTICE",
                activityId: challengeId,
                xpAwarded: xp,
              });
            }
          }
        } else if (value === true) {
          const xp = lessonStepXpMap.get(key);
          if (xp === undefined) continue;
          lessonCompletions.set(key, {
            userId: row.userId,
            kind: "LESSON_STEP",
            activityId: key,
            xpAwarded: xp,
          });
        }
      }

      if (lessonCompletions.size > 0) {
        const result = await prisma.completion.createMany({
          data: [...lessonCompletions.values()],
          skipDuplicates: true,
        });
        totalLessonsBackfilled += result.count;
      }

      if (practiceCompletions.size > 0) {
        const result = await prisma.completion.createMany({
          data: [...practiceCompletions.values()],
          skipDuplicates: true,
        });
        totalPracticesBackfilled += result.count;
      }
    } catch (error) {
      console.error("Failed to backfill progress for a user row:", error);
    }
  }

  console.log(`Backfill completed: ${totalLessonsBackfilled} lessons, ${totalPracticesBackfilled} practices backfilled.`);
}
