import { Delimiters } from "../delimiters";

export interface BACSinpeBodyData {
  data: {
    date: string;
    hour: string;
    credited_amount: string;
  },
  delimiter: Delimiters.BAC_SINPE;
}
