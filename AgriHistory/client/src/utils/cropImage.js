// Picks a landscape image for a crop name (English, Telugu or Hindi keywords).
// Drop real photos named crop-paddy.jpg, crop-cotton.jpg, ... into /public/images to override the drawings.
const RULES = [
  ["chilli", ["chilli", "chili", "chilly", "mirchi", "pepper", "మిర్చి", "మిరప", "मिर्च"]],
  ["paddy", ["paddy", "rice", "వరి", "ధాన్యం", "धान", "चावल"]],
  ["cotton", ["cotton", "పత్తి", "कपास"]],
  ["sugarcane", ["sugarcane", "sugar cane", "cane", "చెరకు", "गन्ना"]],
  ["wheat", ["wheat", "maize", "corn", "jowar", "bajra", "millet", "మొక్కజొన్న", "గోధుమ", "జొన్న", "गेहूं", "गेहूँ", "मक्का", "ज्वार", "बाजरा"]],
];

export function cropKey(crop = "") {
  const c = String(crop).toLowerCase();
  for (const [key, words] of RULES) if (words.some((w) => c.includes(w))) return key;
  return "default";
}

// Chilli has a photo only; its drawn fallback is the generic field scene.
const SVG_FALLBACK = { chilli: "default" };

export function cropBg(crop) {
  const k = cropKey(crop);
  return `url(/images/crop-${k}.jpg), url(/images/crop-${SVG_FALLBACK[k] || k}.svg)`;
}
