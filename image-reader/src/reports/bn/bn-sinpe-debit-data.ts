import { Delimiters } from "../delimiters";

export interface BNSinpeDebitData {
  data: {
    date_hour: string;
    voucher_number: string;
    debited_amount: string;
  },
  delimiter: Delimiters.BN_SINPE
}
