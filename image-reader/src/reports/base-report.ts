import * as dialogflowTypes from '@google-cloud/dialogflow/build/protos/protos';
import { SessionsClient } from '@google-cloud/dialogflow/build/src'

import { Delimiters } from './delimiters';

interface Data {
  delimiter: Delimiters,
  data: any;
}

export abstract class BaseReport<T extends Data> {
  abstract delimiter: T['delimiter'];
  abstract extractInfo(queryResult: dialogflowTypes.google.cloud.dialogflow.v2.IQueryResult | null | undefined): T['data'];
  protected sentence: string = '';

  constructor(private sessionId: string, private projectId: string, private sessionClient: SessionsClient, private sessionPath: string) {
    this.sessionPath = this.sessionClient.projectAgentSessionPath(
      this.projectId,
      this.sessionId
    );
  }

  assignSentence(sentence: string) {
    this.sentence = sentence;
  }

  async sendRequest(previousIntentContexts?: dialogflowTypes.google.cloud.dialogflow.v2.IContext[] | null | undefined): Promise<dialogflowTypes.google.cloud.dialogflow.v2.IQueryResult | null | undefined> {
    const request: dialogflowTypes.google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: this.sentence,
          languageCode: 'en-ES',
        },
      },
      queryParams: {
        contexts: previousIntentContexts
      }
    };
    const response = await this.sessionClient.detectIntent(request);
    return response[0].queryResult;
  }

  cleanSentence(regex: RegExp, regexGroups: string): void {
    this.sentence = this.sentence.replace(/\s+/g, ' ');
    this.sentence = this.sentence.replace(regex, regexGroups);
  }
}
