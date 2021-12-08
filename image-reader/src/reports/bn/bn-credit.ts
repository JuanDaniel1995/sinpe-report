import * as dialogflow from '@google-cloud/dialogflow';

import { Delimiters } from '../delimiters';
import { BaseReport } from "../base-report"
import { BNCreditData } from './bn-credit-data';

export class BNCredit extends BaseReport<BNCreditData> {
  delimiter: Delimiters.BN = Delimiters.BN;

  extractInfo(queryResult: dialogflow.protos.google.cloud.dialogflow.v2.IQueryResult | null | undefined) {
    if (!queryResult?.parameters?.fields?.debited_amount) throw new Error('debited_amount must be defined');
    if (!queryResult?.parameters?.fields?.credited_bank_account) throw new Error('credited_bank_account must be defined');
    if (!queryResult?.parameters?.fields?.credited_bank_iban_account) throw new Error('credited_bank_iban_account must be defined');
    if (!queryResult?.parameters?.fields?.credited_amount) throw new Error('credited_amount must be defined');
    const debited_amount = queryResult?.parameters?.fields?.debited_amount.stringValue ?? '';
    const credited_bank_account = queryResult?.parameters?.fields?.credited_bank_account.stringValue ?? '';
    const credited_bank_iban_account = queryResult?.parameters?.fields?.credited_bank_iban_account.stringValue ?? '';
    const credited_amount = queryResult?.parameters?.fields?.credited_amount.stringValue ?? '';
    return { debited_amount, credited_bank_account, credited_bank_iban_account, credited_amount };
  };
}
