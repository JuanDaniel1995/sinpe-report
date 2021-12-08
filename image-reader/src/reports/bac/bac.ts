
import { BACHeader } from './bac-header';
import { BACBody } from './bac-body';
import { BACSinpeHeader } from './bac-sinpe-header';
import { BACSinpeBody } from './bac-sinpe-body';

export class BAC {
  private ibanBankAccountFormatter: RegExp;
  private ibanBankAccountOrder: string;

  constructor(private headerReportInfo: BACHeader | BACSinpeHeader, private bodyReportInfo: BACBody | BACSinpeBody) {
    this.ibanBankAccountFormatter = new RegExp(/(.+)(CR)\s*(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})(.+)/);
    this.ibanBankAccountOrder = '$1$2$3$4$5$6$7$8';
  }

  async extractInfo(fullText: string) {
    const regex = new RegExp(`(${this.headerReportInfo.delimiter})`)
    const splittedText = fullText.split(regex);
    this.headerReportInfo.assignSentence(splittedText[0]);
    this.bodyReportInfo.assignSentence(`${splittedText[1]}${splittedText[2]}`);
    const queryParamsDebit = await this.extractParams(this.headerReportInfo);
    const creditParamsDebit = await this.extractParams(this.bodyReportInfo);
    return { ...queryParamsDebit, ...creditParamsDebit };
  }

  private async extractParams(report: BACHeader | BACSinpeHeader | BACBody | BACSinpeBody) {
    report.cleanSentence(this.ibanBankAccountFormatter, this.ibanBankAccountOrder);
    const debitedRequest = await report.sendRequest();
    return report.extractInfo(debitedRequest);
  }
}