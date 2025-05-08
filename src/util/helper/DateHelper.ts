export default class DateHelper {
  private static suffixes = [
    "Mil", // 10^6
    "Bil", // 10^9
    "Trill", // 10^12
    "Quad", // 10^15
    "Quint", // 10^18
  ];

  private static formatNumber(year: number, yearMultiplier: number): string {
    if (year / yearMultiplier < 1000) return `${year / yearMultiplier}`;

    const numStr = Math.abs(year).toString();
    const firstDigit = numStr[0];
    const nextTwoDigits = numStr.slice(1, 3).padEnd(2, "0");

    if (year / yearMultiplier < 1000) return `${firstDigit}${nextTwoDigits}`;
    return `${firstDigit}.${nextTwoDigits}`;
  }

  public static getMonthName = (index: number) => {
    switch (index) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
    }
  };

  public static getYearFormat = (
    year: number,
    yearMultiplier: number
  ): string => {
    if (year < 1000000) return `${year}`;
    const scaledValue = year / yearMultiplier;
    const exponent = Math.floor(Math.log10(scaledValue));
    const index = Math.floor(exponent / 3);
    const yearSuffix = this.suffixes[index] || "";
    return (
      `${this.formatNumber(year, yearMultiplier)}` +
      ` ${yearSuffix !== "" ? yearSuffix : ""}`
    );
  };
}
