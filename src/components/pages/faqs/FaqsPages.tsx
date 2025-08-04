import React, { useEffect, useRef, useState } from "react";
import FAQQueryComponent from "./FAQQueryComponent";
import { faqs } from "../../../helper/constants";
import { useSearchParams } from "react-router-dom";

const FaqsPages = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const moduleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [searchParams] = useSearchParams();
  const scrollToId = searchParams.get("st");

  const handleModuleClick = (moduleName: string) => {
    setActiveModule(moduleName);
    const el = moduleRefs.current[moduleName];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const defaultModule = faqs[0].module;

    const targetId = scrollToId || defaultModule;
    setActiveModule(targetId);
    const el = moduleRefs.current[targetId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollToId]);

  return (
    <div className="d-flex vh-100 overflow-hidden">
      <div
        className="w-20 border-end px-4 py-3 text-start bg-secondary-subtle"
        style={{
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ul className="list-unstyled">
          {faqs.map((item, index) => (
            <li
              key={index}
              onClick={() => handleModuleClick(item.module)}
              className={`cursor-pointer py-2 px-3 mb-1 rounded ${
                activeModule === item.module
                  ? "bg-secondary text-white"
                  : "text-gray-800"
              }`}
              style={{
                cursor: "pointer",
              }}
            >
              {item.module}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="flex-grow-1 px-3 py-2 mt-2"
        style={{
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {faqs.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              moduleRefs.current[item.module] = el;
            }}
            className={`mb-5 p-2 rounded ${
              activeModule === item.module
                ? "border border-secondary bg-light"
                : ""
            }`}
          >
            <FAQQueryComponent
              moduleName={item.module}
              questions={item.questions}
            />
          </div>
        ))}
      </div>

      {/* Hide scrollbars globally for these divs */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FaqsPages;
