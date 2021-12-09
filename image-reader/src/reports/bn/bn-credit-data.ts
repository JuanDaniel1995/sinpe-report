import { Delimiters } from "../delimiters";

export interface BNCreditData {
  data: {
    debited_amount: string;
    credited_bank_account: string;
    credited_bank_iban_account: string;
    credited_amount: string;
  },
  delimiter: Delimiters.BN;
}
