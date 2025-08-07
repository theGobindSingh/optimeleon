export interface JobData {
  projectId: string;
  targetUrl: string;
  ignoredPaths: string[];
  userId: string;
  projectName: string;
}

export interface JobResult {
  isSuccess?: boolean;
}
