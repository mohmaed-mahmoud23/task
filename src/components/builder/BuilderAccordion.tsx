import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import camerasData from "../../data/cameras.json";
import sensorsData from "../../data/sensors.json";
import protectionData from "../../data/protection.json";
import photo from "../../assets/images/Group 1417.png";
import photo2 from "../../assets/images/Frame 1419.png";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard, type ProductItem } from "./ProductCard";
import PlanSelector from "./PlanSelector";

// Cast JSON imports to ProductItem[]
const cameras = camerasData as ProductItem[];
const sensors = sensorsData as ProductItem[];
const protection = protectionData as ProductItem[];

// ── Step Icons — PIXEL PERFECT matching Figma ─────────────────────────────────
// Webcam icon (Choose your cameras)
function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="flex-shrink-0"
    >
      {/* Rounded square camera body */}
      <rect
        x="4"
        y="3"
        width="16"
        height="14"
        rx="3"
        stroke="#9CA3AF"
        strokeWidth="1.8"
        fill="#F3F4F6"
      />
      {/* Large circle lens */}
      <circle cx="12" cy="9.5" r="3.5" stroke="#9CA3AF" strokeWidth="1.8" />
      {/* Tiny dot inside lens */}
      <circle cx="12" cy="9.5" r="0.8" fill="#9CA3AF" />
      {/* Small status light dot below lens */}
      <circle cx="12" cy="14" r="0.8" fill="#9CA3AF" />
      {/* Trapezoid/angled stand at the bottom */}
      <path
        d="M7 21h10M10 17v4M14 17v4"
        stroke="#9CA3AF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Plan icon: simple shield outline with light fill
function PlanIcon() {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      className="flex-shrink-0"
    >
      <path
        d="M8 1.5L2 4.2v5.3c0 3.6 2.6 6.9 6 7.8 3.4-.9 6-4.2 6-7.8V4.2L8 1.5z"
        stroke="#9CA3AF"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="#F3F4F6"
      />
    </svg>
  );
}

// Sensor icon: wifi/signal arcs (concentric arcs around center dot)
function SensorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <circle cx="12" cy="12" r="2.5" fill="#9CA3AF" />
      {/* Left waves */}
      <path d="M8.5 8.5c-2 2-2 5 0 7M5.5 5.5c-3.6 3.6-3.6 9.4 0 13" />
      {/* Right waves */}
      <path d="M15.5 8.5c2 2 2 5 0 7M18.5 5.5c3.6 3.6 3.6 9.4 0 13" />
    </svg>
  );
}

// Protection icon: shield with checkmark inside
function ProtectionIcon() {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      className="flex-shrink-0"
    >
      <path
        d="M8 1.5L2 4.2v5.3c0 3.6 2.6 6.9 6 7.8 3.4-.9 6-4.2 6-7.8V4.2L8 1.5z"
        stroke="#9CA3AF"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="#F3F4F6"
      />
      <path
        d="M5.5 9.5l1.5 1.5 3.5-3.5"
        stroke="#9CA3AF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Chevron ───────────────────────────────────────────────────────────────────
function ChevronDown() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-blue-600 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

// ── Step Header ───────────────────────────────────────────────────────────────
interface StepHeaderProps {
  step: number;
  total: number;
  title: string;
  icon: React.ReactNode;
}

function StepHeader({ step, total, title, icon }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-3.5 flex-1">
      {icon}
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
          Step {step} of {total}
        </span>
        <span className="text-sm font-bold text-gray-800 leading-tight">
          {title}
        </span>
      </div>
    </div>
  );
}

// ── Next Step Button ──────────────────────────────────────────────────────────
interface NextButtonProps {
  label: string;
  onClick: () => void;
}

function NextButton({ label, onClick }: NextButtonProps) {
  return (
    <div className="flex justify-center mt-4">
      <button
        type="button"
        onClick={onClick}
        className="bg-transparent border-1 border-[#4E2FD2] hover:bg-[#4E2FD2]/5 active:bg-[#4E2FD2]/10 text-[#4E2FD2] text-sm font-bold px-4 py-2  rounded-sm transition-colors"
      >
        {label}
      </button>
    </div>
  );
}

// ── Product Grid ──────────────────────────────────────────────────────────────
interface ProductGridProps {
  products: ProductItem[];
  section: "cameras" | "sensors" | "protection";
}

function ProductGrid({ products, section }: ProductGridProps) {
  if (section === "cameras") {
    return (
      <>
        {/* Mobile (< xl): 2-column grid */}
        <div className="grid grid-cols-2 gap-4 xl:hidden">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} section={section} />
          ))}
        </div>
        {/*
          Desktop (xl+): 5-column equal-width grid — Frame 1735 Figma spec.
          Cards fill the available left-column width evenly.
          gap-4 = 16px (Figma cards gap).
        */}
        <div className="hidden xl:grid grid-cols-5 gap-4 items-stretch">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} section={section} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile (< xl): 2-column grid — Frame 1736 */}
      <div className="grid grid-cols-2 gap-4 xl:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} section={section} />
        ))}
      </div>
      {/* Desktop (xl+): horizontal scroll row — Frame 1735 */}
      <div className="hidden xl:flex gap-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {products.map((product) => (
          <div key={product.id} className="w-[224.6px] min-w-[224.6px]">
            <ProductCard product={product} section={section} />
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function BuilderAccordion() {
  const [openItems, setOpenItems] = useState<string[]>(["cameras"]);

  // Calculate selection counts to display in triggers
  const camerasCount = useSelector((state: RootState) =>
    Object.values(state.builder.cameras).reduce(
      (acc, c) => acc + c.quantity,
      0,
    ),
  );
  const sensorsCount = useSelector((state: RootState) =>
    Object.values(state.builder.sensors).reduce(
      (acc, s) => acc + s.quantity,
      0,
    ),
  );
  const protectionCount = useSelector((state: RootState) =>
    Object.values(state.builder.protection).reduce(
      (acc, p) => acc + p.quantity,
      0,
    ),
  );

  function openNext(next: string) {
    setOpenItems((prev) => (prev.includes(next) ? prev : [...prev, next]));
    setTimeout(() => {
      const el = document.getElementById(`accordion-${next}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <Accordion
      value={openItems}
      onValueChange={setOpenItems}
      className="flex flex-col gap-4 w-full"
    >
      {/* STEP 1: Cameras */}
      <AccordionItem
        id="accordion-cameras"
        value="cameras"
        className="border border-blue-200 rounded-xl bg-blue-50 shadow-sm overflow-hidden"
      >
        <AccordionTrigger className="px-5 py-4 hover:no-underline [&>svg]:hidden">
          <div className="flex items-center justify-between w-full">
            <StepHeader
              step={1}
              total={4}
              title="Choose your cameras"
              icon={<CameraIcon />}
            />
            <div className="flex items-center gap-1">
              {camerasCount > 0 && (
                <span className="text-xs font-bold text-[#4E2FD2] mr-1">
                  {camerasCount} selected
                </span>
              )}
              <ChevronDown />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-5 pt-2">
          <div className="  rounded-xl p-3 ">
            <ProductGrid products={cameras} section="cameras" />
          </div>
          <NextButton
            label="Next: Choose your sensors"
            onClick={() => openNext("sensors")}
          />
        </AccordionContent>
      </AccordionItem>

      {/* STEP 2: Plan */}
      <AccordionItem
        id="accordion-plan"
        value="plan"
        className="bordershadow-sm overflow-hidden"
      >
        <AccordionTrigger className="px-5 py-4 border-blue-20 hover:no-underline [&>svg]:hidden">
          <div className="flex items-center justify-between w-full">
            <StepHeader
              step={2}
              total={4}
              title="Choose your plan"
              icon={<PlanIcon />}
            />
            <ChevronDown />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-5 pt-2">
          <div
            className="
           rounded-xl p-4 "
          >
            <PlanSelector />
          </div>
          <NextButton
            label="Next: Add extra protection"
            onClick={() => openNext("protection")}
          />
        </AccordionContent>
      </AccordionItem>

      {/* STEP 3: Sensors */}
      <AccordionItem
        id="accordion-sensors"
        value="sensors"
        className="border rounded-xl shadow-sm overflow-hidden"
      >
        <AccordionTrigger className="px-5 py-4 hover:no-underline [&>svg]:hidden">
          <div className="flex items-center justify-between w-full">
            <StepHeader
              step={3}
              total={4}
              title="Choose your sensors"
              icon={
                <img
                  src={photo}
                  alt="Sensors"
                  className="w-[18px] h-[18px] object-contain flex-shrink-0"
                />
              }
            />
            <div className="flex items-center gap-1">
              {sensorsCount > 0 && (
                <span className="text-xs font-bold text-[#4E2FD2] mr-1">
                  {sensorsCount} selected
                </span>
              )}
              <ChevronDown />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-5 pt-2">
          <div className="  rounded-xl p-3">
            <ProductGrid products={sensors} section="sensors" />
          </div>
          <NextButton
            label="Next: Choose your plan"
            onClick={() => openNext("plan")}
          />
        </AccordionContent>
      </AccordionItem>

      {/* STEP 4: Protection */}
      <AccordionItem
        id="accordion-protection"
        value="protection"
        className="border rounded-xl  shadow-sm overflow-hidden"
      >
        <AccordionTrigger className="px-5 py-4 hover:no-underline [&>svg]:hidden">
          <div className="flex items-center justify-between w-full">
            <StepHeader
              step={3}
              total={4}
              title="Add extra protection"
              icon={
                <img
                  src={photo2}
                  alt="Sensors"
                  className="w-[18px] h-[18px] object-contain flex-shrink-0"
                />
              }
            />
            <div className="flex items-center gap-1">
              {protectionCount > 0 && (
                <span className="text-xs font-bold text-[#4E2FD2] mr-1">
                  {protectionCount} selected
                </span>
              )}
              <ChevronDown />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-5 pt-2">
          <div className=" rounded-xl p-3 ">
            <ProductGrid products={protection} section="protection" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
