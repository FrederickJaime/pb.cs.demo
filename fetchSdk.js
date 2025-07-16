import Personalize from '@contentstack/personalize-edge-sdk';
const PROJECT_UID ='686ed5b2a1ba02e6b4df8848';

export async function getSdk(req, res) {
  // Set a custom Edge API URL (optional)
  Personalize.setEdgeApiUrl('https://personalize-edge.contentstack.com');
  // Initialize the SDK and pass the request object
  const personalizeSdk = await Personalize.init(PROJECT_UID, {
    request: req,
  });

  const experiences = personalizeSdk.getExperiences();

  return { personalizeSdk, experiences };
}