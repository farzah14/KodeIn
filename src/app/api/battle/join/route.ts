import { auth } from "@/auth";
import { joinBattle } from "@/server/battle/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  try {
    const { roomId } = await req.json();
    if (!roomId) return NextResponse.json({ error: "roomId is required" }, { status: 400 });

    const result = await joinBattle(roomId, userId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
