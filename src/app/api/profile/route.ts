import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      accounts: { select: { provider: true } },
    },
  });

  if (!user) return Response.json({ error: "USER_NOT_FOUND" }, { status: 404 });

  const providers = Array.from(new Set(user.accounts.map((a) => a.provider)));

  return Response.json({
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    providers,
  });
}

export async function PATCH(req: Request): Promise<Response> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = (await req.json()) as { name?: string };
  const name = (body.name ?? "").trim();

  if (name.length < 2) {
    return Response.json({ error: "NAME_TOO_SHORT" }, { status: 400 });
  }
  if (name.length > 50) {
    return Response.json({ error: "NAME_TOO_LONG" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { name },
    select: { id: true, name: true, email: true, image: true },
  });

  return Response.json(updated);
}
