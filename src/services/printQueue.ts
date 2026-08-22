export interface PrintJob {
  jobId: string;
  attendeeId: string;
  createdAt: string;
}

const printQueue: PrintJob[] = [];

export function publishPrintRequest(attendeeId: string): PrintJob {
  const job: PrintJob = {
    jobId: `JOB-${Date.now()}`,
    attendeeId,
    createdAt: new Date().toISOString(),
  };

  printQueue.push(job);

  console.log(
    `[Queue] Print request published: ${job.jobId} for ${attendeeId}`
  );

  return job;
}

export function getPrintQueue(): PrintJob[] {
  return [...printQueue];
}

