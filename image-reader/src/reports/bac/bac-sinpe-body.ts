import * as dialogflow from '@google-cloud/dialogflow';

import { Delimiters } from '../delimiters';
import { BaseReport } from "../base-report"
import { BACSinpeBodyData } from './bac-sinpe-body-data';

export class BACSinpeBody extends BaseReport<BACSinpeBodyData> {
  delimiter: Delimiters.BAC_SINPE = Delimiters.BAC_SINPE;

  extractInfo(queryResult: dialogflow.protos.google.cloud.dialogflow.v2.IQueryResult | null | undefined) {
    if (!queryResult?.parameters?.fields?.date) throw new Error('date must be defined');
    if (!queryResult?.parameters?.fields?.hour) throw new Error('hour must be defined');
    if (!queryResult?.parameters?.fields?.credited_amount) throw new Error('credited_amount must be defined');
    const date = queryResult?.parameters?.fields?.date.stringValue ?? '';
    const hour = queryResult?.parameters?.fields?.hour.stringValue ?? '';
    const credited_amount = queryResult?.parameters?.fields?.credited_amount.stringValue ?? '';
    return { date, hour, credited_amount };
  };
}
