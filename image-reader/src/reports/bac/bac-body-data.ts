import { Delimiters } from "../delimiters";

export interface BACBodyData {
  data: {
    date: string;
    hour: string;
    credited_amount: string;
    voucher_number: string;
  },
  delimiter: Delimiters.BAC;
}
