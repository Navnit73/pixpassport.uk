/**
 * CLI Script: Submit all PixPassport URLs to IndexNow
 * Usage: npm run indexnow
 */

const INDEXNOW_KEY = "0c3dc5e8833b46beb209705aa05e5683";
const INDEXNOW_HOST = "pixpassport.uk";
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const toolSlugs = [
  "digital-passport-photo",
  "image-to-passport-size-converter",
  "indian-passport-photo-maker",
  "online-id-photo-maker",
  "order-passport-photos-online",
  "passport-photo-at-home",
  "passport-photo-tool",
  "photo-size-35x45mm",
  "schengen-visa-photo",
  "uk-baby-passport-photo",
  "uk-driving-licence-photo",
  "uk-passport-photo",
  "us-visa-photo-tool",
  "passport-renewal-photo-online",
];

const staticPages = [
  `https://${INDEXNOW_HOST}`,
  `https://${INDEXNOW_HOST}/passport-size-photo-maker`,
  `https://${INDEXNOW_HOST}/passport-photo-print-template-generator`,
  `https://${INDEXNOW_HOST}/about-us`,
  `https://${INDEXNOW_HOST}/contact-us`,
  `https://${INDEXNOW_HOST}/data-security-privacy-safeguards`,
  `https://${INDEXNOW_HOST}/privacy-policy`,
  `https://${INDEXNOW_HOST}/terms-of-service`,
  `https://${INDEXNOW_HOST}/refund-policy`,
];

const toolPages = toolSlugs.map((slug) => `https://${INDEXNOW_HOST}/tool/${slug}`);
const allUrls = Array.from(new Set([...staticPages, ...toolPages]));

const payload = {
  host: INDEXNOW_HOST,
  key: INDEXNOW_KEY,
  keyLocation: INDEXNOW_KEY_LOCATION,
  urlList: allUrls,
};

async function run() {
  console.log(`🚀 Preparing IndexNow submission for ${INDEXNOW_HOST}...`);
  console.log(`🔑 Key: ${INDEXNOW_KEY}`);
  console.log(`📄 Key Location: ${INDEXNOW_KEY_LOCATION}`);
  console.log(`🌐 Submitting ${allUrls.length} URLs to IndexNow protocol...`);

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Sending POST to ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`✅ SUCCESS: Search engines accepted ${allUrls.length} URLs via ${endpoint}!`);
      } else {
        const text = await response.text();
        console.warn(`⚠️ Warning: Status ${response.status}:`, text);
      }
    } catch (err) {
      console.error(`❌ Error submitting to ${endpoint}:`, err.message);
    }
  }

  console.log(`\n🎉 IndexNow submission process completed!`);
}

run();
