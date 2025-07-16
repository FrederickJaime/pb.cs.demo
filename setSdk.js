
import Personalize from '@contentstack/personalize-edge-sdk';
import { getEntryByUid } from './fetchEntry.js';
import { Request, Headers } from 'node-fetch';

const PROJECT_UID ='686ed5b2a1ba02e6b4df8848';
const userId = 'test-user';
const contentTypeUid = 'hero';
const entryUid = 'bltfea47ed482e0f805';

export async function setSdk(req) {
	try {

			const headers = new Headers(req.headers);

			const protocol = req.protocol || (req.get('X-Forwarded-Proto') || 'http');
			const host = req.get('host');
			const fullUrl = `${protocol}://${host}${req.originalUrl || req.url}`;

			const standardRequest = new Request(fullUrl, {
					method: req.method,
					headers: headers,
			});

			const personalizeSdk = await Personalize.init(PROJECT_UID, {
				userId: userId,
				request: standardRequest, // Pass the constructed Request object
			});

			const experiences = personalizeSdk.getExperiences();
			const entry = await getEntryByUid(contentTypeUid, entryUid, personalizeSdk.getVariantAliases());

			const persolanizeExperienceInfo = {
					'experiences': JSON.stringify(experiences, null, 2),
					'shortUID': experiences.length > 0 ? experiences[0].shortUid : null,
					'activeVariant': experiences.length > 0 ? personalizeSdk.getActiveVariant(experiences[0].shortUid) : null,
					'params': personalizeSdk.getVariantParam(),
					'alias': personalizeSdk.getVariantAliases(),
					'baseUID': entry.baseUID,
					'title': entry.title,
					'description': entry.description,
					'variant': JSON.stringify(entry.variantID, null, 2)
			}
			// Optionally, add personalization state to response headers (for debugging or client use)
			//personalizeSdk.addStateToResponse(res); //

			return persolanizeExperienceInfo;
	} catch (error) {
			console.error("Personalization SDK Error:", error);
			res.status(500).json({ error: "Failed to fetch personalization data" });
	}
}