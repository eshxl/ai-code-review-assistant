export interface CreateReviewRequest {
  code: string;
  language?: string;
}

export interface JobResponse {
  jobId: string;
  status: 'QUEUED' | 'RUNNING' | 'BLOCKED' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
}

export interface AiResultDTO {
  explanation: string;
  patch?: string;
  originalCode?: string;
  fixedCode?: string;
  confidence: number;
}

export interface FindingResultDTO {
  findingId: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'convention';
  tool: string;
  message: string;
  filePath?: string;
  ai: AiResultDTO | null;
}

export interface SecurityAlertDTO {
  type: string;
  filePath: string | null;
}

export interface ReviewSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ReviewResultsResponse {
  reviewId: string;
  status: 'COMPLETED' | 'BLOCKED';
  blocked: boolean;
  summary: ReviewSummary;
  findings: Record<string, FindingResultDTO[]>;
  securityAlerts: SecurityAlertDTO[];
}