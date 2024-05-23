import { SortOrder } from "antd/es/table/interface";

export const filterColumn = (a: string, b: string, sortOrder: SortOrder) => {
  if (a === undefined && sortOrder === "ascend") {
    return 1;
  }

  if (b === undefined && sortOrder === "ascend") {
    return -1;
  }

  if (a === undefined && sortOrder === "descend") {
    return -1;
  }

  if (b === undefined && sortOrder === "descend") {
    return 1;
  }

  if (a === b) {
    return 0;
  }

  if (sortOrder === "ascend") {
    return +a < +b ? -1 : 1;
  } else {
    return +a > +b ? 1 : -1;
  }
};

export const convertNumber = (num: number): string | undefined => {
  if (num < 1) {
    return "";
  }
  if (num >= 40) {
    return "XL" + convertNumber(num - 40);
  }
  if (num >= 10) {
    return "X" + convertNumber(num - 10);
  }
  if (num >= 9) {
    return "IX" + convertNumber(num - 9);
  }
  if (num >= 5) {
    return "V" + convertNumber(num - 5);
  }
  if (num >= 4) {
    return "IV" + convertNumber(num - 4);
  }
  if (num >= 1) {
    return "I" + convertNumber(num - 1);
  }
};
