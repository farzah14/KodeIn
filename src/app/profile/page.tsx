import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#09090b]">
      {/* Background Pattern */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="pointer-events-none fixed top-0 left-1/2 z-0 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/8 via-purple-500/5 to-transparent blur-[100px] dark:from-indigo-500/5 dark:via-purple-500/3"></div>

      <Topbar />
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10">
        <ProfileClient />
      </main>
    </div>
  );
}

