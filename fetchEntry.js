// fetchEntry.js
import Contentstack from 'contentstack';
import dotenv from 'dotenv';

dotenv.config();

const stack = new Contentstack.Stack({
  api_key: process.env.CS_API_KEY,
  delivery_token: process.env.CS_DELIVERY_TOKEN,
  environment: process.env.CS_ENVIRONMENT,
});

/**
 * Fetch an entry from Contentstack by UID.
 *
 * @param {string} contentTypeUid - The UID of the content type
 * @param {string} entryUid - The UID of the entry to fetch
 * @param {string} variantAlias - The alis provided by personalized experience es:cs_personalize_0_3
 * @returns {Promise<Object>} - Returns a promise resolving to the entry JSON
 */
// const entry = await fetchEntry('banner', 'blt1d2336678759dc1d', ['audience']);
export async function getEntryByUid(contentTypeUid, entryUid, variantAlias) {
  try {
    // this is for single entry
    const entry = await stack.ContentType(contentTypeUid).Entry(entryUid).variants(variantAlias).toJSON().fetch();
    const entryContent = {
      'baseUID': entry.uid,
      'title': entry.title,
      'description': entry.description,
      'variantID': entry.publish_details.variants
    }

    return entryContent;
  } catch (error) {
    console.error(`Failed to fetch entry: ${entryUid}`, error);
    throw error;
  }
}