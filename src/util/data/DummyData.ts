import { addMonths } from "date-fns";

export default class DummyData {
  public static getMonths = (date: Date, numOfMonths: number): Array<Date> => {
    return Array(numOfMonths).fill(0).map((_, index) => { return addMonths(date, index) })
  };
}
