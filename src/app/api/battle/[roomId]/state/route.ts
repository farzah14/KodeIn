import { auth } from "@/auth";
import { getBattle } from "@/server/battle/actions";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Response("UNAUTHORIZED", { status: 401 });
  }

  const { roomId } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      let interval: NodeJS.Timeout | null = null;

      const safeClose = () => {
        if (isClosed) return;
        isClosed = true;
        try { controller.close(); } catch {}
      };

      const sendState = async () => {
        if (isClosed) return;
        try {
          const state = await getBattle(roomId, userId);

          if (!state) {
            if (!isClosed) {
              controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "ROOM_NOT_FOUND" })}\n\n`));
              safeClose();
            }
            return;
          }

          if (!isClosed) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(state)}\n\n`));
          }
        } catch (e) {
          console.error("SSE Stream Error:", e);
          if (interval) clearInterval(interval);
          safeClose();
        }
      };

      // Initial send
      await sendState();

      // Poll matching periodically
      interval = setInterval(async () => {
        if (isClosed) {
          if (interval) clearInterval(interval);
          return;
        }
        await sendState();
      }, 2000);

      req.signal.addEventListener("abort", () => {
        if (interval) clearInterval(interval);
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
