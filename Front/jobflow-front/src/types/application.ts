export type ApplicationStatus =
| "PENDING"
| "ACCEPTED"
| "REJECTED";

export interface JobApplication {
id: string;
position: string;
status: ApplicationStatus;
notes?: string;
salaryMin?: number;
salaryMax?: number;

companyName: string;
cvFileName: string;
}