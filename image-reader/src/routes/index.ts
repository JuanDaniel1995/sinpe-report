import express, { Request, Response } from 'express';
import vision from '@google-cloud/vision';
import dialogflow from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { BNDebit } from '../reports/bn/bn-debit';
import { BNCredit } from '../reports/bn/bn-credit';
import { BNSinpeDebit } from '../reports/bn/bn-sinpe-debit';
import { BNSinpeCredit } from '../reports/bn/bn-sinpe-credit';
import { BN } from '../reports/bn/bn';

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
    // A unique identifier for the given session
    const sessionId = uuidv4();

    const projectId = 'sinpe-report';

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );
    if (textDetections.fullTextAnnotation?.text?.includes('Transferencia BN SINPE')) {
      const bnSinpeDebit = new BNSinpeDebit(sessionId, projectId, sessionClient, sessionPath);
      const bnSinpeCredit = new BNSinpeCredit(sessionId, projectId, sessionClient, sessionPath);
      const bnClient = new BN(bnSinpeDebit, bnSinpeCredit);
      const bnParams = await bnClient.extractInfo(textDetections.fullTextAnnotation?.text);
      queryParams = { ...queryParams, ...bnParams };
      console.log(queryParams);
    } else if (textDetections.fullTextAnnotation?.text?.includes('Banco Nacional de Costa Rica')) {
      const bnDebit = new BNDebit(sessionId, projectId, sessionClient, sessionPath);
      const bnCredit = new BNCredit(sessionId, projectId, sessionClient, sessionPath);
      const bnClient = new BN(bnDebit, bnCredit);
      const bnParams = await bnClient.extractInfo(textDetections.fullTextAnnotation?.text);
      queryParams = { ...queryParams, ...bnParams };
      console.log(queryParams);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
  res.send({});
});

export { router as indexImageRouter };
