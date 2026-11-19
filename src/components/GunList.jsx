import React, { useEffect, useMemo, useRef } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import "../app.css";
import { useState } from "react";
import GunCard from "./GunCard";
import { getAttachmentImage } from "../services/attachmentImages";
import { gunTypes } from "../services/gunCat";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ref, runTransaction } from "firebase/database";
import { db } from "../services/firebase";

const GunList = ({
  guns,
  showGuns,
  gunType,
  setShowGunsmith,
  setGunData,
  windowSize,
  filter,
  setFilter,
  top,
  setTop,
  editTop10,
  searchQuery,
  sortReverse,
  scrollParent,
  selectedSideBar,
}) => {
  const [selectedBuild, setSelectedBuild] = useState("Main");
  const gunListRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const width = document.documentElement.clientWidth;
  const INITIAL_GUNS = 5;
  const GUNS_PER_LOAD = 5;

  const handlePlace = (value) => {
    const place =
      typeof value === "object"
        ? gunType === "All Guns"
          ? Number(value.metaPlace)
          : gunType === "chizPage"
            ? Number(value.chizFave)
            : Number(value.gunTypePlace)
        : Number(value);

    if (place === 1) return "first-place";
    if (place === 2) return "second-place";
    if (place === 3) return "third-place";

    return "";
  };

  const filteredGuns = useMemo(() => {
    const filtered = guns.filter((gun) => {
      // Search
      if (
        searchQuery &&
        !gun.gunName?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Overall ranking
      if (gunType === "All Guns") {
        if (showGuns === "chizPage") {
          return gun.chizFave >= 1 && gun.chizFave <= 10;
        }
        if (showGuns === "top3") {
          return gun.metaPlace >= 1 && gun.metaPlace <= 3;
        }
        if (showGuns === "editMode" && editTop10) {
          return !gun.metaPlace;
        }

        if (showGuns === "meta") {
          return gun.metaPlace >= 1 && gun.metaPlace <= 10;
        }

        if (showGuns === "homePage") {
          return gun.metaPlace >= 1 && gun.metaPlace <= 10;
        }

        if (showGuns === "all") {
          return true;
        }
      }

      // Category ranking
      if (gunType !== "gunsPage" && gun.gunType !== gunType) {
        return false;
      }

      // Exclude guns that already have a category rank
      if (showGuns === "editMode" && gun.gunTypePlace) {
        return false;
      }

      if (showGuns === "top3") {
        return gun.gunTypePlace >= 1 && gun.gunTypePlace <= 3;
      }

      if (showGuns === "meta" || showGuns === "homePage") {
        return gun.gunTypePlace >= 1 && gun.gunTypePlace <= 10;
      }

      if (showGuns === "editMode") {
        return true;
      }

      if (showGuns === "gunsPage") {
        return true;
      }

      return false;
    });

    if (showGuns !== "gunsPage" && showGuns !== "editMode") {
      return filtered.sort((a, b) => {
        const placeA =
          gunType === "All Guns" && showGuns !== "chizPage"
            ? a.metaPlace
            : gunType === "All Guns" && showGuns === "chizPage"
              ? a.chizFave
              : a.gunTypePlace;
        const placeB =
          gunType === "All Guns" && showGuns !== "chizPage"
            ? b.metaPlace
            : gunType === "All Guns" && showGuns === "chizPage"
              ? b.chizFave
              : b.gunTypePlace;

        return Number(placeA) - Number(placeB);
      });
    }

    return filtered.sort((cleanA, cleanB) => {
      let a;
      let b;
      if (sortReverse) {
        a = cleanB;
        b = cleanA;
      } else {
        a = cleanA;
        b = cleanB;
      }
      switch (filter) {
        case "top10meta":
          return Number(a.metaPlace) - Number(b.metaPlace);

        case "top10guntypes":
          return Number(a.gunTypePlace) - Number(b.gunTypePlace);

        case "name":
          return (a.gunName || "").localeCompare(b.gunName || "");

        case "popularity":
          return Number(b.views || 0) - Number(a.views || 0);

        case "releaseOrder":
          return Number(a.releaseOrder || 0) - Number(b.releaseOrder || 0);

        case "likes":
          return Number(b.likes || 0) - Number(a.likes || 0);

        default:
          return 0;
      }
    });
  }, [guns, showGuns, gunType, filter, editTop10, searchQuery, sortReverse]);

  const [visibleCount, setVisibleCount] = useState(INITIAL_GUNS);

  const visibleGuns =
    showGuns === "gunsPage"
      ? filteredGuns.slice(0, visibleCount)
      : filteredGuns;

  useEffect(() => {
    if (width < 1416) {
      setVisibleCount(6);
    } else if (width < 1712) {
      setVisibleCount(8);
    } else {
      setVisibleCount(5);
    }
  }, [gunType, searchQuery, filter, sortReverse, selectedSideBar, width]);

  const handleSeeMore = () => {
    const GUNS_PER_LOAD = width < 1416 ? 6 : width < 1712 ? 8 : 5;

    setVisibleCount((prev) =>
      Math.min(prev + GUNS_PER_LOAD, filteredGuns.length),
    );
  };

  useEffect(() => {
    const el = gunListRef.current;
    if (!el) return;

    const checkScroll = () => {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    checkScroll();

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredGuns.length, showGuns]);

  const addToMeta = async (id) => {
    if (top < 1 || top > 10) {
      alert("Top 10 already submitted");
      return;
    }

    const placeRef = ref(
      db,
      `guns/${id}/${editTop10 ? "metaPlace" : "gunTypePlace"}`,
    );

    try {
      const result = await runTransaction(placeRef, (currentPlace) => {
        if (currentPlace != null) return;
        return top;
      });

      if (result.committed) {
        setTop((prev) => prev - 1);
      } else {
        alert("This gun already has a ranking!");
      }
    } catch (error) {
      console.error("Failed to assign ranking:", error);
      alert("Failed to assign ranking.");
    }
  };

  return (
    <div className="relative w-full @container">
      {/* Scrollable gun list */}
      <div
        ref={gunListRef}
        className={`w-full overflow-x-auto ${
          showGuns === "homePage" ? "gunlist-container" : ""
        }`}
      >
        <div
          className={`w-full ${
            showGuns === "homePage"
              ? "flex gap-5 shrink-0"
              : showGuns === "meta"
                ? "grid grid-cols-12 gap-5 items-center justify-center max-[444px]:gap-3"
                : showGuns === "editMode"
                  ? "flex flex-wrap gap-5"
                  : showGuns === "gunsPage"
                    ? "grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-5 max-[600px]:grid-cols-2"
                    : showGuns === "chizPage"
                      ? "grid grid-cols-12 gap-5 items-center justify-center max-[444px]:gap-3"
                      : "flex gap-5 flex-wrap"
          }`}
        >
          {visibleGuns.map((gun, index) => (
            // guncard size
            <div
              key={gun.id}
              className={`flex-1 border-2 bg-[#ffffff0c] rounded-xl glow place-background border-[#57535a] ${
                showGuns === "homePage"
                  ? `h-65 max-w-107 p-3 min-w-106 shrink-0 max-[600px]:min-w-61 max-[600px]:h-60 ${handlePlace(gun)}-border`
                  : showGuns === "gunsPage"
                    ? "p-3 h-45  max-[500px]:p-2 metapage-border max-w-107"
                    : showGuns === "meta"
                      ? `p-3 h-55 max-2xl:h-45 max-[540px]:p-2 max-[600px]:h-50! max-[540px]:h-55! max-[374px]:p-1 max-[374px]:pt-2 max-[374px]:h-50! ${handlePlace(gun)}-border`
                      : showGuns === "chizPage"
                        ? `p-3 h-55 max-2xl:h-45 max-[540px]:p-2 max-[600px]:h-50! max-[540px]:h-55! max-[374px]:p-1 max-[374px]:pt-2 max-[374px]:h-50! ${handlePlace(gun.chizFave)}-border`
                        : "h-65 max-w-107 p-3 min-w-105"
              } ${gun.metaPlace >= 4 ? "metapage-border" : ""} ${
                showGuns === "meta"
                  ? document.documentElement.clientWidth <= 820
                    ? "p-3 w-full"
                    : document.documentElement.clientWidth <= 1583
                      ? index < 6
                        ? "p-3 w-full"
                        : "p-3 max-w-90 justify-self-center"
                      : index < 4
                        ? "p-3 w-full"
                        : "p-3 w-full justify-self-center"
                  : "..."
              }`}
              style={
                showGuns === "meta" || showGuns === "chizPage"
                  ? {
                      gridColumn:
                        document.documentElement.clientWidth <= 820
                          ? `${(index % 2) * 6 + 1} / span 6`
                          : document.documentElement.clientWidth <= 1583
                            ? index < 6
                              ? `${(index % 3) * 4 + 1} / span 4`
                              : `${((index - 6) % 2) * 4 + 3} / span 4`
                            : index < 8
                              ? `${(index % 4) * 3 + 1} / span 3`
                              : `${(index - 8) * 3 + 4} / span 3`,
                    }
                  : undefined
              }
              onClick={() => {
                if (showGuns === "editMode") {
                  addToMeta(gun.id);
                }
              }}
            >
              <GunCard
                gunId={gun.id}
                gun={gun}
                gunType={gunType}
                handlePlace={handlePlace}
                setShowGunsmith={setShowGunsmith}
                setGunData={setGunData}
                showGuns={showGuns}
                windowSize={windowSize}
              />
            </div>
          ))}
        </div>
        {/* extra guns button */}
        {showGuns === "gunsPage" && visibleCount < filteredGuns.length && (
          <button
            onClick={handleSeeMore}
            className="mt-6 mx-auto block px-6 py-3 rounded-lg border border-[#57535a] hover:border-[#fcb12d] transition-colors"
          >
            See More ({filteredGuns.length - visibleCount} remaining)
          </button>
        )}
      </div>

      {/* Left arrow */}
      {showGuns === "homePage" && canScrollLeft && (
        <button
          onClick={() =>
            gunListRef.current?.scrollBy({
              left: -400,
              behavior: "smooth",
            })
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full px-3 bg-linear-to-r from-[#121317e0] via-[#121317ab] to-transparent flex items-center"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="text-[#fcb12d] scale-125 rotate-180"
          />
        </button>
      )}

      {/* Right arrow */}
      {showGuns === "homePage" && canScrollRight && (
        <button
          onClick={() =>
            gunListRef.current?.scrollBy({
              left: canScrollLeft ? 443 : 400,
              behavior: "smooth",
            })
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full px-3 bg-linear-to-l from-[#121317e0] via-[#121317ab] to-transparent flex items-center"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="text-[#fcb12d] scale-125"
          />
        </button>
      )}
    </div>
  );
};

export default GunList;
