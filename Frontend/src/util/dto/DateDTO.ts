export default interface DateDTO {
  year: number;
  month: number;
  day: number;
}

export const isDateDTO = (obj: any): obj is DateDTO => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.year === "number" &&
    typeof obj.month === "number" &&
    typeof obj.day === "number"
  );
};
