export const wholesaleLimits = { name: 100, businessName: 160, email: 254, enquiry: 4000 };
export const businessTypes = ["studio", "instructor", "retailer", "other"];

export function emailIsValid(value) {
  if (typeof value !== "string" || value.length > 254 || value.length < 3 || /[\s<>(),;:"\\]/.test(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2 || !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(parts[0]) || parts[0].length > 64 || parts[0].startsWith(".") || parts[0].endsWith(".") || parts[0].includes("..")) return false;
  const labels = parts[1].split(".");
  return labels.length >= 2 && labels.every((label) => label.length > 0 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)) && /^[a-z]{2,}$/i.test(labels.at(-1));
}

// Shared browser/server validation; no submitted values are stored in URLs or storage.
export function validateWholesale(input) {
  const value = {};
  const errors = {};
  for (const [field, max] of Object.entries(wholesaleLimits)) {
    const raw = input[field];
    if (typeof raw !== "string") { errors[field] = "required"; continue; }
    const cleaned = raw.trim().normalize("NFC");
    const controls = field === "enquiry" ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/;
    if (!cleaned) errors[field] = "required";
    else if (cleaned.length > max) errors[field] = "tooLong";
    else if (controls.test(cleaned)) errors[field] = "invalidText";
    else if (field === "email" && !emailIsValid(cleaned)) errors[field] = "invalidEmail";
    else value[field] = cleaned;
  }
  if (input.businessType !== undefined && input.businessType !== "" && !businessTypes.includes(input.businessType)) errors.businessType = "invalidBusinessType";
  else value.businessType = input.businessType || "";
  if (input.consent !== true) errors.consent = "consentRequired";
  else value.consent = true;
  return { value, errors };
}
