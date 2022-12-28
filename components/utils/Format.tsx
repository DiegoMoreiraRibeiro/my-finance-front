export function DateToYYYYMMDD(dateTime: Date): string {
  let newDate =
    dateTime.getFullYear() +
    "-" +
    (dateTime.getMonth() + 1 <= 9
      ? "0" + (dateTime.getMonth() + 1).toString()
      : dateTime.getMonth() + 1) +
    "-" +
    (dateTime.getDate() <= 9
      ? "0" + dateTime.getDate().toString()
      : dateTime.getDate());

  return newDate;
}

export function DateToISO(dateTimedateTime: Date): string {
  return new Date(dateTimedateTime.toString()).toISOString();
}

export function DateToString(dateTime: Date): string {
  dateTime = new Date(dateTime);
  return (
    (dateTime.getDate() <= 9
      ? "0" + dateTime.getDate().toString()
      : dateTime.getDate()) +
    "/" +
    (dateTime.getMonth() + 1 <= 9
      ? "0" + (dateTime.getMonth() + 1).toString()
      : dateTime.getMonth() + 1) +
    "/" +
    dateTime.getFullYear()
  ).toString();
}

export function NumberToCurrecy(value: any): string {
  if (!Number(value)) return "";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return amount.toString();
}
