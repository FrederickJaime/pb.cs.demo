import { getEntryByUid } from './fetchEntry.js';

// Replace with valid Contentstack values
const contentTypeUid = 'banner';
const entryUid = 'blt1d2336678759dc1d';

(async () => {
  try {
    console.log('🔍 Fetching entry...');
    const entry = await getEntryByUid(contentTypeUid, entryUid);

    console.log('✅ Entry fetched successfully!');
    console.log('🧾 Entry content:', JSON.stringify(entry, null, 2));

    // Optional: check if expected fields exist
    if (entry.title) {
      console.log(`📝 Title: ${entry.title}`);
    } else {
      console.warn('⚠️ Entry does not have a "title" field.');
    }
  } catch (error) {
    console.error('❌ Error fetching entry:', error.message);
  }
})();