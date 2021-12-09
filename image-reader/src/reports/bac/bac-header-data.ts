import { Delimiters } from "../delimiters";

export interface BACHeaderData {
  data: {
    debited_account_owner: string;
    credited_bank_iban_account: string;
    credited_account_owner: string;
  },
  delimiter: Delimiters.BAC;
}
