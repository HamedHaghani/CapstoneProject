import en from "./translations/en";
import es from "./translations/es";
import ua from "./translations/ua";

const translations = {
  en,
  es,
  ua,
};

export const GetLabel = (key, cultureCode = "en", ...args) => {
  const keys = key.split(".");
  let value = translations[cultureCode];

  for (const k of keys) {
    if (value[k]) {
      value = value[k];
    } else {
      return key; // Fallback to key if translation not found
    }
  }
  console.log(value);

  // Handle dynamic replacements in the string
  if (args.length) {
    args.forEach((arg, index) => {
      value = value.replace(`\${${index + 1}}`, arg); // Replace placeholder with argument
    });
  }

  return value;
};
