import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { saveBuilder } from "../../store/builderThunks";
import { toast } from "sonner";
import {
  selectSelectedItems,
  selectTotalPrice,
  incrementQuantity,
  decrementQuantity,
} from "../../store/builderSlice";
import { QuantityStepper } from "./QuantityStepper";

import camV4WhiteThumb from "../../assets/images/483cbb867e0bd5a75fa3ea080af66126b709f997.png";
import Frame from "../../assets/images/Frame 17.png";
import camV4GreyThumb from "../../assets/images/2989bafdebb392f5c271645b0aa3977ff131a2f7.png";
import camV4BlackThumb from "../../assets/images/dfa724c811c98887e295ddf6d1b842bf7f555246.png";
import panV3WhiteThumb from "../../assets/images/a0088c61da6ff66f06d71bdbe9496a53344f2c0e.png";
import panV3BlackThumb from "../../assets/images/9635a12db624c130033a4166489f19d4dd442883.png";
import floodlightWhiteThumb from "../../assets/images/50a6f9b3cf2a431126be6488ddfca6647e979827.png";
import floodlightBlackThumb from "../../assets/images/7d83d6ff32c0ddf80e1096fa37910875072ca87a.png";
import doorbellThumb from "../../assets/images/0d7c4e5400ad8bef25d0ac786f415794250cefd5.png";
import batteryProThumb from "../../assets/images/25ced552047f1e871354f9620f3a60c5948b3b1a.png";
import motionSensorThumb from "../../assets/images/Wyze Sense Motion Sensor.png";
import hubThumb from "../../assets/images/Wyze Sense Hub.png";
import sdCardThumb from "../../assets/images/Black 256GB microSD card with the Wyze logo on it. Includes Class 10 and UHS-3 (U3) labelling..png";
import shippingThumb from "../../assets/images/Wyze Sense Keypad.png";
import guaranteeSeal from "../../assets/images/991e1497c0a1c9e070778c8eb0abab6e98ddb05a.png";
import wyzeLogoThumb from "../../assets/images/Layer_1.png";

function resolveThumb(
  productId: string,
  imageType: string,
  section: string,
  color?: string,
): string | null {
  const id = productId.toLowerCase();
  const col = (color || "white").toLowerCase();
  if (section === "cameras") {
    if (id.includes("cam-v3") || id.includes("cam-v4")) {
      if (col === "black") return camV4BlackThumb;
      if (col === "grey" || col === "gray") return camV4GreyThumb;
      return camV4WhiteThumb;
    }
    if (id.includes("pan"))
      return col === "black" ? panV3BlackThumb : panV3WhiteThumb;
    if (id.includes("floodlight"))
      return col === "black" ? floodlightBlackThumb : floodlightWhiteThumb;
    if (id.includes("doorbell")) return doorbellThumb;
    if (id.includes("battery-cam")) return batteryProThumb;
  }
  if (imageType === "sensor") return motionSensorThumb;
  if (imageType === "hub") return hubThumb;
  if (imageType === "sdcard") return sdCardThumb;
  if (imageType === "plan") return wyzeLogoThumb;
  if (imageType === "shipping") return shippingThumb;
  return null;
}

interface ThumbProps {
  productId: string;
  imageType: string;
  section: string;
  selectedColor?: string;
}

function Thumb({ productId, imageType, section, selectedColor }: ThumbProps) {
  const pngSrc = resolveThumb(productId, imageType, section, selectedColor);
  const isBlackBatteryPro =
    productId.toLowerCase().includes("battery-cam") &&
    selectedColor?.toLowerCase() === "black";
  return (
    <div className="w-9 h-9 rounded-lg bg-slate-100 p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
      {pngSrc && (
        <img
          src={pngSrc}
          alt={productId}
          className="w-full h-full object-contain"
          style={
            isBlackBatteryPro
              ? { filter: "brightness(0.35) grayscale(1) contrast(1.1)" }
              : undefined
          }
        />
      )}
    </div>
  );
}

export function SecuritySummary() {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectSelectedItems);
  const { originalTotal, discountedTotal, savings } =
    useAppSelector(selectTotalPrice);
  const fullState = useAppSelector((state: RootState) => state);

  const cameras = selectedItems.filter((i) => i.section === "cameras");
  const plans = selectedItems.filter((i) => i.section === "plans");
  const sensors = selectedItems.filter((i) => i.section === "sensors");
  const accessories = selectedItems.filter((i) => i.section === "protection");

  const renderSection = (title: string, items: typeof selectedItems) => {
    if (items.length === 0) return null;
    return (
      <div>
        <p className="text-[9px] font-black tracking-widest uppercase text-gray-400 mb-1">
          {title}
        </p>
        <div className="divide-y divide-gray-50">
          {items.map((item) => {
            const finalPrice = item.isFree
              ? 0
              : item.discountedPrice * item.quantity;
            const origPrice = item.originalPrice * item.quantity;
            return (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <Thumb
                  productId={item.id}
                  imageType={item.image}
                  section={item.section}
                  selectedColor={item.selectedColor}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-gray-800 leading-tight truncate">
                    {item.name}
                  </p>
                </div>
                {item.section === "plans" ||
                  item.id === "wyze-fast-shipping" ? (
                  <span className="text-[10px] text-gray-500 font-medium mr-4"></span>
                ) : (
                  <QuantityStepper
                    value={item.quantity}
                    onIncrement={() =>
                      dispatch(
                        incrementQuantity({
                          section: item.section as
                            | "cameras"
                            | "sensors"
                            | "protection",
                          id: item.id,
                        }),
                      )
                    }
                    onDecrement={() =>
                      dispatch(
                        decrementQuantity({
                          section: item.section as
                            | "cameras"
                            | "sensors"
                            | "protection",
                          id: item.id,
                        }),
                      )
                    }
                  />
                )}
                {/* Price: inline on laptop (lg), stacked elsewhere */}
                <div
                  className="
    flex
    flex-col
    items-end
    gap-0.5
    text-right

    2xl:flex-row
    2xl:items-center
    2xl:gap-1.5
  "
                >

                  {!item.isFree && origPrice > finalPrice && (
                    <span className="text-[9px] text-gray-600 line-through leading-none lg:leading-normal">
                      ${origPrice.toFixed(2)}
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold leading-tight lg:leading-normal ${item.isFree ? "text-[#4E2FD2]" : "text-[#4E2FD2]"
                      }`}
                  >
                    {item.isFree
                      ? "FREE"
                      : `$${finalPrice.toFixed(2)}${item.billingCycle === "monthly" ? "/mo" : ""}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Ordered list of sections so we can add a divider BETWEEN sections
  // (Cameras / Sensors / Accessories / Plan) — only between them, not
  // before the first one.
  const orderedSections = [
    { title: "Cameras", items: cameras },
    { title: "Sensors", items: sensors },
    { title: "Accessories", items: accessories },
    { title: "Plan", items: plans },
  ].filter((s) => s.items.length > 0);

  return (
    /*
      الـ parent: bg #EDF4FF، border، padding 15px top، gap 5px — من الـ Figma Frame 1736
      الـ layout: Horizontal، gap 52px بين اليسار واليمين
    */
    <div
      className="rounded-xl border border-blue-100 overflow-hidden p-2 xl:p-[15px]"
      style={{ backgroundColor: "#EDF4FF" }}
    >
      <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-6 md:gap-[52px] lg:gap-6 xl:gap-[52px]">
        {/* Header + Items ══ */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ gap: "5px" }}>
          {/* Header */}
          <div>
            <h2
              className="text-gray-900"
              style={{
                fontWeight: 400,
                fontSize: "28px",
                lineHeight: "100%",
                letterSpacing: "0.6px",
                verticalAlign: "middle",
              }}
            >
              Your security system
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>
          </div>

          {/* Items */}
          {selectedItems.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              No items selected yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {orderedSections.map((s) => (
                <div key={s.title}>
                  <hr className="border-t border-gray-200 mb-3" />
                  {renderSection(s.title, s.items)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="flex-shrink-0 flex flex-col w-full md:w-[486px] lg:w-full xl:w-[486px] gap-1 xl:gap-2"
          style={{ gap: "8px" }}
        >
          {/* Guarantee seal row — نفس التصميم في كل المقاسات (موبايل/تابلت/لاب)، وبس عند xl الشاشة الكبيرة بيرجع للتصميم التاني تحت */}
          <div className="flex xl:hidden justify-between items-start px-0 md:px-2">
            {" "}
            {/* LEFT */}
            <img
              src={guaranteeSeal}
              alt="Guarantee"
              className="w-16 h-16 object-contain flex-shrink-0"
            />
            {/* RIGHT */}
            <div className="flex flex-col items-end">
              {/* Badge */}
              <img
                src={Frame}
                alt="As low as"
                className="h-7 object-contain mb-2"
              />

              {/* Prices */}
              <div className="flex items-end gap-2">
                {originalTotal > discountedTotal && (
                  <span className="text-gray-400 line-through text-xs">
                    ${originalTotal.toFixed(2)}
                  </span>
                )}

                <span className="text-2xl font-black text-violet-700">
                  ${discountedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee seal row — شاشة اللاب الكبيرة (xl) بس: التصميم القديم الأفقي */}
          <div className="hidden xl:flex items-center gap-3 rounded-xl p-3">
            <img
              src={guaranteeSeal}
              alt="30-day guarantee"
              className="w-16 h-16 flex-shrink-0 object-contain"
            />
            <div>
              <p className="text-[13px] font-bold text-gray-800 leading-tight">
                30-day hassle-free returns
              </p>
              <p className="text-[11px] text-gray-500 leading-snug mt-1">
                If you're not totally in love with the product, we will refund
                you 100%.
              </p>
            </div>
          </div>
          <div className="hidden xl:flex items-center justify-between px-1">
            <img
              src={Frame}
              alt="as low as"
              className="h-7 object-contain object-left"
            />
            <div className="flex flex-col items-end text-right">
              {originalTotal > discountedTotal && (
                <span className="text-xs text-gray-400 line-through leading-none">
                  ${originalTotal.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-black text-violet-700 leading-none">
                ${discountedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Savings */}
          {savings > 0 && (
            <p className="text-center text-[11px] font-semibold text-emerald-700 mt-2">
              Congrats! You're saving ${savings.toFixed(2)} on your security
              bundle!
            </p>
          )}

          {/* Checkout */}
          <button
            type="button"
            className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-sm py-3   shadow-md shadow-violet-200 transition-colors"
          >
            Checkout
          </button>

          {/* Save link */}
          <button
            type="button"
            onClick={() => {
              try {
                dispatch(saveBuilder());
                toast.success("Saved successfully", {
                  description:
                    "Your security system has been saved. You can come back later and continue where you left off.",
                  duration: 3000,
                });
              } catch (err) {
                console.error("Failed to save system", err);
              }
            }}
            className="w-full text-[11px] font-semibold text-gray-500 text-center py-1 hover:underline"
          >
            Save my system for later
          </button>
        </div>
      </div>
    </div>
  );
}
