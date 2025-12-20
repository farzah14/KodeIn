"use client";

import Link from "next/link";
import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";

type NodeState = "completed" | "available" | "locked";

function NodeIcon({ state }: { state: NodeState }) {
  if (state === "completed") {
    return (
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-900 text-white shadow-sm">
        ✓
      </div>
    );
  }
  if (state === "locked") {
    return (
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-400">
        •
      </div>
    );
  }
  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm">
      ▶
    </div>
  );
}

function LessonCard({
  title,
  subtitle,
  pct,
  state,
}: {
  title: string;
  subtitle: string;
  pct: number;
  state: NodeState;
}) {
  return (
    <div
      className={[
        "w-full max-w-[360px] rounded-3xl border bg-white p-4 shadow-sm transition",
        state === "available" ? "hover:shadow-md" : "",
        state === "locked" ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="mt-1 text-xs text-gray-500">{subtitle}</div>
        </div>
        <div className="text-xs font-medium text-gray-500">
          {state === "locked" ? "Locked" : state === "completed" ? "Done" : "Start"}
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
        <div className="h-2 rounded-full bg-gray-900" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PathMap() {
  const p = useProgress();

  const units = content.course.unitIds
    .map((id) => content.units[id])
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-10">
      {units.map((unit) => {
        const lessons = unit.lessonIds
          .map((lid) => content.lessons[lid])
          .sort((a, b) => a.order - b.order);

        const unitTotalSteps = lessons.reduce((acc, l) => acc + l.steps.length, 0);
        const unitCompletedSteps = lessons.reduce(
          (acc, l) => acc + l.steps.filter((s) => p.completedStepIds[s.id]).length,
          0
        );

        const unitPct = unitTotalSteps === 0 ? 0 : Math.round((unitCompletedSteps / unitTotalSteps) * 100);

        return (
          <section key={unit.id} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500">Unit {unit.order}</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{unit.title}</div>
                <div className="mt-1 text-sm text-gray-600">
                  {unitCompletedSteps}/{unitTotalSteps} steps • <span className="font-semibold">{unitPct}%</span>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm">
                <div className="text-xs text-gray-500">Progress</div>
                <div className="text-lg font-semibold text-gray-900">{unitPct}%</div>
              </div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-gray-900" style={{ width: `${unitPct}%` }} />
            </div>

            {lessons.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                Coming soon.
              </div>
            ) : (
              <div className="relative mt-8">
                {/* “spine” line */}
                <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gray-200 md:block" />

                <div className="space-y-6">
                  {lessons.map((lesson, idx) => {
                    const totalSteps = lesson.steps.length;
                    const completedSteps = lesson.steps.filter((s) => p.completedStepIds[s.id]).length;
                    const done = completedSteps === totalSteps;

                    // unlock rule: lesson pertama available; lesson berikutnya available jika prev done
                    const prev = lessons[idx - 1];
                    const prevDone = !prev ? true : prev.steps.every((s) => p.completedStepIds[s.id]);

                    const state: NodeState = done ? "completed" : prevDone ? "available" : "locked";

                    const pct = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

                    const left = idx % 2 === 0; // zig-zag
                    const rowClass = left ? "md:justify-start" : "md:justify-end";

                    const node = (
                      <div className="flex w-full items-center gap-4 md:w-1/2">
                        <NodeIcon state={state} />
                        <LessonCard
                          title={lesson.title}
                          subtitle={`${completedSteps}/${totalSteps} steps`}
                          pct={pct}
                          state={state}
                        />
                      </div>
                    );

                    return (
                      <div key={lesson.id} className={`flex justify-center ${rowClass}`}>
                        {/* mobile: always centered */}
                        {state === "locked" ? (
                          <div className="w-full md:w-auto">{node}</div>
                        ) : (
                          <Link href={`/learn/${lesson.id}`} className="w-full md:w-auto">
                            {node}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
