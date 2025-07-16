import express from 'express';
import { setSdk } from './setSdk.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your actual project UID from Contentstack Personalize
const PROJECT_UID ='686ed5b2a1ba02e6b4df8848';
//_edgeApiURL: https://personalize-edge.contentstack.com

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS templating
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route
app.get('/', async (req, res) => {
  try {

		const persolanizeSDK = await setSdk(req);
		console.log('this is it', persolanizeSDK);

		//EXPERIENCE VALUES
		const experience = persolanizeSDK.experiences;
		const experienceShortId = persolanizeSDK.shortUID;
		const experienceActiveVariant = persolanizeSDK.activeVariant;
		const experienceVariantParams = persolanizeSDK.params;
		const experienceVariantAlias = persolanizeSDK.alias;

		//VARIANT VALUES
		const variantBaseUID = persolanizeSDK.baseUID;
		const variantTitle = persolanizeSDK.title;
		const variantDesc = persolanizeSDK.description;
		const variantPayload = persolanizeSDK.variant;


    // if (experiences[0]?.shortUid) {
    //   await personalize.triggerImpression(experiences[0].shortUid);
    // }

    res.render('index', {
      projectId: PROJECT_UID,
			experience,
			experienceShortId,
			experienceActiveVariant,
			experienceVariantParams,
			experienceVariantAlias,
			variantBaseUID,
			variantTitle,
			variantDesc,
			variantPayload
    });
  } catch (err) {
    console.error('Personalize SDK error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
