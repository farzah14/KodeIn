import HeroSection from "@/components/portfolio/hero/HeroSection";
import AboutSection from "@/components/portfolio/about/AboutSection";
import SkillsSection from "@/components/portfolio/skills/SkillsSection";
import ProjectsSection from "@/components/portfolio/projects/ProjectsSection";
import ExperienceSection from "@/components/portfolio/experience/ExperienceSection";
import ContactSection from "@/components/portfolio/contact/ContactSection";

export const metadata = {
  title: "Portfolio — Data Engineer / Analyst / ML Engineer",
  description: "3D interactive portfolio showcasing data engineering, analytics, and machine learning work",
};

export default function PortfolioPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}