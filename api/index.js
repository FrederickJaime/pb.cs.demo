import express from 'express';
import { getEntryByUid } from './fetchEntry.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Personalize from '@contentstack/personalize-edge-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your actual project UID from Contentstack Personalize
//const PROJECT_UID = process.env.PROJECT_UID;


const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// const entry = await fetchEntry('banner', 'blt1d2336678759dc1d', ['audience']);
// res.json(entry); // or render

// Route
app.get('/', async (req, res) => {
  try {
    const userId = 'test-user';
		const audienceNames = [
			'Variant - Geo - Southwest',
			'Variant - Geo - NYC',
			'Variant - Geo - NYC Queens',
			'Variant - Geo - NYC LIC'
		]
		const contentTypeUid = 'hero';
    const entryUid = 'bltfea47ed482e0f805'; 

	var promise = new Promise(function(resolve, reject) {

		const personalize = Personalize.init(process.env.PROJECT_UID, {
			userId
		  });
	  
		const experiences = personalize.getExperiences();
		  //gets experience ID => shortUid
		  const experienceId = experiences[0]?.shortUid;
		  //gets all Variants Aliases available 
		  const aliase = personalize.getVariantAliases();
		  const activeVariant = personalize.getActiveVariant(experienceId);
		  const variantParam = personalize.getVariantParam();
		  const variantAlias = 'cs_personalize_' + variantParam;
	  
		  console.log('Experiences:', JSON.stringify(experiences, null, 2));
		  console.log('Variant Aliases:', JSON.stringify(aliase, null, 2));
		  console.log('Active Variant:', JSON.stringify(activeVariant, null, 2));
		  console.log('Variant Params:', variantParam);
		  console.log('Variant Alias:', variantAlias);
        });
		
		promise.then(function(value) {
			const entry = getEntryByUid(contentTypeUid, entryUid, variantAlias);
			console.log(entry);
		
			const experiencesId = experiences[0].shortUid;
		
			const contentBaseUID = entry?.baseUID;
			const contentEntryTitle = entry?.title;
			const contentEntryDesc = entry?.description;
			const contentVarientID = Object.keys(entry.variantID);
		
		
			if (experiences[0]?.shortUid) {
			  await personalize.triggerImpression(experiences[0].shortUid);
			}
		
			res.render('index', {
			  projectId: process.env.PROJECT_UID,
					experiencesId,
					experiences,
					count: experiences.length,
					contentBaseUID,
					contentEntryTitle,
					contentEntryDesc,
					varientId : contentVarientID,
					variantParams : variantParam,
					variantAlias : variantAlias,
		
		
			});
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
