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
      const completionsToCreate: {
        userId: string;
        kind: "LESSON_STEP" | "PRACTICE";
        activityId: string;
        xpAwarded: number;
      }[] = [];

      for (const [key, value] of Object.entries(completed)) {
        if (key === "practice") {
          if (Array.isArray(value)) {
            for (const challengeId of value) {
              const xp = practiceXpMap.get(challengeId) || 20; // fallback default
              completionsToCreate.push({
                userId: row.userId,
                kind: "PRACTICE",
                activityId: challengeId,
                xpAwarded: xp,
              });
              totalPracticesBackfilled++;
            }
          }
        } else if (value === true) {
          const xp = lessonStepXpMap.get(key) || 2; // fallback default
          completionsToCreate.push({
            userId: row.userId,
            kind: "LESSON_STEP",
            activityId: key,
            xpAwarded: xp,
          });
          totalLessonsBackfilled++;
        }
      }

      if (completionsToCreate.length > 0) {
        // Skip duplicates to ensure idempotency and safety
        await prisma.completion.createMany({
          data: completionsToCreate,
          skipDuplicates: true,
        });
      }
    } catch (error) {
      console.error("Failed to backfill progress for a user row:", error);
    }
  }

  console.log(`Backfill completed: ${totalLessonsBackfilled} lessons, ${totalPracticesBackfilled} practices backfilled.`);
}
