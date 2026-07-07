import { Provider } from "react-redux";
import { store } from "./store/store";
import { BuilderAccordion } from "./components/builder/BuilderAccordion";
import { SecuritySummary } from "./components/builder/SecuritySummary";

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 font-sans pt-10">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex flex-col gap-8">
            {/* Top: Accordion builder */}
            <section className="w-full">
              <BuilderAccordion />
            </section>

            {/* Bottom: Summary panel */}
            <section className="w-full">
              <SecuritySummary />
            </section>
          </div>
        </main>
      </div>
    </Provider>
  );
}
