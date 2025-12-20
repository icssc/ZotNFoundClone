import { useReducer, useMemo } from "react";
import { stringArrayToLatLng } from "@/lib/types";
import { Item } from "@/db/schema";
import { WizardMode } from "@/components/Item/ItemWizardDialog";

import { LocationFormData } from "@/lib/types";

type FormAction =
  | {
      type: "UPDATE_FIELD";
      field: keyof LocationFormData;
      value: LocationFormData[keyof LocationFormData];
    }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET"; payload: LocationFormData };

type FormState = LocationFormData & {
  currentStep: number;
};

const emptyBaseState: LocationFormData = {
  name: "",
  description: "",
  type: "",
  date: new Date(),
  file: null,
  isLost: true,
  location: null,
};

function buildInitialState(mode: WizardMode, item?: Item): FormState {
  if (mode === "edit" && item) {
    const itemDate = item.itemDate || item.date;
    const parsedDate = itemDate ? new Date(itemDate) : new Date();

    let locationValue: [number, number] | null = null;
    if (item.location) {
      const latLng = stringArrayToLatLng(item.location);
      if (Array.isArray(latLng)) {
        locationValue = latLng as [number, number];
      } else if (
        latLng &&
        typeof latLng === "object" &&
        "lat" in latLng &&
        "lng" in latLng
      ) {
        locationValue = [latLng.lat, latLng.lng];
      }
    }

    return {
      name: item.name || "",
      description: item.description || "",
      type: (item.type as LocationFormData["type"]) || "",
      date: parsedDate,
      file: null,
      isLost: item.isLost ?? true,
      location: locationValue,
      currentStep: 1,
    };
  }

  return {
    ...emptyBaseState,
    currentStep: 1,
  };
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case "RESET":
      return { ...action.payload, currentStep: 1 };
    default:
      return state;
  }
}

export function useItemWizard(mode: WizardMode, item?: Item) {
  const initialStateMemo = useMemo(
    () => buildInitialState(mode, item),
    [mode, item]
  );
  const [formState, dispatch] = useReducer(formReducer, initialStateMemo);

  function updateField<K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  const nextStep = () => dispatch({ type: "NEXT_STEP" });
  const prevStep = () => dispatch({ type: "PREV_STEP" });
  const reset = () =>
    dispatch({ type: "RESET", payload: buildInitialState(mode, item) });

  return {
    formState,
    updateField,
    nextStep,
    prevStep,
    reset,
  };
}
