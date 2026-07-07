// Thumbnails for color variant buttons
import camV4WhiteThumb from "../../assets/images/483cbb867e0bd5a75fa3ea080af66126b709f997.png";
import camV4GreyThumb from "../../assets/images/2989bafdebb392f5c271645b0aa3977ff131a2f7.png";
import camV4BlackThumb from "../../assets/images/dfa724c811c98887e295ddf6d1b842bf7f555246.png";
import panV3WhiteThumb from "../../assets/images/a0088c61da6ff66f06d71bdbe9496a53344f2c0e.png";
import panV3BlackThumb from "../../assets/images/9635a12db624c130033a4166489f19d4dd442883.png";
import floodlightWhiteThumb from "../../assets/images/50a6f9b3cf2a431126be6488ddfca6647e979827.png";
import floodlightBlackThumb from "../../assets/images/7d83d6ff32c0ddf80e1096fa37910875072ca87a.png";
import batteryProWhiteThumb from "../../assets/images/25ced552047f1e871354f9620f3a60c5948b3b1a.png";

interface VariantSelectorProps {
  productId: string;
  colors: string[];
  selectedColor?: string;
  onSelect: (color: string) => void;
}

function getThumb(productId: string, color: string): string {
  const id = productId.toLowerCase();
  const col = color.toLowerCase();

  if (id.includes("cam-v3") || id.includes("cam-v4")) {
    if (col === "black") return camV4BlackThumb;
    if (col === "grey" || col === "gray") return camV4GreyThumb;
    return camV4WhiteThumb;
  }
  if (id.includes("pan")) {
    return col === "black" ? panV3BlackThumb : panV3WhiteThumb;
  }
  if (id.includes("floodlight")) {
    return col === "black" ? floodlightBlackThumb : floodlightWhiteThumb;
  }
  if (id.includes("battery-cam")) {
    return batteryProWhiteThumb;
  }

  // Safe fallback
  return camV4WhiteThumb;
}

export function VariantSelector({
  productId,
  colors,
  selectedColor,
  onSelect,
}: VariantSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="flex flex-row justify-start items-center gap-1 w-full overflow-hidden select-none">
      {colors.map((color) => {
        const isSelected = selectedColor === color;
        const thumb = getThumb(productId, color);
        const colLower = color.toLowerCase();

        // If it's battery-cam and color is black, apply a high-quality CSS filter to make the white image black.
        const isBlackBatteryPro = productId.toLowerCase().includes("battery-cam") && colLower === "black";
        const filterStyle = isBlackBatteryPro
          ? { filter: "brightness(0.35) grayscale(1) contrast(1.1)" }
          : undefined;

        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all duration-100 text-[8.5px] font-bold bg-white select-none whitespace-nowrap ${
              isSelected
                ? "border-violet-600 text-violet-700 bg-violet-50/20"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <img
              src={thumb}
              alt={color}
              className="w-3.5 h-3.5 object-contain"
              style={filterStyle}
            />
            <span>{color}</span>
          </button>
        );
      })}
    </div>
  );
}