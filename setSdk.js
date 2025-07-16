
import Personalize from '@contentstack/personalize-edge-sdk';
import { Request, Headers } from 'node-fetch';

const PROJECT_UID ='686ed5b2a1ba02e6b4df8848';

export async function setSdk(req) {
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

			const experiences = personalizeSdk.getExperiences();

			const persolanizeExperienceInfo = {
					'experiences': experiences,
					'shortUID': experiences.length > 0 ? experiences[0].shortUid : null,
					'activeVariant': experiences.length > 0 ? await personalizeSdk.getActiveVariant(experiences[0].shortUid) : null,
					'params': personalizeSdk.getVariantParam(),
					'alias': personalizeSdk.getVariantAliases()
			}
			// Optionally, add personalization state to response headers (for debugging or client use)
			//personalizeSdk.addStateToResponse(res); //

			return persolanizeExperienceInfo;
	} catch (error) {
			console.error("Personalization SDK Error:", error);
			res.status(500).json({ error: "Failed to fetch personalization data" });
	}
}