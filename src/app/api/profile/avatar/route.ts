import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "FILE_REQUIRED" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return Response.json({ error: "INVALID_FILE_TYPE" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return Response.json({ error: "USER_NOT_FOUND" }, { status: 404 });

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `avatar-${user.id}-${Date.now()}.${ext}`;
  const absPath = path.join(uploadsDir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(absPath, Buffer.from(bytes));

  const publicUrl = `/uploads/${filename}`;

  await prisma.user.update({
    where: { id: user.id },
    data: { image: publicUrl },
  });

  return Response.json({ image: publicUrl });
}
