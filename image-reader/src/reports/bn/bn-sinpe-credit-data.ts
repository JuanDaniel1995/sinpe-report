import { Delimiters } from "../delimiters";

export interface BNCreditData {
  data: {
    credited_bank_account: string;
    debited_bank_account: string;
    debited_bank_iban_account: string;
    credited_amount: string;
  },
  delimiter: Delimiters.BN_SINPE;
}
