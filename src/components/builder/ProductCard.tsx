import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  incrementQuantity,
  decrementQuantity,
  setColor,
} from "../../store/builderSlice";
import { QuantityStepper } from "./QuantityStepper";
import { VariantSelector } from "./VariantSelector";

// ── Camera images (high-res, color-aware) ──────────────────────────────────
import camV4White from "../../assets/images/7377c4c026acb3c476e41ccec1e0376490ee2cb9.png";
import camV4Grey from "../../assets/images/2989bafdebb392f5c271645b0aa3977ff131a2f7.png";
import camV4Black from "../../assets/images/dfa724c811c98887e295ddf6d1b842bf7f555246.png";
import panV3White from "../../assets/images/6e1650a4902c8e51d612c6363434bb36c8d74688.png";
import panV3Black from "../../assets/images/9635a12db624c130033a4166489f19d4dd442883.png";
import floodlightWhite from "../../assets/images/50a6f9b3cf2a431126be6488ddfca6647e979827.png";
import floodlightBlack from "../../assets/images/7d83d6ff32c0ddf80e1096fa37910875072ca87a.png";
import doorbellImg from "../../assets/images/0d7c4e5400ad8bef25d0ac786f415794250cefd5.png";
import batteryProWhite from "../../assets/images/25ced552047f1e871354f9620f3a60c5948b3b1a.png";

// ── Sensor / accessory images ──────────────────────────────────────────────
import motionSensorImg from "../../assets/images/Wyze Sense Motion Sensor.png";
import hubImg from "../../assets/images/Wyze Sense Hub.png";
import sdCardImg from "../../assets/images/Black 256GB microSD card with the Wyze logo on it. Includes Class 10 and UHS-3 (U3) labelling..png";
import shippingImg from "../../assets/images/Wyze Sense Keypad.png";

export interface ProductItem {
  id: string;
  image: string;
  badge?: string;
  name: string;
  description: string;
  learnMoreLink?: string;
  colors?: string[];
  originalPrice: number;
  discountedPrice: number;
  isFree?: boolean;
}

interface ProductCardProps {
  product: ProductItem;
  section: "cameras" | "sensors" | "protection";
}

// Resolve the correct PNG image based on product id + selected color
function resolveImg(
  productId: string,
  imageType: string,
  color?: string,
): string | null {
  const id = productId.toLowerCase();
  const col = (color || "white").toLowerCase();

  // Cameras
  if (id.includes("cam-v3") || id.includes("cam-v4")) {
    if (col === "black") return camV4Black;
    if (col === "grey" || col === "gray") return camV4Grey;
    return camV4White;
  }
  if (id.includes("pan")) {
    return col === "black" ? panV3Black : panV3White;
  }
  if (id.includes("floodlight")) {
    return col === "black" ? floodlightBlack : floodlightWhite;
  }
  if (id.includes("doorbell")) return doorbellImg;
  if (id.includes("battery-cam")) {
    // Black variant is achieved via CSS filter on the white image (see imgStyle below)
    return batteryProWhite;
  }

  // Sensors & accessories
  if (imageType === "sensor") return motionSensorImg;
  if (imageType === "hub") return hubImg;
  if (imageType === "sdcard") return sdCardImg;
  if (imageType === "shipping") return shippingImg;

  return null;
}

export function ProductCard({ product, section }: ProductCardProps) {
  const dispatch = useDispatch();

  const selectedColor = useSelector((state: RootState) => {
    if (section === "cameras") {
      return state.builder.cameras[product.id]?.selectedColor;
    }
    return undefined;
  });

  const quantity = useSelector((state: RootState) => {
    if (section === "cameras") {
      const cam = state.builder.cameras[product.id];
      if (!cam) return 0;
      const key = selectedColor ? selectedColor.toLowerCase() : "__default__";
      return cam.variantQuantities[key] ?? 0;
    }
    return (state.builder[section] as Record<string, { quantity: number }>)?.[product.id]?.quantity ?? 0;
  });

  const isSelected = quantity > 0;

  const imgSrc = resolveImg(product.id, product.image, selectedColor);

  return (
    <div
      // Frame spec (Figma): Width Fill 224.6px · Height Fill 331.1px
      // Radius 10px · Border 2px · Padding T15 R11 B15 L11 · BG #FFFFFF
      // Border color (selected): #4E2FD2 @ 70%
      className={`relative flex flex-col lg:flex-row xl:flex-col
  w-full h-full
  rounded-[10px]
  border-2
  pt-[15px]
  px-[11px]
  pb-[15px]
  gap-[19px] lg:gap-4 xl:gap-[19px]
  bg-white
  transition-all
  ${
    isSelected
      ? "border-[#4E2FD2]/70 shadow-sm shadow-[#4E2FD2]/10"
      : "border-gray-200 hover:border-gray-300"
  }`}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
              product.badge === "FREE" || product.badge === "Included FREE"
                ? "bg-emerald-500 text-white"
                : "bg-[#4E2FD2] text-white"
            }`}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Product Image */}
      {/* Product Image */}
      <div className="h-[104px] lg:w-[104px] lg:h-[104px] xl:w-auto xl:h-[104px] flex items-center justify-center flex-shrink-0">
        <div className="h-full flex items-center justify-center">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={product.name}
              className="max-h-[96px] max-w-[170px] lg:max-w-[104px] xl:max-w-[170px] object-contain"
              style={
                product.id.toLowerCase().includes("battery-cam") &&
                selectedColor?.toLowerCase() === "black"
                  ? { filter: "brightness(0.35) grayscale(1) contrast(1.1)" }
                  : undefined
              }
            />
          )}
        </div>
      </div>

      {/* Details — no extra padding here; the outer card already
          provides T15/R11/B15/L11 and the 19px gap from Figma */}
      <div className="flex flex-col gap-[8px] flex-1 min-w-0">
        <div>
          <h4 className="text-[11px] font-bold text-gray-900 leading-tight pb-1">
            {product.name}
          </h4>
          <p className="text-[10px] text-gray-500 leading-snug">
            {product.description}{" "}
            {product.learnMoreLink && (
              <a
                href={product.learnMoreLink}
                onClick={(e) => e.preventDefault()}
                className="text-[#4E2FD2] font-semibold hover:underline"
              >
                Learn More
              </a>
            )}
          </p>
        </div>

        {/* Color variants — only for cameras that have colors */}
        {product.colors && product.colors.length > 0 && (
          <VariantSelector
            productId={product.id}
            colors={product.colors}
            selectedColor={selectedColor}
            onSelect={(color) => {
              if (section === "cameras") {
                dispatch(
                  setColor({ section: "cameras", id: product.id, color }),
                );
              }
            }}
          />
        )}

        <div className=" mt-auto" />

        {/* Stepper + Price */}
        <div className="flex items-center justify-between gap-2">
          <QuantityStepper
            value={quantity}
            onIncrement={() =>
              dispatch(incrementQuantity({ section, id: product.id }))
            }
            onDecrement={() =>
              dispatch(decrementQuantity({ section, id: product.id }))
            }
          />

          <div className="flex items-center justify-end gap-1 whitespace-nowrap">
            {product.originalPrice > product.discountedPrice &&
              !product.isFree && (
                <span className="text-[16px] font-normal text-[#F15B5B] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}

            <span
              className={`text-[16px] font-normal leading-none ${
                product.isFree ? "text-emerald-600" : "text-[#6B7280]"
              }`}
            >
              {product.isFree
                ? "FREE"
                : `$${product.discountedPrice.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
