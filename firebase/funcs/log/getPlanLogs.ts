import { DailyLog } from "@/types/interfaces"; // Ensure DailyLog is imported
import { useDailyLogContext } from "../../../contexts/LogContext"; 

export const getPlanLogs = (): Record<string, DailyLog[]>  => {
    const { dailyLogs } = useDailyLogContext();

    if (!dailyLogs) {
        return {};
    }

    //Group plans by log
    const groupedLogs = dailyLogs.reduce((acc, log) => {
        if (!acc[log.plan]) {
        acc[log.plan] = [];
        }
        acc[log.plan].push(log);

        return acc;
    }, {} as Record<string, DailyLog[]>); 

    return groupedLogs;
};