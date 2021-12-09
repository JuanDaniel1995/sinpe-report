import { Delimiters } from "../delimiters";

export interface BACSinpeHeaderData {
  data: {
    debited_account_owner: string;
    credited_bank_account: string;
    credited_account_owner: string;
  },
  delimiter: Delimiters.BAC_SINPE;
}
