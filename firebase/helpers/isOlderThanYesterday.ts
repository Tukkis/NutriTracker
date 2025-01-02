export default function isOlderThanYesterday(dateToCheck: string): boolean {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);
    const parsedDate = new Date(dateToCheck);
    return parsedDate < new Date(yesterday.toISOString().split("T")[0]);
}
  