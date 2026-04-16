import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const THEMES = new Set(["light", "dark", "system"]);

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

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

  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

  const providers = Array.from(new Set(user.accounts.map((a: { provider: string }) => a.provider)));

  return NextResponse.json({
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    address: user.address ?? "",
    theme: user.theme ?? "system",
    providers,
  });
}

export async function PATCH(req: Request): Promise<NextResponse> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = (await req.json()) as { 
    name?: string; 
    address?: string; 
    theme?: string; 
    image?: string; 
  };

  const dataToUpdate: { 
    name?: string; 
    address?: string; 
    theme?: string; 
    image?: string; 
  } = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (name.length < 2) return NextResponse.json({ error: "NAME_TOO_SHORT" }, { status: 400 });
    if (name.length > 50) return NextResponse.json({ error: "NAME_TOO_LONG" }, { status: 400 });
    dataToUpdate.name = name;
  }

  if (typeof body.address === "string") {
    const address = body.address.trim();
    if (address.length > 200) return NextResponse.json({ error: "ADDRESS_TOO_LONG" }, { status: 400 });
    dataToUpdate.address = address;
  }

  if (typeof body.theme === "string") {
    const theme = body.theme.trim();
    if (!THEMES.has(theme)) return NextResponse.json({ error: "INVALID_THEME" }, { status: 400 });
    dataToUpdate.theme = theme;
  }

  if (typeof body.image === "string") {
    const image = body.image.trim();
    if (image.length > 2000000) return NextResponse.json({ error: "IMAGE_TOO_LARGE" }, { status: 400 });
    dataToUpdate.image = image;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return NextResponse.json({ error: "NO_FIELDS" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { email },
    data: dataToUpdate,
    select: { id: true, name: true, email: true, image: true, address: true, theme: true },
  });

  return NextResponse.json(updated);
}