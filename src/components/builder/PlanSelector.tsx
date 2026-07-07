import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { selectPlan } from "../../store/builderSlice";
import plansData from "../../data/plans.json";

export default function PlanSelector() {
  const dispatch = useDispatch();
  const selectedPlanId = useSelector((state: RootState) => state.builder.plans.selectedPlanId);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plansData.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => dispatch(selectPlan(plan.id))}
              className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all duration-150 relative bg-white ${
                isSelected
                  ? "border-violet-600 bg-violet-50/30 shadow-md shadow-violet-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <span className="absolute top-2.5 right-3 bg-violet-600 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}

              {/* Radio Indicator */}
              <div className="flex items-start gap-3 w-full">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? "border-violet-600" : "border-gray-300"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">
                    {plan.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mt-3">
                    <span className="text-xs font-black text-gray-900">
                      ${plan.discountedPrice.toFixed(2)}/mo
                    </span>
                    {plan.originalPrice > plan.discountedPrice && (
                      <span className="text-[9px] text-gray-400 line-through">
                        ${plan.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
