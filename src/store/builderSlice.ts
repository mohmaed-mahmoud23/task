import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import camerasData from "../data/cameras.json";
import plansData from "../data/plans.json";
import sensorsData from "../data/sensors.json";
import protectionData from "../data/protection.json";

// TypeScript Interfaces
export interface CameraStateItem {
  quantity: number;
  selectedColor?: string;
}

export interface GenericStateItem {
  quantity: number;
}

export interface BuilderState {
  cameras: Record<string, CameraStateItem>;
  plans: {
    selectedPlanId: string;
  };
  sensors: Record<string, GenericStateItem>;
  protection: Record<string, GenericStateItem>;
}

// Helper to find initial selected plan
const initialPlan = plansData.find((p) => p.defaultQuantity > 0) || plansData[0];

// Initial State built from JSON default values
const initialState: BuilderState = {
  cameras: camerasData.reduce((acc, cam) => {
    acc[cam.id] = {
      quantity: cam.defaultQuantity,
      selectedColor: cam.colors && cam.colors.length > 0 ? cam.colors[0] : undefined,
    };
    return acc;
  }, {} as Record<string, CameraStateItem>),
  plans: {
    selectedPlanId: initialPlan ? initialPlan.id : "",
  },
  sensors: sensorsData.reduce((acc, s) => {
    acc[s.id] = { quantity: s.defaultQuantity };
    return acc;
  }, {} as Record<string, GenericStateItem>),
  protection: protectionData.reduce((acc, p) => {
    acc[p.id] = { quantity: p.defaultQuantity };
    return acc;
  }, {} as Record<string, GenericStateItem>),
};

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    incrementQuantity: (
      state,
      action: PayloadAction<{ section: "cameras" | "sensors" | "protection"; id: string }>
    ) => {
      const { section, id } = action.payload;
      if (state[section] && state[section][id]) {
        state[section][id].quantity += 1;
      }
    },
    decrementQuantity: (
      state,
      action: PayloadAction<{ section: "cameras" | "sensors" | "protection"; id: string }>
    ) => {
      const { section, id } = action.payload;
      if (state[section] && state[section][id] && state[section][id].quantity > 0) {
        state[section][id].quantity -= 1;
      }
    },
    setColor: (
      state,
      action: PayloadAction<{ section: "cameras"; id: string; color: string }>
    ) => {
      const { section, id, color } = action.payload;
      if (state[section] && state[section][id]) {
        state[section][id].selectedColor = color;
      }
    },
    selectPlan: (state, action: PayloadAction<string>) => {
      state.plans.selectedPlanId = action.payload;
    },



setBuilderState: (
  _state,
  action: PayloadAction<BuilderState>
) => {
  return action.payload;
},

  },





  
});

export const {
  incrementQuantity,
  decrementQuantity,
  setColor,
  selectPlan,
  setBuilderState,
} = builderSlice.actions;
// Selectors
export const selectBuilderState = (state: { builder: BuilderState }) => state.builder;

export interface SelectedItemDetails {
  id: string;
  name: string;
  image: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  isFree?: boolean;
  selectedColor?: string;
  billingCycle?: string;
  section: "cameras" | "plans" | "sensors" | "protection";
}

// Selector to get selected items with quantity > 0
export const selectSelectedItems = (state: { builder: BuilderState }): SelectedItemDetails[] => {
  const { cameras, plans, sensors, protection } = state.builder;
  const list: SelectedItemDetails[] = [];

  // Cameras
  camerasData.forEach((cam) => {
    const stateCam = cameras[cam.id];
    if (stateCam && stateCam.quantity > 0) {
      list.push({
        id: cam.id,
        name: cam.name,
        image: cam.image,
        quantity: stateCam.quantity,
        originalPrice: cam.originalPrice,
        discountedPrice: cam.discountedPrice,
        selectedColor: stateCam.selectedColor,
        section: "cameras",
      });
    }
  });

  // Active Plan
  const activePlan = plansData.find((p) => p.id === plans.selectedPlanId);
  if (activePlan) {
    list.push({
      id: activePlan.id,
      name: activePlan.name,
      image: activePlan.image,
      quantity: 1, // Plan is active (1x)
      originalPrice: activePlan.originalPrice,
      discountedPrice: activePlan.discountedPrice,
      billingCycle: activePlan.billingCycle,
      section: "plans",
    });
  }

  // Sensors
  sensorsData.forEach((s) => {
    const stateSensor = sensors[s.id];
    if (stateSensor && stateSensor.quantity > 0) {
      list.push({
        id: s.id,
        name: s.name,
        image: s.image,
        quantity: stateSensor.quantity,
        originalPrice: s.originalPrice,
        discountedPrice: s.discountedPrice,
        isFree: s.isFree,
        section: "sensors",
      });
    }
  });

  // Protection
  protectionData.forEach((p) => {
    const stateProt = protection[p.id];
    if (stateProt && stateProt.quantity > 0) {
      list.push({
        id: p.id,
        name: p.name,
        image: p.image,
        quantity: stateProt.quantity,
        originalPrice: p.originalPrice,
        discountedPrice: p.discountedPrice,
        isFree: p.isFree,
        section: "protection",
      });
    }
  });

  return list;
};

// Selector to get calculated totals
export const selectTotalPrice = (state: { builder: BuilderState }) => {
  const selectedItems = selectSelectedItems(state);

  const originalTotal = selectedItems.reduce(
    (acc, item) => acc + item.originalPrice * item.quantity,
    0
  );

  const discountedTotal = selectedItems.reduce(
    (acc, item) => (item.isFree ? acc : acc + item.discountedPrice * item.quantity),
    0
  );

  const savings = originalTotal - discountedTotal;

  return {
    originalTotal,
    discountedTotal,
    savings: savings > 0 ? savings : 0,
  };
};

export default builderSlice.reducer;
