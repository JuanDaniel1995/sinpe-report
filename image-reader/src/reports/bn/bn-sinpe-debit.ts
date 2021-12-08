import * as dialogflow from '@google-cloud/dialogflow';

import { Delimiters } from '../delimiters';
import { BaseReport } from "../base-report"
import { BNSinpeDebitData } from "./bn-sinpe-debit-data"

export class BNSinpeDebit extends BaseReport<BNSinpeDebitData> {
  delimiter: Delimiters.BN_SINPE = Delimiters.BN_SINPE;

  extractInfo(queryResult: dialogflow.protos.google.cloud.dialogflow.v2.IQueryResult | null | undefined) {
    if (!queryResult?.parameters?.fields?.date_hour) throw new Error('date_hour must be defined');
    if (!queryResult?.parameters?.fields?.voucher_number) throw new Error('voucher_number must be defined');
    if (!queryResult?.parameters?.fields?.debited_amount) throw new Error('debited_amount must be defined');
    const date_hour = queryResult?.parameters?.fields?.date_hour.stringValue ?? '';
    const voucher_number = queryResult?.parameters?.fields?.voucher_number.stringValue ?? '';
    const debited_amount = queryResult?.parameters?.fields?.debited_amount.stringValue ?? '';
    return { date_hour, voucher_number, debited_amount };
  };
}
