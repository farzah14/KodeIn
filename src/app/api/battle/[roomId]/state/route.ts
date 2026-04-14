import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const safeClose = () => {
        if (isClosed) return;
        isClosed = true;
        try { controller.close(); } catch (e) {}
      };

      const sendState = async () => {
        if (isClosed) return;
        try {
          const room = await prisma.battleRoom.findUnique({
            where: { id: roomId }
          });

          if (!room) {
            if (!isClosed) {
              controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "ROOM_NOT_FOUND" })}\n\n`));
              safeClose();
            }
            return;
          }

          const p1 = await prisma.user.findUnique({ where: { id: room.player1Id }, select: { name: true, image: true } });
          const p2 = room.player2Id ? await prisma.user.findUnique({ where: { id: room.player2Id }, select: { name: true, image: true } }) : null;

          const state = {
            ...room,
            player1: p1,
            player2: p2,
          };

          if (!isClosed) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(state)}\n\n`));
          }
        } catch (e) {
          console.error("SSE Stream Error:", e);
          safeClose();
        }
      };

      // Initial send
      await sendState();

      // Poll matching periodically
      const interval = setInterval(async () => {
        await sendState();
      }, 2000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        safeClose();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
