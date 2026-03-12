import skillResourcesData from "@/data/skillResources.json";

export interface LearningResource {
  title: string;
  url: string;
  type: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface RoadmapItem {
  skill: string;
  resources: LearningResource[];
  projectIdeas: ProjectIdea[];
}

type SkillResourceMap = Record<string, { resources?: LearningResource[]; projectIdeas?: ProjectIdea[] }>;
const resourceMap = skillResourcesData as SkillResourceMap;

// ── Default project ideas for common skills ───────────────────
const DEFAULT_PROJECT_IDEAS: Record<string, ProjectIdea[]> = {
  Python: [
    { title: "CLI Task Manager", description: "Build a command-line task manager with file persistence", difficulty: "Beginner" },
    { title: "Web Scraper", description: "Scrape and aggregate news articles with BeautifulSoup", difficulty: "Intermediate" },
  ],
  JavaScript: [
    { title: "Todo App", description: "Classic todo list with localStorage persistence", difficulty: "Beginner" },
    { title: "Real-time Chat", description: "Chat app using WebSockets", difficulty: "Intermediate" },
  ],
  TypeScript: [
    { title: "Type-safe API Client", description: "Build a strongly typed REST client with Zod validation", difficulty: "Intermediate" },
    { title: "CLI Tool", description: "Create a developer CLI tool with typed config", difficulty: "Beginner" },
  ],
  React: [
    { title: "GitHub Profile Viewer", description: "Fetch and display any GitHub user profile and repos", difficulty: "Beginner" },
    { title: "Kanban Board", description: "Drag-and-drop project management board", difficulty: "Intermediate" },
  ],
  "Next.js": [
    { title: "Blog Platform", description: "MDX-powered blog with SSG and dynamic routes", difficulty: "Intermediate" },
    { title: "SaaS Dashboard", description: "Full-stack SaaS starter with auth and billing", difficulty: "Advanced" },
  ],
  Docker: [
    { title: "Dockerize a Node App", description: "Containerise an Express API with multi-stage builds", difficulty: "Beginner" },
    { title: "Docker Compose Stack", description: "Run Postgres + Redis + API together with Compose", difficulty: "Intermediate" },
  ],
  Kubernetes: [
    { title: "Deploy a Microservice", description: "Deploy a containerised app on a local k3s cluster", difficulty: "Intermediate" },
    { title: "K8s Autoscaling Demo", description: "Set up HPA and load-test your deployment", difficulty: "Advanced" },
  ],
  "Machine Learning": [
    { title: "House Price Predictor", description: "Regression model on the Kaggle Boston Housing dataset", difficulty: "Beginner" },
    { title: "Image Classifier", description: "CNN that classifies CIFAR-10 with ≥85% accuracy", difficulty: "Intermediate" },
  ],
  PostgreSQL: [
    { title: "E-commerce Schema", description: "Design & implement a normalised product/order schema", difficulty: "Beginner" },
    { title: "Query Optimisation Lab", description: "Analyse and optimise slow queries with EXPLAIN ANALYSE", difficulty: "Intermediate" },
  ],
  "Node.js": [
    { title: "REST API", description: "CRUD REST API with Express and PostgreSQL", difficulty: "Beginner" },
    { title: "File Upload Service", description: "Multipart file upload microservice with S3", difficulty: "Intermediate" },
  ],
  Rust: [
    { title: "CLI JSON Formatter", description: "Fast command-line JSON pretty-printer in Rust", difficulty: "Beginner" },
    { title: "HTTP Server from Scratch", description: "Build a minimal HTTP/1.1 server using std::net", difficulty: "Advanced" },
  ],
  Go: [
    { title: "URL Shortener", description: "Fast URL shortener with Redis backend", difficulty: "Beginner" },
    { title: "gRPC Microservices", description: "Two gRPC services communicating with protobuf", difficulty: "Intermediate" },
  ],
  Solidity: [
    { title: "ERC-20 Token", description: "Deploy a custom token on an Ethereum testnet", difficulty: "Beginner" },
    { title: "NFT Marketplace", description: "Build a minimal NFT mint + trade smart contract", difficulty: "Intermediate" },
  ],
  Verilog: [
    { title: "4-bit ALU", description: "Design and simulate a 4-bit ALU in Verilog", difficulty: "Beginner" },
    { title: "UART Controller", description: "Implement a full UART Tx/Rx module with testbench", difficulty: "Intermediate" },
  ],
  VHDL: [
    { title: "7-Segment Display Driver", description: "Drive a 7-segment display using VHDL state machine", difficulty: "Beginner" },
    { title: "SPI Master Controller", description: "Full SPI master with configurable clock polarity", difficulty: "Intermediate" },
  ],
  C: [
    { title: "Shell in C", description: "Build a minimal Unix shell with fork/exec", difficulty: "Intermediate" },
    { title: "Memory Allocator", description: "Implement malloc/free from scratch", difficulty: "Advanced" },
  ],
  "C++": [
    { title: "Game Engine ECS", description: "Simple Entity Component System in C++17", difficulty: "Intermediate" },
    { title: "Thread Pool", description: "Lock-free thread pool implementation", difficulty: "Advanced" },
  ],
  Unity: [
    { title: "2D Platformer", description: "Classic side-scrolling platformer with animations", difficulty: "Beginner" },
    { title: "Multiplayer Shooter", description: "Networked top-down shooter with Photon", difficulty: "Advanced" },
  ],
  Flutter: [
    { title: "Weather App", description: "Fetch and display weather data from OpenWeatherMap", difficulty: "Beginner" },
    { title: "Notes App", description: "CRUD notes with local SQLite database", difficulty: "Beginner" },
  ],
  Swift: [
    { title: "To-do List iOS App", description: "SwiftUI task manager with CoreData persistence", difficulty: "Beginner" },
    { title: "Fitness Tracker", description: "HealthKit-powered workout logging app", difficulty: "Intermediate" },
  ],
  Kotlin: [
    { title: "News Reader App", description: "Jetpack Compose app fetching RSS feeds", difficulty: "Beginner" },
    { title: "Local Database App", description: "Room DB + ViewModel + Repository pattern", difficulty: "Intermediate" },
  ],
  TensorFlow: [
    { title: "Sentiment Analyser", description: "LSTM model for classifying movie reviews", difficulty: "Intermediate" },
    { title: "Object Detection", description: "Fine-tune MobileNet SSD on a custom dataset", difficulty: "Advanced" },
  ],
  PyTorch: [
    { title: "MNIST Classifier", description: "CNN trained on MNIST from scratch", difficulty: "Beginner" },
    { title: "Custom Training Loop", description: "Implement gradient accumulation + mixed precision", difficulty: "Advanced" },
  ],
  "Hugging Face": [
    { title: "Chatbot with LLaMA", description: "Local chatbot using a quantised LLaMA model", difficulty: "Intermediate" },
    { title: "Text Summarisation API", description: "Wrap BART in a FastAPI endpoint", difficulty: "Intermediate" },
  ],
  Terraform: [
    { title: "AWS VPC Setup", description: "Provision a multi-AZ VPC with public/private subnets", difficulty: "Intermediate" },
    { title: "Full Cloud Stack", description: "ECS + RDS + ALB provisioned entirely with Terraform", difficulty: "Advanced" },
  ],
  Redis: [
    { title: "Session Store", description: "Implement JWT session caching with Redis", difficulty: "Beginner" },
    { title: "Rate Limiter", description: "Sliding-window rate limiter using Redis sorted sets", difficulty: "Intermediate" },
  ],
};

// ── Build project ideas for a skill ──────────────────────────
function getProjectIdeas(skill: string): ProjectIdea[] {
  // 1. Check skillResources.json for project ideas
  if (resourceMap[skill]?.projectIdeas?.length) {
    return resourceMap[skill].projectIdeas!;
  }
  // 2. Fall back to built-in ideas
  if (DEFAULT_PROJECT_IDEAS[skill]) {
    return DEFAULT_PROJECT_IDEAS[skill];
  }
  // 3. Generic fallback
  return [
    {
      title: `Build a ${skill} Project`,
      description: `Create a small project to practice ${skill} — start with official docs and a tutorial.`,
      difficulty: "Beginner",
    },
    {
      title: `${skill} in a Real App`,
      description: `Integrate ${skill} into one of your existing projects or contribute to an open-source repo.`,
      difficulty: "Intermediate",
    },
  ];
}

// ── Main export ───────────────────────────────────────────────
export function generateRoadmap(missingSkills: string[]): RoadmapItem[] {
  return missingSkills.map((skill) => {
    const entry = resourceMap[skill];
    const resources: LearningResource[] = entry?.resources ?? [
      {
        title: `${skill} — Official Documentation`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skill + " official documentation")}`,
        type: "documentation",
      },
      {
        title: `${skill} Complete Course — Udemy`,
        url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
        type: "course",
      },
      {
        title: `${skill} Specialization — Coursera`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
        type: "course",
      },
      {
        title: `${skill} — freeCodeCamp Tutorial`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " full course freecodecamp")}`,
        type: "video",
      },
    ];

    return {
      skill,
      resources,
      projectIdeas: getProjectIdeas(skill),
    };
  });
}
