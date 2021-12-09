import { Delimiters } from "../delimiters";

export interface BNDebitData {
  data: {
    date_hour: string;
    voucher_number: string;
    debited_bank_account: string;
    debited_bank_iban_account: string;
  },
  delimiter: Delimiters.BN
}
