import { emailIsValid } from "./wholesale.js";

export const contactLimits = { name: 100, email: 254, message: 4000 };
export const contactTypes = ["general", "product", "order", "other"];

export function validateContact(input) {
  const value = {};
  const errors = {};
  for (const [field, max] of Object.entries(contactLimits)) {
    const raw = input[field];
    if (typeof raw !== "string") { errors[field] = "required"; continue; }
    const cleaned = raw.trim().normalize("NFC");
    const controls = field === "message" ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/;
    if (!cleaned) errors[field] = "required";
    else if ([...cleaned].length > max) errors[field] = "tooLong";
    else if (controls.test(cleaned)) errors[field] = "invalidText";
    else if (field === "email" && !emailIsValid(cleaned)) errors[field] = "invalidEmail";
    else value[field] = cleaned;
  }
  if (!contactTypes.includes(input.subject)) errors.subject = "invalidSubject";
  else value.subject = input.subject;
  if (input.consent !== true) errors.consent = "consentRequired";
  else value.consent = true;
  return { value, errors };
}
