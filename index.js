import express from 'express';
import { getEntryByUid } from './fetchEntry.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Personalize from '@contentstack/personalize-edge-sdk';
import dotenv from 'dotenv';
import { Request, Headers } from 'node-fetch';

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
		
		let experiences = [];

		Personalize.setEdgeApiUrl('https://personalize-edge.contentstack.com');

    try {

				const headers = new Headers(req.headers);

        const protocol = req.protocol || (req.get('X-Forwarded-Proto') || 'http');
        const host = req.get('host');
        const fullUrl = `${protocol}://${host}${req.originalUrl || req.url}`;

        const standardRequest = new Request(fullUrl, {
            method: req.method,
            headers: headers,
            // body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined, // If your personalization involves request body
        });

        const personalizeSdk = await Personalize.init(PROJECT_UID, {
            request: standardRequest, // Pass the constructed Request object
        });

        experiences = await personalizeSdk.getExperiences();

        // Optionally, add personalization state to response headers (for debugging or client use)
        //personalizeSdk.addStateToResponse(res); //

        return res.status(200).json({ experiences }); 
    } catch (error) {
        console.error("Personalization SDK Error:", error);
        res.status(500).json({ error: "Failed to fetch personalization data" });
    }

		console.log(experiences);



		// async function fetchPersonalizeInfo(project, user) {
		// 	try {
		// 		Personalize.setEdgeApiUrl('https://personalize-edge.contentstack.com');
		// 		const p = await Personalize.init(project, { 
		// 			//request: req
		// 		});
		// 		const experiences = await p.getExperiences();
		// 		console.log(p);
		// 		const expInfo = {
		// 			'experiences': experiences,
		// 			'shortUID': experiences.length > 0 ? experiences[0].shortUid : null,
		// 			'activeVariant': experiences.length > 0 ? await p.getActiveVariant(experiences[0].shortUid) : null,
		// 			'params': await p.getVariantParam(),
		// 			'alias': await p.getVariantAliases()
		// 		};

		// 		return expInfo;

		// 	} catch (error) {
		// 		console.error("An error occurred:", error);
		// 		throw error; // or handle it as needed
		// 	}
		// }

		// fetchPersonalizeInfo(PROJECT_UID, userId)
		// .then((expInfo) => {
			
		// 	return expInfo;
		// })
		// .catch((error) => {
		// 	console.error("An error occurred:", error);
		// 	throw error; // or handle it as needed
		// });




		////////

		//Home Page Banner
    // const personalize = await Personalize.init(PROJECT_UID, {
    //   userId // optional 
    // }).then( p => {

			
		// 	let	expInfo = {
		// 			'experiences': p.getExperiences(),
		// 			'shortUID': p.getExperiences()[0].shortUid,
		// 			'activeVariant': p.getActiveVariant(p.getExperiences()[0].shortUid),
		// 			'params': p.getVariantParam(),
		// 			'alias' : p.getVariantAliases(),
		// 	}
		// 	getInfo(expInfo);
		// 	return expInfo;

		// })



		//console.log(personalize);
    // const experiences = personalize.getExperiences();
		// //gets experience ID => shortUid
		// const experiencesId = experiences[0].shortUid;
		//gets all Variants Aliases available 
		// const aliase = personalize.getVariantAliases();
		// const activeVariant = personalize.getActiveVariant(experienceId);


		// let variantParam = personalize.getVariantParam();

	
	// console.log(variantParam)
	// const variantAlias = 'cs_personalize_' + variantParam;

	// console.log('Experiences:', JSON.stringify(experiences, null, 2));
	// console.log('Variant Aliases:', JSON.stringify(aliase, null, 2));
	// console.log('Active Variant:', JSON.stringify(activeVariant, null, 2));
	// console.log('Variant Params:', variantParam);
	// console.log('Variant Alias:', variantAlias);

	// const entry = await getEntryByUid(contentTypeUid, entryUid, 'cs_personalize_0_0');
	// console.log(entry);

	

	// const contentBaseUID = entry?.baseUID;
	// const contentEntryTitle = entry?.title;
	// const contentEntryDesc = entry?.description;
	//const contentVarientID = Object.keys(entry.variantID);


    // if (experiences[0]?.shortUid) {
    //   await personalize.triggerImpression(experiences[0].shortUid);
    // }

    res.render('index', {
      projectId: PROJECT_UID,
			// experiencesId,
			// experiences,
			// count: experiences.length,
			// // contentBaseUID,
			// // contentEntryTitle,
			// // contentEntryDesc,
			// //varientId : contentVarientID,
			// variantParams : personalize.getVariantParam(),
			// variantAlias : 'cs_personalize_' + personalize.getVariantParam(),


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
