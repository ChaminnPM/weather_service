import cron from "node-cron";

class JobManager {
    constructor() {}

    public scheduleJob(intervalInMinutes: number, task: () => void): void {
        const cronExpression = `*/${intervalInMinutes} * * * *`;
        cron.schedule(cronExpression, task);
        console.log(
            `Created Job with interval ${intervalInMinutes} minutes`
        );
    }
}

export default JobManager;
