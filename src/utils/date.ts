export function getDateString(date: Date): string {
  return date.toISOString();
}

export function getDate(dateString: string): Date {
  const date = new Date(dateString);
  if (date.toString() === "Invalid Date") {
    throw new Error("Invalid date string: " + dateString);
  }

  return new Date(dateString);
}
