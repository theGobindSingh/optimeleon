export interface Project {
  id: string;
  name: string;
  targetUrl: string;
  ignoredPaths: string[];
  scriptPath?: string;
  createdAt: Date;
}

export interface DashboardProps {
  className?: string;
  projects?: Project[];
}
