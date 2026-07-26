export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "ml" | "cloud";
  level: number;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  category: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  type: "engineer" | "analyst" | "ml";
}

export const bio = {
  name: "KodeIn Developer",
  title: "Data Engineer / Data Analyst / ML Engineer",
  summary:
    "I design and build data systems that turn raw information into actionable intelligence. From streaming pipelines to ML models, I work across the full data stack.",
  stats: {
    yearsExperience: 5,
    projectsShipped: 12,
    technologies: 15,
  },
  email: "hello@kodein.dev",
  github: "https://github.com/kodein",
  linkedin: "https://linkedin.com/in/kodein",
};

export const skills: Skill[] = [
  { name: "Python", category: "language", level: 5, icon: "python" },
  { name: "SQL", category: "language", level: 5, icon: "sql" },
  { name: "TypeScript", category: "language", level: 3, icon: "typescript" },
  { name: "Spark", category: "framework", level: 4, icon: "spark" },
  { name: "Airflow", category: "tool", level: 4, icon: "airflow" },
  { name: "dbt", category: "tool", level: 4, icon: "dbt" },
  { name: "TensorFlow", category: "ml", level: 3, icon: "tensorflow" },
  { name: "PyTorch", category: "ml", level: 3, icon: "pytorch" },
  { name: "scikit-learn", category: "ml", level: 3, icon: "sklearn" },
  { name: "AWS", category: "cloud", level: 3, icon: "aws" },
  { name: "Docker", category: "tool", level: 3, icon: "docker" },
  { name: "Kafka", category: "tool", level: 2, icon: "kafka" },
  { name: "PostgreSQL", category: "tool", level: 4, icon: "postgres" },
  { name: "Redis", category: "tool", level: 2, icon: "redis" },
  { name: "GCP", category: "cloud", level: 2, icon: "gcp" },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "Real-Time Data Pipeline",
    description:
      "Built an end-to-end streaming data pipeline with Kafka, Spark Streaming, and Airflow for real-time analytics on user behavior data.",
    tech: ["Kafka", "Spark", "Airflow", "Python"],
    github: "https://github.com/kodein",
    demo: "https://demo.example.com",
    category: "data-engineering",
  },
  {
    id: "proj-2",
    title: "ML Fraud Detection Model",
    description:
      "Developed a gradient-boosted fraud detection model with 96% precision serving 10M+ transactions daily via a Flask API on GCP.",
    tech: ["Python", "scikit-learn", "GCP", "PostgreSQL"],
    github: "https://github.com/kodein",
    demo: "https://demo.example.com",
    category: "ml",
  },
  {
    id: "proj-3",
    title: "Data Warehouse & Dashboard",
    description:
      "Designed and implemented a dimensional data warehouse with dbt transformations and interactive Tableau dashboards for executive reporting.",
    tech: ["dbt", "PostgreSQL", "Tableau", "SQL"],
    github: "https://github.com/kodein",
    demo: "https://demo.example.com",
    category: "analytics",
  },
  {
    id: "proj-4",
    title: "ML Recommendation Engine",
    description:
      "Built a collaborative filtering recommendation engine using PyTorch that improved user engagement by 34%. Deployed on AWS SageMaker.",
    tech: ["PyTorch", "AWS", "Python", "Redis"],
    github: "https://github.com/kodein",
    demo: "https://demo.example.com",
    category: "ml",
  },
];

export const experience: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Data Engineer",
    company: "TechCorp",
    period: "2022 — Present",
    description:
      "Lead data pipeline architecture, migrated 50+ batch jobs to streaming, reduced pipeline latency by 60%.",
    type: "engineer",
  },
  {
    id: "exp-2",
    role: "Data Analyst",
    company: "DataCo",
    period: "2020 — 2022",
    description:
      "Built automated reporting dashboards, performed ad-hoc analysis for executive team, established data quality metrics.",
    type: "analyst",
  },
  {
    id: "exp-3",
    role: "ML Engineer",
    company: "AIStart",
    period: "2019 — 2020",
    description:
      "Developed NLP pipeline for customer feedback, implemented ML models for churn prediction, deployed models to production.",
    type: "ml",
  },
];
