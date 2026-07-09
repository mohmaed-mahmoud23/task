import { BuilderAccordion } from "./components/builder/BuilderAccordion";
import { SecuritySummary } from "./components/builder/SecuritySummary";
import { Toaster } from "sonner";

export default function App() {
  return (
      <div className="min-h-screen bg-gray-50 font-sans pt-10">
        <Toaster position="top-right" richColors />
        <main
          className="
            max-w-screen-xl mx-auto px-4 sm:px-6 pb-1 lg:pb-12
            lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:items-start
            xl:block
          "
        >
          {/* ── Mobile-only: Let's get started banner ── */}
          <div className="sm:hidden mb-4">
            <div className=" rounded-lg py-3 text-center">
              <span className="text-shadow-black font-black text-[31.88px]">
                Let's get started!
              </span>
            </div>
          </div>

          <BuilderAccordion />

          <div
            className="
              mt-6
              lg:mt-0 lg:sticky lg:top-6
              xl:mt-8 xl:static
            "
          >
            {/* ── Mobile-only: REVIEW label ── */}
            <p className="sm:hidden text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 px-1">
              Review
            </p>
            <SecuritySummary />
          </div>
        </main>
      </div>
  );
}
