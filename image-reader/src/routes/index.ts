import express, { Request, Response } from 'express';
import vision from '@google-cloud/vision';
import axios from 'axios';

const router = express.Router();

router.post('/api/image', async (req: Request, res: Response) => {
  const visionClient = new vision.ImageAnnotatorClient();
  const { photoURL } = req.body;
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
    console.log(textDetections.fullTextAnnotation?.text);
  } catch (err) {
    return res.status(400).send({});
  }
  res.send({});
});

export { router as indexImageRouter };
