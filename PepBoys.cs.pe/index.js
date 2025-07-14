import express from 'express';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Personalize from '@contentstack/personalize-edge-sdk';
import contentstack from 'contentstack';
import dotenv from 'dotenv';

dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your actual project UID from Contentstack Personalize
const PROJECT_UID = process.env.PROJECT_UID;

const Stack = contentstack.Stack({
  api_key: process.env.CS_API_KEY,
  delivery_token: process.env.CS_DELIVERY_TOKEN,
  environment: process.env.CS_ENVIRONMENT,
});

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route
app.get('/', async (req, res) => {
  try {
    const userId = 'test-user';

	//  Initialize Pep Boys personalization experiences
    const personalize = await Personalize.init(PROJECT_UID, {
      userId
    });

    const experiences = personalize.getExperiences();
		//gets experience ID => shortUid
		const experienceId = experiences[0]?.shortUid;
		//gets all Variants Aliases available 
		const variantAliases = personalize.getVariantAliases();
		const activeVariant = personalize.getActiveVariant(experienceId);
		const variantParam = personalize.getVariantParam();
		const variantAlias = 'cs_personalize_' + variantParam;
		console.log('Experiences:', JSON.stringify(experiences, null, 2));
		console.log('Variant Aliases:', JSON.stringify(variantAliases, null, 2));
		console.log('Active Variant:', JSON.stringify(activeVariant, null, 2));
		console.log('Variant Params:', variantParam);
		console.log('Variant Alias:', variantAlias);
		console.log('experienceId:', experienceId);

		console.log("starting");
		const baseUID = 'bltfea47ed482e0f805'
		const entry = await Stack
		.ContentType('hero')
		.Entry(baseUID)
		.variants(variantAlias)
		.toJSON()
		.fetch();

		console.log("done")
		console.log(entry)

		const contentEntryUID = entry?.uid;
		const contentEntryTitle = entry?.title;
		const contentEntryDesc = entry?.description;
		console.log('experienceId2:', experienceId);

    // Send to view
    res.render('index1', {
      projectId: PROJECT_UID,
			contentEntryUID,
			contentEntryTitle,
			contentEntryDesc
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
