
import { BNDebit } from './bn-debit';
import { BNCredit } from './bn-credit';
import { BNSinpeDebit } from './bn-sinpe-debit';
import { BNSinpeCredit } from './bn-sinpe-credit';

export class BN {
  private bankAccountFormatter: RegExp;
  private bankAccountOrder: string;
  private ibanBankAccountFormatter: RegExp;
  private ibanBankAccountOrder: string;

  constructor(private debitReportInfo: BNDebit | BNSinpeDebit, private creditReportInfo: BNCredit | BNSinpeCredit) {
    this.bankAccountFormatter = new RegExp(/(.+)(-\d{1})o?(\d{5}-)(.+)/);
    this.bankAccountOrder = '$1$2$3$4';
    this.ibanBankAccountFormatter = new RegExp(/(.+)(CR\d{2})\s*(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{2})(.+)/);
    this.ibanBankAccountOrder = '$1$2$3$4$5$6$7$8';
  }

  async extractInfo(fullText: string) {
    const splittedText = fullText.split(this.debitReportInfo.delimiter);
    this.debitReportInfo.assignSentence(splittedText[0]);
    this.creditReportInfo.assignSentence(splittedText[1]);
    const queryParamsDebit = await this.extractParams(this.debitReportInfo);
    const creditParamsDebit = await this.extractParams(this.creditReportInfo);
    return { ...queryParamsDebit, ...creditParamsDebit };
  }

  private async extractParams(report: BNDebit | BNSinpeDebit | BNCredit | BNSinpeCredit) {
    report.cleanSentence(this.bankAccountFormatter, this.bankAccountOrder);
    report.cleanSentence(this.ibanBankAccountFormatter, this.ibanBankAccountOrder);
    const debitedRequest = await report.sendRequest();
    return report.extractInfo(debitedRequest);
  }
}