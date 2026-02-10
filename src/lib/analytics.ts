"use client";

type PostHogModule = typeof import("posthog-js");

let posthogPromise: Promise<PostHogModule> | null = null;

const getPosthog = () => {
  if (typeof window === "undefined") return null;
  if (!posthogPromise) {
    posthogPromise = import("posthog-js");
  }
  return posthogPromise;
};

const captureEvent = (event: string, properties?: Record<string, unknown>) => {
  const promise = getPosthog();
  if (!promise) return;
  void promise
    .then((mod) => mod.default.capture(event, properties))
    .catch(() => undefined);
};

const identify = (userId: string, properties?: Record<string, unknown>) => {
  const promise = getPosthog();
  if (!promise) return;
  void promise
    .then((mod) => mod.default.identify(userId, properties))
    .catch(() => undefined);
};

const reset = () => {
  const promise = getPosthog();
  if (!promise) return;
  void promise.then((mod) => mod.default.reset()).catch(() => undefined);
};

// User Events
export const trackUserSignIn = () => {
  captureEvent("user_sign_in", {
    timestamp: new Date().toISOString(),
  });
};

export const trackUserSignOut = () => {
  captureEvent("user_sign_out", {
    timestamp: new Date().toISOString(),
  });
};

// Item Events
export const trackItemViewed = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("item_viewed", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

export const trackItemDeleted = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("item_deleted", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

export const trackItemContactAttempt = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("item_contact_attempt", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

export const trackItemContactSuccess = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("item_contact_success", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

export const trackItemShareLink = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("item_share_link_copied", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

export const trackItemEdited = (itemData: {
  itemId?: string;
  itemType: string;
  isLost: boolean;
  hasNewImage: boolean;
}) => {
  captureEvent("item_edited", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    has_new_image: itemData.hasNewImage,
    timestamp: new Date().toISOString(),
  });
};

export const trackItemResolved = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("item_resolved", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

export const trackItemHelped = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("item_helped", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

// Search Events
export const trackSearch = (searchTerm: string) => {
  captureEvent("search_performed", {
    search_term: searchTerm,
    timestamp: new Date().toISOString(),
  });
};

// Dialog/Modal Events
export const trackAddItemDialogOpened = () => {
  captureEvent("add_item_dialog_opened", {
    timestamp: new Date().toISOString(),
  });
};

export const trackAddItemStepCompleted = (step: number, stepName: string) => {
  captureEvent("add_item_step_completed", {
    step,
    step_name: stepName,
    timestamp: new Date().toISOString(),
  });
};

export const trackAddItemStepBack = (fromStep: number) => {
  captureEvent("add_item_step_back", {
    from_step: fromStep,
    timestamp: new Date().toISOString(),
  });
};

export const trackSignInDialogOpened = (source: string = "add_item_button") => {
  captureEvent("sign_in_dialog_opened", {
    source,
    timestamp: new Date().toISOString(),
  });
};

export const trackEditItemDialogOpened = (itemData: {
  itemId: string;
  itemType: string;
}) => {
  captureEvent("edit_item_dialog_opened", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    timestamp: new Date().toISOString(),
  });
};

export const trackEditItemStepCompleted = (step: number, itemId: string) => {
  captureEvent("edit_item_step_completed", {
    step,
    item_id: itemId,
    timestamp: new Date().toISOString(),
  });
};

export const trackEditItemStepBack = (fromStep: number, itemId: string) => {
  captureEvent("edit_item_step_back", {
    from_step: fromStep,
    item_id: itemId,
    timestamp: new Date().toISOString(),
  });
};

export const trackBookmarksOpened = () => {
  captureEvent("bookmarks_opened", {
    timestamp: new Date().toISOString(),
  });
};

// Navigation Events
export const trackNavigationToAbout = () => {
  captureEvent("navigation_about_page", {
    timestamp: new Date().toISOString(),
  });
};

export const trackNavigationToHome = () => {
  captureEvent("navigation_home_page", {
    timestamp: new Date().toISOString(),
  });
};

export const trackMarkerClicked = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  captureEvent("map_marker_clicked", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

// File Upload Events
export const trackFileUploadStarted = () => {
  captureEvent("file_upload_started", {
    timestamp: new Date().toISOString(),
  });
};

export const trackFileUploadCompleted = (
  fileSize: number,
  fileType: string
) => {
  captureEvent("file_upload_completed", {
    file_size: fileSize,
    file_type: fileType,
    timestamp: new Date().toISOString(),
  });
};

export const trackFileUploadFailed = (error: string) => {
  captureEvent("file_upload_failed", {
    error,
    timestamp: new Date().toISOString(),
  });
};

// Error Events
export const trackError = (errorData: {
  error: string;
  context: string;
  severity?: "low" | "medium" | "high";
}) => {
  captureEvent("error_occurred", {
    error: errorData.error,
    context: errorData.context,
    severity: errorData.severity || "medium",
    timestamp: new Date().toISOString(),
  });
};

// Page View Events
export const trackPageView = (
  pageName: string,
  additionalData?: Record<string, any>
) => {
  captureEvent("$pageview", {
    page_name: pageName,
    ...additionalData,
    timestamp: new Date().toISOString(),
  });
};

// Identify user for PostHog
export const identifyUser = (
  userId: string,
  userProperties?: Record<string, any>
) => {
  identify(userId, {
    ...userProperties,
    last_active: new Date().toISOString(),
  });
};

// Reset user on sign out
export const resetUser = () => {
  reset();
};
