import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <ProfileClient />
    </main>
  );
}
