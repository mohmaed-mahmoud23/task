import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-[10px] select-none">
      {/* Minus Button — outlined, light icon */}
      <button
        type="button"
        onClick={onDecrement}
        disabled={value === 0}
        className={`w-[21px] h-[21px] flex items-center justify-center rounded-[5px] border border-gray-200 bg-white transition-colors ${
          value === 0 ? "cursor-not-allowed" : "hover:bg-gray-50"
        }`}
      >
        <Minus className="w-[10px] h-[10px] text-gray-300" />
      </button>

      {/* Value */}
      <span className="text-[13px] font-semibold text-gray-900">{value}</span>

      {/* Plus Button — filled, darker icon */}
      <button
        type="button"
        onClick={onIncrement}
        className="w-[21px] h-[21px] flex items-center justify-center rounded-[5px] bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <Plus className="w-[10px] h-[10px] text-gray-600" />
      </button>
    </div>
  );
}
