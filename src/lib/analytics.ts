"use client";

import posthog from "posthog-js";

// User Events
export const trackUserSignIn = () => {
  posthog.capture("user_sign_in", {
    timestamp: new Date().toISOString(),
  });
};

export const trackUserSignOut = () => {
  posthog.capture("user_sign_out", {
    timestamp: new Date().toISOString(),
  });
};

// Item Events
export const trackItemViewed = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  posthog.capture("item_viewed", {
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
  posthog.capture("item_deleted", {
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
  posthog.capture("item_contact_attempt", {
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
  posthog.capture("item_contact_success", {
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
  posthog.capture("item_share_link_copied", {
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
  posthog.capture("item_edited", {
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
  posthog.capture("item_resolved", {
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
  posthog.capture("item_helped", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

// Search Events
export const trackSearch = (searchTerm: string) => {
  posthog.capture("search_performed", {
    search_term: searchTerm,
    timestamp: new Date().toISOString(),
  });
};

// Dialog/Modal Events
export const trackAddItemDialogOpened = () => {
  posthog.capture("add_item_dialog_opened", {
    timestamp: new Date().toISOString(),
  });
};

export const trackAddItemStepCompleted = (step: number, stepName: string) => {
  posthog.capture("add_item_step_completed", {
    step,
    step_name: stepName,
    timestamp: new Date().toISOString(),
  });
};

export const trackAddItemStepBack = (fromStep: number) => {
  posthog.capture("add_item_step_back", {
    from_step: fromStep,
    timestamp: new Date().toISOString(),
  });
};

export const trackSignInDialogOpened = (source: string = "add_item_button") => {
  posthog.capture("sign_in_dialog_opened", {
    source,
    timestamp: new Date().toISOString(),
  });
};

export const trackEditItemDialogOpened = (itemData: {
  itemId: string;
  itemType: string;
}) => {
  posthog.capture("edit_item_dialog_opened", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    timestamp: new Date().toISOString(),
  });
};

export const trackEditItemStepCompleted = (step: number, itemId: string) => {
  posthog.capture("edit_item_step_completed", {
    step,
    item_id: itemId,
    timestamp: new Date().toISOString(),
  });
};

export const trackEditItemStepBack = (fromStep: number, itemId: string) => {
  posthog.capture("edit_item_step_back", {
    from_step: fromStep,
    item_id: itemId,
    timestamp: new Date().toISOString(),
  });
};

export const trackBookmarksOpened = () => {
  posthog.capture("bookmarks_opened", {
    timestamp: new Date().toISOString(),
  });
};

// Navigation Events
export const trackNavigationToAbout = () => {
  posthog.capture("navigation_about_page", {
    timestamp: new Date().toISOString(),
  });
};

export const trackNavigationToHome = () => {
  posthog.capture("navigation_home_page", {
    timestamp: new Date().toISOString(),
  });
};

export const trackMarkerClicked = (itemData: {
  itemId: string;
  itemType: string;
  isLost: boolean;
}) => {
  posthog.capture("map_marker_clicked", {
    item_id: itemData.itemId,
    item_type: itemData.itemType,
    is_lost: itemData.isLost,
    timestamp: new Date().toISOString(),
  });
};

// File Upload Events
export const trackFileUploadStarted = () => {
  posthog.capture("file_upload_started", {
    timestamp: new Date().toISOString(),
  });
};

export const trackFileUploadCompleted = (
  fileSize: number,
  fileType: string
) => {
  posthog.capture("file_upload_completed", {
    file_size: fileSize,
    file_type: fileType,
    timestamp: new Date().toISOString(),
  });
};

export const trackFileUploadFailed = (error: string) => {
  posthog.capture("file_upload_failed", {
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
  posthog.capture("error_occurred", {
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
  posthog.capture("$pageview", {
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
  posthog.identify(userId, {
    ...userProperties,
    last_active: new Date().toISOString(),
  });
};

// Reset user on sign out
export const resetUser = () => {
  posthog.reset();
};
