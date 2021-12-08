import * as dialogflow from '@google-cloud/dialogflow';

import { Delimiters } from '../delimiters';
import { BaseReport } from "../base-report"
import { BACSinpeHeaderData } from './bac-sinpe-header-data';

export class BACSinpeHeader extends BaseReport<BACSinpeHeaderData> {
  delimiter: Delimiters.BAC_SINPE = Delimiters.BAC_SINPE;

  extractInfo(queryResult: dialogflow.protos.google.cloud.dialogflow.v2.IQueryResult | null | undefined) {
    if (!queryResult?.parameters?.fields?.debited_account_owner) throw new Error('debited_account_owner must be defined');
    if (!queryResult?.parameters?.fields?.credited_bank_account) throw new Error('credited_bank_account must be defined');
    if (!queryResult?.parameters?.fields?.credited_account_owner) throw new Error('credited_account_owner must be defined');
    const debited_account_owner = queryResult?.parameters?.fields?.debited_account_owner.stringValue ?? '';
    const credited_bank_account = queryResult?.parameters?.fields?.credited_bank_account.stringValue ?? '';
    const credited_account_owner = queryResult?.parameters?.fields?.credited_account_owner.stringValue ?? '';
    return { debited_account_owner, credited_bank_account, credited_account_owner };
  };
}
