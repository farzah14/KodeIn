import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const THEMES = new Set(["light", "dark", "system"]);

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
      address: true,
      theme: true,
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
    address: user.address ?? "",
    theme: user.theme ?? "system",
    providers,
  });
}

export async function PATCH(req: Request): Promise<Response> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = (await req.json()) as { name?: string; address?: string; theme?: string };

  const dataToUpdate: { name?: string; address?: string; theme?: string } = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (name.length < 2) return Response.json({ error: "NAME_TOO_SHORT" }, { status: 400 });
    if (name.length > 50) return Response.json({ error: "NAME_TOO_LONG" }, { status: 400 });
    dataToUpdate.name = name;
  }

  if (typeof body.address === "string") {
    const address = body.address.trim();
    if (address.length > 200) return Response.json({ error: "ADDRESS_TOO_LONG" }, { status: 400 });
    dataToUpdate.address = address;
  }

  if (typeof body.theme === "string") {
    const theme = body.theme.trim();
    if (!THEMES.has(theme)) return Response.json({ error: "INVALID_THEME" }, { status: 400 });
    dataToUpdate.theme = theme;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return Response.json({ error: "NO_FIELDS" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { email },
    data: dataToUpdate,
    select: { id: true, name: true, email: true, image: true, address: true, theme: true },
  });

  return Response.json(updated);
}
