import express, { Request, Response } from 'express';
import vision from '@google-cloud/vision';
import dialogflow from '@google-cloud/dialogflow';
import * as dialogflowTypes from '@google-cloud/dialogflow/build/protos/protos';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { BNDebit } from '../reports/bn/bn-debit';
import { BNCredit } from '../reports/bn/bn-credit';
import { BNSinpeDebit } from '../reports/bn/bn-sinpe-debit';
import { BNSinpeCredit } from '../reports/bn/bn-sinpe-credit';
import { BN } from '../reports/bn/bn';

import { BACHeader } from '../reports/bac/bac-header';
import { BACSinpeHeader } from '../reports/bac/bac-sinpe-header';
import { BACBody } from '../reports/bac/bac-body';
import { BACSinpeBody } from '../reports/bac/bac-sinpe-body';
import { BAC } from '../reports/bac/bac';

const router = express.Router();

router.post('/api/image', async (req: Request, res: Response) => {
  const visionClient = new vision.ImageAnnotatorClient();
  const { photoURL } = req.body;
  let queryParams = {};
  try {
    const { data: fileData } = await axios.get(photoURL, { responseType: 'arraybuffer' });
    const encodedImage = Buffer.from(fileData).toString('base64');
    const [textDetections] = await visionClient.textDetection(
      {
        image: {
          content: encodedImage
        }
      }
    );
    if (!textDetections.fullTextAnnotation?.text) throw new Error('No text was recognized');
    // A unique identifier for the given session
    const sessionId = uuidv4();

    const projectId = 'sinpe-report';

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );
    const shortenedText = textDetections.fullTextAnnotation?.text?.substring(0, 255);
    const request: dialogflowTypes.google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: shortenedText,
          languageCode: 'en-ES',
        },
      },
    };
    const response = await sessionClient.detectIntent(request);
    console.log(response[0].queryResult?.intent?.displayName);
    if (response[0].queryResult?.intent?.displayName === 'report_payment_debited_info_bn') {
      const bnDebit = new BNDebit(sessionId, projectId, sessionClient, sessionPath);
      const bnCredit = new BNCredit(sessionId, projectId, sessionClient, sessionPath);
      const bnClient = new BN(bnDebit, bnCredit);
      const bnParams = await bnClient.extractInfo(textDetections.fullTextAnnotation?.text);
      queryParams = { ...queryParams, ...bnParams };
      console.log(queryParams);
    } else if (response[0].queryResult?.intent?.displayName === 'report_sinpe_movil_payment_debited_info_bn') {
      const bnSinpeDebit = new BNSinpeDebit(sessionId, projectId, sessionClient, sessionPath);
      const bnSinpeCredit = new BNSinpeCredit(sessionId, projectId, sessionClient, sessionPath);
      const bnClient = new BN(bnSinpeDebit, bnSinpeCredit);
      const bnParams = await bnClient.extractInfo(textDetections.fullTextAnnotation?.text);
      queryParams = { ...queryParams, ...bnParams };
      console.log(queryParams);
    } else if (response[0].queryResult?.intent?.displayName === 'report_payment_header_info_bac') {
      const bacHeader = new BACHeader(sessionId, projectId, sessionClient, sessionPath);
      const bacBody = new BACBody(sessionId, projectId, sessionClient, sessionPath);
      const bacClient = new BAC(bacHeader, bacBody);
      const bacParams = await bacClient.extractInfo(textDetections.fullTextAnnotation?.text);
      queryParams = { ...queryParams, ...bacParams };
      console.log(queryParams);
    } else if (response[0].queryResult?.intent?.displayName === 'report_sinpe_movil_payment_header_info_bac') {
      const bacSinpeHeader = new BACSinpeHeader(sessionId, projectId, sessionClient, sessionPath);
      const bacSinpeBody = new BACSinpeBody(sessionId, projectId, sessionClient, sessionPath);
      const bacClient = new BAC(bacSinpeHeader, bacSinpeBody);
      const bacParams = await bacClient.extractInfo(textDetections.fullTextAnnotation?.text);
      queryParams = { ...queryParams, ...bacParams };
      console.log(queryParams);
    }



    // console.log(response[0].queryResult?.intent?.displayName);
    // if (textDetections.fullTextAnnotation?.text?.includes('Transferencia BN SINPE')) {
    //   const bnSinpeDebit = new BNSinpeDebit(sessionId, projectId, sessionClient, sessionPath);
    //   const bnSinpeCredit = new BNSinpeCredit(sessionId, projectId, sessionClient, sessionPath);
    //   const bnClient = new BN(bnSinpeDebit, bnSinpeCredit);
    //   const bnParams = await bnClient.extractInfo(textDetections.fullTextAnnotation?.text);
    //   queryParams = { ...queryParams, ...bnParams };
    //   console.log(queryParams);
    // } else if (textDetections.fullTextAnnotation?.text?.includes('Banco Nacional de Costa Rica')) {
    //   const bnDebit = new BNDebit(sessionId, projectId, sessionClient, sessionPath);
    //   const bnCredit = new BNCredit(sessionId, projectId, sessionClient, sessionPath);
    //   const bnClient = new BN(bnDebit, bnCredit);
    //   const bnParams = await bnClient.extractInfo(textDetections.fullTextAnnotation?.text);
    //   queryParams = { ...queryParams, ...bnParams };
    //   console.log(queryParams);
    // }
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
  res.send({});
});

export { router as indexImageRouter };
