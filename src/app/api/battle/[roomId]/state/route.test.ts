import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { auth } from "@/auth";
import { getBattle } from "@/server/battle/actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/server/battle/actions", () => ({ getBattle: vi.fn() }));

describe("GET /api/battle/[roomId]/state", () => {
  it("returns HTTP 403 when the authenticated user is not a participant", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "spectator" } } as never);
    vi.mocked(getBattle).mockResolvedValue(null);

    const response = await GET(
      new NextRequest("http://localhost/api/battle/room-1/state"),
      { params: Promise.resolve({ roomId: "room-1" }) }
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("FORBIDDEN");
  });
});
