import Nav from "@/components/portfolio/layout/Nav";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a0f] text-white font-sans">
      <Nav />
      <main>{children}</main>
    </div>
  );
}