export const AnalyticsEvents = {
  APP_OPEN: "app_open",

  INSTALL_PROMPT_SHOWN: "install_prompt_shown",
  INSTALL_BUTTON_CLICKED: "install_button_clicked",
  INSTALL_PROMPT_ACCEPTED: "install_prompt_accepted",
  INSTALL_PROMPT_DISMISSED: "install_prompt_dismissed",
  PWA_INSTALLED: "pwa_installed",

  BROCHURE_DOWNLOAD: "brochure_download",

  REGISTRATION_STARTED: "registration_started",
  REGISTRATION_COMPLETED: "registration_completed",
  VISITOR_FORM_COMPLETED: "visitor_form_completed",
  DELEGATE_FORM_COMPLETED: "delegate_form_completed",
  BOOK_YOUR_SPACE_FORM_COMPLETED: "book_your_space_form_completed",
  FEEDBACK_FORM_COMPLETED: "feedback_form_completed",
  CONTACT_FORM_SUBMIT: "contact_form_submit",

  LOGIN_STARTED: "login_started",
  LOGIN_COMPLETED: "login_completed",
  LOGIN_FAILED: "login_failed",
  LOGOUT: "logout",
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  SIGNUP_FAILED: "signup_failed",
  FORGOT_PASSWORD_REQUESTED: "forgot_password_requested",
  FORGOT_PASSWORD_COMPLETED: "forgot_password_completed",

  MENU_CLICK: "menu_click",

  PHONE_CLICK: "phone_click",
  EMAIL_CLICK: "email_click",

  SEARCH: "search",

  SPEAKER_VIEW: "speaker_view",

  DOWNLOAD: "download",

  OUTBOUND_CLICK: "outbound_click",
} as const;
