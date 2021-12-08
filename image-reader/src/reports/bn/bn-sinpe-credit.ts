import * as dialogflow from '@google-cloud/dialogflow';

import { Delimiters } from '../delimiters';
import { BaseReport } from "../base-report"
import { BNCreditData } from "./bn-sinpe-credit-data"

export class BNSinpeCredit extends BaseReport<BNCreditData> {
  delimiter: Delimiters.BN_SINPE = Delimiters.BN_SINPE;

  extractInfo(queryResult: dialogflow.protos.google.cloud.dialogflow.v2.IQueryResult | null | undefined) {
    if (!queryResult?.parameters?.fields?.credited_bank_account) throw new Error('credited_bank_account must be defined');
    if (!queryResult?.parameters?.fields?.debited_bank_account) throw new Error('debited_bank_account must be defined');
    if (!queryResult?.parameters?.fields?.debited_bank_iban_account) throw new Error('debited_bank_iban_account must be defined');
    if (!queryResult?.parameters?.fields?.credited_amount) throw new Error('credited_amount must be defined');
    const credited_bank_account = queryResult?.parameters?.fields?.credited_bank_account.stringValue ?? '';
    const debited_bank_account = queryResult?.parameters?.fields?.debited_bank_account.stringValue ?? '';
    const debited_bank_iban_account = queryResult?.parameters?.fields?.debited_bank_iban_account.stringValue ?? '';
    const credited_amount = queryResult?.parameters?.fields?.credited_amount.stringValue ?? '';
    return { credited_bank_account, debited_bank_account, debited_bank_iban_account, credited_amount };
  };
}
