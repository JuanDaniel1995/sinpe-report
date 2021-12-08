import * as dialogflow from '@google-cloud/dialogflow';

import { Delimiters } from '../delimiters';
import { BaseReport } from "../base-report"
import { BNDebitData } from "./bn-debit-data"

export class BNDebit extends BaseReport<BNDebitData> {
  delimiter: Delimiters.BN = Delimiters.BN;

  extractInfo(queryResult: dialogflow.protos.google.cloud.dialogflow.v2.IQueryResult | null | undefined) {
    if (!queryResult?.parameters?.fields?.date_hour) throw new Error('date_hour must be defined');
    if (!queryResult?.parameters?.fields?.voucher_number) throw new Error('voucher_number must be defined');
    if (!queryResult?.parameters?.fields?.debited_bank_account) throw new Error('debited_bank_account must be defined');
    if (!queryResult?.parameters?.fields?.debited_bank_iban_account) throw new Error('debited_bank_iban_account must be defined');
    const date_hour = queryResult?.parameters?.fields?.date_hour.stringValue ?? '';
    const voucher_number = queryResult?.parameters?.fields?.voucher_number.stringValue ?? '';
    const debited_bank_account = queryResult?.parameters?.fields?.debited_bank_account.stringValue ?? '';
    const debited_bank_iban_account = queryResult?.parameters?.fields?.debited_bank_iban_account.stringValue ?? '';
    return { date_hour, voucher_number, debited_bank_account, debited_bank_iban_account };
  };
}
