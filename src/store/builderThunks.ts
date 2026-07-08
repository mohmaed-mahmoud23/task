import type { AppDispatch, RootState } from "./store";
import { setBuilderState, type BuilderState } from "./builderSlice";

const STORAGE_KEY = "builder-system";

function isValidBuilderState(data: any): data is BuilderState {
  if (!data || typeof data !== "object") return false;

  // Validate cameras
  if (!data.cameras || typeof data.cameras !== "object") return false;
  for (const key in data.cameras) {
    if (Object.prototype.hasOwnProperty.call(data.cameras, key)) {
      const item = data.cameras[key];
      if (!item || typeof item !== "object") return false;
      if (typeof item.quantity !== "number") return false;
      if (item.selectedColor !== undefined && typeof item.selectedColor !== "string") return false;
    }
  }

  // Validate plans
  if (!data.plans || typeof data.plans !== "object" || typeof data.plans.selectedPlanId !== "string") {
    return false;
  }

  // Validate sensors
  if (!data.sensors || typeof data.sensors !== "object") return false;
  for (const key in data.sensors) {
    if (Object.prototype.hasOwnProperty.call(data.sensors, key)) {
      const item = data.sensors[key];
      if (!item || typeof item !== "object" || typeof item.quantity !== "number") return false;
    }
  }

  // Validate protection
  if (!data.protection || typeof data.protection !== "object") return false;
  for (const key in data.protection) {
    if (Object.prototype.hasOwnProperty.call(data.protection, key)) {
      const item = data.protection[key];
      if (!item || typeof item !== "object" || typeof item.quantity !== "number") return false;
    }
  }

  return true;
}

export const saveBuilder = () => {
  return (_dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const builder = getState().builder;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(builder));
      console.log("✅ Builder saved", builder);
    } catch (err) {
      console.error("Failed to save builder state to localStorage", err);
      throw err;
    }
  };
};

export const loadBuilder = () => {
  return (dispatch: AppDispatch) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (isValidBuilderState(parsed)) {
        dispatch(setBuilderState(parsed));
        console.log("✅ Builder restored", parsed);
      } else {
        console.error("Failed to load builder: Invalid builder state structure", parsed);
      }
    } catch (err) {
      console.error("Failed to load builder", err);
    }
  };
};