import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type SectionId =
  | "descripcion"
  | "objetivos"
  | "valores"
  | "aplicacion"
  | "recomendaciones";

export interface AccordionProps {
  description: string | React.ReactNode;
  objectives?: string | React.ReactNode;
  nutritionalValues?: string | React.ReactNode;
  application?: string | React.ReactNode;
  recommendations?: string | React.ReactNode;
  defaultOpenId?: SectionId;
  white?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  description,
  objectives,
  nutritionalValues,
  application,
  recommendations,
  defaultOpenId,
  white = false,
}) => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<SectionId | undefined>(defaultOpenId);

  const items: { id: SectionId; title: string; content?: React.ReactNode }[] = [
    {
      id: "descripcion",
      title: t("accordion.description"),
      content: description,
    },
    { id: "objetivos", title: t("accordion.objectives"), content: objectives },
    {
      id: "valores",
      title: t("accordion.nutritionalValues"),
      content: nutritionalValues,
    },
    {
      id: "aplicacion",
      title: t("accordion.application"),
      content: application,
    },
    {
      id: "recomendaciones",
      title: t("accordion.recommendations"),
      content: recommendations,
    },
  ];

  const visibleItems = items.filter(
    (i) => i.content !== undefined && i.content !== null,
  );

  return (
    <div
      className={
        white
          ? "divide-y divide-black/10 rounded-xl border border-black/10 bg-transparent overflow-hidden"
          : "divide-y divide-black/10 rounded-xl border border-black/10 bg-[var(--color-primary)] overflow-hidden"
      }
    >
      {visibleItems.map(({ id, title, content }) => {
        const isOpen = openId === id;
        return (
          <div key={id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? undefined : id)}
              aria-expanded={isOpen}
              className={
                white
                  ? "w-full flex items-center justify-between px-4 md:px-6 py-4 bg-transparent hover:bg-black/5 text-left transition-colors"
                  : "w-full flex items-center justify-between px-4 md:px-6 py-4 bg-[var(--color-primary)] hover:bg-black/5 text-left transition-colors"
              }
            >
              <span
                className={
                  white
                    ? "text-sm md:text-base font-semibold text-black"
                    : "text-sm md:text-base font-semibold text-black"
                }
              >
                {title}
              </span>
              <svg
                className={`w-5 h-5 ${
                  white ? "text-black" : "text-black/60"
                } transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isOpen && (
              <div
                className={
                  white
                    ? "px-4 md:px-6 pb-5 pt-5 mt-2 border-t border-black/10 text-black text-sm md:text-base leading-relaxed"
                    : "px-4 md:px-6 pb-5 pt-5 text-black/70 text-sm md:text-base leading-relaxed bg-[var(--color-primary)]"
                }
              >
                {content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
