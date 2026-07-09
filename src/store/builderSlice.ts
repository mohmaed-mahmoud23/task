import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import camerasData from "../data/cameras.json";
import plansData from "../data/plans.json";
import sensorsData from "../data/sensors.json";
import protectionData from "../data/protection.json";

// TypeScript Interfaces
export interface CameraStateItem {
  /** Quantity per color variant. Key is the lowercase color name.
   *  Cameras without colors use the sentinel key "__default__". */
  variantQuantities: Record<string, number>;
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

// Helper: canonical key for a camera variant
const variantKey = (color?: string) =>
  color ? color.toLowerCase() : "__default__";

// Initial State built from JSON default values
const initialState: BuilderState = {
  cameras: camerasData.reduce((acc, cam) => {
    const hasColors = cam.colors && cam.colors.length > 0;
    const variantQuantities: Record<string, number> = {};
    if (hasColors) {
      (cam.colors as string[]).forEach((c) => {
        variantQuantities[c.toLowerCase()] = 0;
      });
    } else {
      variantQuantities["__default__"] = cam.defaultQuantity;
    }
    acc[cam.id] = {
      variantQuantities,
      selectedColor: hasColors ? (cam.colors as string[])[0] : undefined,
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
      action: PayloadAction<{ section: "cameras" | "sensors" | "protection"; id: string; color?: string }>
    ) => {
      const { section, id, color } = action.payload;
      if (section === "cameras") {
        const cam = state.cameras[id];
        if (cam) {
          const key = variantKey(color ?? cam.selectedColor);
          cam.variantQuantities[key] = (cam.variantQuantities[key] ?? 0) + 1;
        }
      } else {
        if (state[section] && state[section][id]) {
          (state[section][id] as GenericStateItem).quantity += 1;
        }
      }
    },
    decrementQuantity: (
      state,
      action: PayloadAction<{ section: "cameras" | "sensors" | "protection"; id: string; color?: string }>
    ) => {
      const { section, id, color } = action.payload;
      if (section === "cameras") {
        const cam = state.cameras[id];
        if (cam) {
          const key = variantKey(color ?? cam.selectedColor);
          if ((cam.variantQuantities[key] ?? 0) > 0) {
            cam.variantQuantities[key] -= 1;
          }
        }
      } else {
        if (state[section] && state[section][id] && (state[section][id] as GenericStateItem).quantity > 0) {
          (state[section][id] as GenericStateItem).quantity -= 1;
        }
      }
    },
    setColor: (
      state,
      action: PayloadAction<{ section: "cameras"; id: string; color: string }>
    ) => {
      const { section, id, color } = action.payload;
      if (state[section] && state[section][id]) {
        state[section][id].selectedColor = color;
        // Ensure the new variant slot exists
        const key = variantKey(color);
        if (state[section][id].variantQuantities[key] === undefined) {
          state[section][id].variantQuantities[key] = 0;
        }
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
  /** For camera variants, this is the real product id (without the color suffix). */
  baseId?: string;
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

  // Cameras — emit one entry per variant that has qty > 0
  camerasData.forEach((cam) => {
    const stateCam = cameras[cam.id];
    if (!stateCam) return;
    const hasColors = cam.colors && cam.colors.length > 0;
    if (hasColors) {
      (cam.colors as string[]).forEach((color) => {
        const key = color.toLowerCase();
        const qty = stateCam.variantQuantities[key] ?? 0;
        if (qty > 0) {
          list.push({
            // Use a composite id so each variant is a distinct Review row
            id: `${cam.id}__${key}`,
            baseId: cam.id,
            name: `${cam.name} (${color})`,
            image: cam.image,
            quantity: qty,
            originalPrice: cam.originalPrice,
            discountedPrice: cam.discountedPrice,
            selectedColor: color,
            section: "cameras",
          });
        }
      });
    } else {
      const qty = stateCam.variantQuantities["__default__"] ?? 0;
      if (qty > 0) {
        list.push({
          id: cam.id,
          name: cam.name,
          image: cam.image,
          quantity: qty,
          originalPrice: cam.originalPrice,
          discountedPrice: cam.discountedPrice,
          selectedColor: stateCam.selectedColor,
          section: "cameras",
        });
      }
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
