import { auth } from "@/auth";
import { submitCode } from "@/server/battle/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { roomId } = await params;
  
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "code is required" }, { status: 400 });

    const result = await submitCode(roomId, userId, code);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
