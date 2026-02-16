import React from "react";
import { useTranslation } from "react-i18next";
import useAutoCarousel from "../../hooks/useAutoCarousel";

type Props = { forceMobile?: boolean };

const InfoStripe: React.FC<Props> = ({ forceMobile }) => {
  const { t } = useTranslation();
  const {
    currentIndex,
    containerRef,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useAutoCarousel({
    itemCount: 3,
    visibleItems: 1,
    autoScrollInterval: 3500,
    pauseOnHover: false,
  });

  const mobileContainerClass = forceMobile
    ? "block"
    : "block min-[1900px]:hidden";
  const desktopContainerClass = forceMobile
    ? "hidden"
    : "hidden min-[1900px]:flex";

  return (
    <div className="w-full bg-[var(--color-secondary)] border-y border-black/10 text-white">
      <div className="max-w-full mx-auto px-2 sm:px-4 md:px-8 py-2">
        <div className={`${mobileContainerClass} overflow-hidden`}>
          <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full overflow-hidden"
          >
            <div
              className="flex w-full"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: "transform 500ms ease",
              }}
            >
              <div className="w-full flex items-center justify-center gap-2 px-2 shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                  {t("shipping.tipsa")}
                </span>
                <img
                  src="/tipsa.png"
                  alt="TIPSA"
                  className="h-5 sm:h-6 w-auto invert brightness-0"
                />
              </div>
              <div className="w-full flex items-center justify-center gap-2 px-2 shrink-0">
                <div className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-auto"
                    viewBox="0 0 64 24"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="64"
                      height="24"
                      rx="4"
                      fill="#1A1F71"
                    />
                    <text
                      x="10"
                      y="16"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="700"
                    >
                      VISA
                    </text>
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-auto"
                    viewBox="0 0 64 24"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="64"
                      height="24"
                      rx="4"
                      fill="#000000"
                    />
                    <circle cx="28" cy="12" r="8" fill="#EB001B" />
                    <circle cx="36" cy="12" r="8" fill="#F79E1B" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-auto"
                    viewBox="0 0 64 24"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="64"
                      height="24"
                      rx="4"
                      fill="#2E77BC"
                    />
                    <text
                      x="6"
                      y="16"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="700"
                    >
                      AMEX
                    </text>
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-auto"
                    viewBox="0 0 64 24"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="64"
                      height="24"
                      rx="4"
                      fill="#000000"
                    />
                    <circle cx="30" cy="12" r="8" fill="#EB001B" />
                    <circle cx="38" cy="12" r="8" fill="#0099DF" />
                  </svg>
                </div>
              </div>
              <div className="w-full flex items-center justify-center gap-2 px-2 shrink-0">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 10-3.35 6.94" />
                  <path d="M21 12l-4 0" />
                  <path d="M21 12l-2-2" />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                  {t("returns.fourteenDays")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${desktopContainerClass} items-center justify-between gap-4 flex-nowrap whitespace-nowrap`}
        >
          <div className="flex items-center pl-6 basis-1/3 min-w-0 justify-start">
            <span className="text-base font-semibold text-white whitespace-nowrap">
              {t("shipping.tipsa")}
            </span>
            <img
              src="/tipsa.png"
              alt="TIPSA"
              className="h-7 w-auto invert brightness-0"
            />
          </div>
          <div className="flex items-center gap-3 basis-1/3 min-w-0 justify-center overflow-x-hidden">
            <span className="text-base font-semibold text-white whitespace-nowrap">
              {t("payments.methods")}
            </span>
            <div className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                className="h-5 w-auto"
                viewBox="0 0 64 24"
              >
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="24"
                  rx="4"
                  fill="#1A1F71"
                />
                <text
                  x="10"
                  y="16"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="700"
                >
                  VISA
                </text>
              </svg>
              <svg
                aria-hidden="true"
                className="h-5 w-auto"
                viewBox="0 0 64 24"
              >
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="24"
                  rx="4"
                  fill="#000000"
                />
                <circle cx="28" cy="12" r="8" fill="#EB001B" />
                <circle cx="36" cy="12" r="8" fill="#F79E1B" />
              </svg>
              <svg
                aria-hidden="true"
                className="h-5 w-auto"
                viewBox="0 0 64 24"
              >
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="24"
                  rx="4"
                  fill="#2E77BC"
                />
                <text
                  x="6"
                  y="16"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="700"
                >
                  AMEX
                </text>
              </svg>
              <svg
                aria-hidden="true"
                className="h-5 w-auto"
                viewBox="0 0 64 24"
              >
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="24"
                  rx="4"
                  fill="#000000"
                />
                <circle cx="30" cy="12" r="8" fill="#EB001B" />
                <circle cx="38" cy="12" r="8" fill="#0099DF" />
              </svg>
            </div>
            <span className="text-sm md:text-base text-white/80 whitespace-nowrap">
              {t("payments.processedByRedsys")}
            </span>
          </div>
          <div className="flex items-center gap-2 pr-6 lg:pr-12 basis-1/3 min-w-0 justify-end">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 10-3.35 6.94" />
              <path d="M21 12l-4 0" />
              <path d="M21 12l-2-2" />
            </svg>
            <span className="text-base font-semibold text-white whitespace-nowrap">
              {t("returns.fourteenDays")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStripe;
