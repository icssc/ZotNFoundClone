const phoneIntents = {
  LOAD: "load_phone",
  ADD: "add_phone",
  REMOVE: "remove_phone",
  VERIFY: "verify_phone",
  RESEND: "resend_code",
  CHANGE: "change_number",
} as const;

export { phoneIntents };
