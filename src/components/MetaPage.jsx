import React, { useEffect, useRef, useState, useMemo } from "react";
import ImageSlider from "./ImageSlider";
import {
  Calendar02Icon,
  Edit04Icon,
  Eraser01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import GunList from "./GunList";
import { gunTypes } from "../services/gunCat";
import "../css/metaPage.css";
import { ref, update } from "firebase/database";
import { db } from "../services/firebase";

const MetaPage = ({
  selectedTab,
  previousTab,
  metaGunData,
  setShowGunsmith,
  setGunData,
  categoryRefs,
  searchQueries,
  setSearchQueries,
  user,
}) => {
  const guns = metaGunData;
  const metaContainerRef = useRef(null);
  const scrollbarRef = useRef(null);
  const thumbRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState("top10meta");
  const [editTop10, setEditTop10] = useState(false);
  const [top, setTop] = useState(10);

  const handleScroll = () => {
    const container = metaContainerRef.current;
    const track = scrollbarRef.current;
    const thumb = thumbRef.current;

    if (!container || !track || !thumb) return;

    const maxScroll = container.scrollHeight - container.clientHeight;

    const progress = maxScroll > 0 ? container.scrollTop / maxScroll : 0;

    const maxTravel = track.clientHeight - thumb.offsetHeight;

    thumb.style.transform = `translateY(${progress * maxTravel}px)`;
  };

  const handleEdit = () => {
    setEditMode((prev) => !prev);
    setEditTop10(false);
    setTop(10);
  };

  const handleEditTop10 = () => {
    setEditTop10((prev) => !prev);
    setTop(10);
  };

  const resetTop10 = async (category) => {
    const updates = {};

    if (category === "All Guns") {
      guns
        .filter((gun) => gun.metaPlace)
        .forEach((gun) => {
          updates[`guns/${gun.id}/metaPlace`] = null;
        });
    } else {
      guns
        .filter((gun) => gun.gunType === category && gun.gunTypePlace)
        .forEach((gun) => {
          updates[`guns/${gun.id}/gunTypePlace`] = null;
        });
    }

    if (Object.keys(updates).length === 0) {
      alert("No rankings to reset!");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to reset the Top 10 for ${category}?`,
    );

    if (!confirmed) return;

    try {
      await update(ref(db), updates);
      setTop(10);
      alert(`${category} Top 10 has been reset!`);
    } catch (error) {
      console.error("Failed to reset Top 10:", error);
      alert("Failed to reset rankings.");
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Actual scrollable container */}
      <div
        ref={metaContainerRef}
        onScroll={handleScroll}
        className="w-full h-full page-container meta-container overflow-y-auto max-[926px]:pb-26!"
      >
        <div className="transition-all duration-500 w-full mx-auto relative border border-[#fcb02d] rounded-4xl max-[500px]:mt-3">
          <ImageSlider selectedTab={selectedTab}>
            <div
              className="w-fit p-1 pb-5 flex flex-col h-fit gap-2
                            max-2xl:w-fit"
            >
              <img
                src="https://ik.imagekit.io/chizwebappv3/Call-of-Duty-Mobile-Logo-PNG-Image.png?updatedAt=1794075853073"
                alt=""
                className="w-50"
              />

              <div className="flex flex-col max-2xl:max-w-100 max-xl:max-w-75">
                <h1
                  className="text-8xl font-bold italic leading-15 text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)]
                max-2xl:text-6xl max-xl:text-5xl max-sm:text-4xl max-sm:leading-10"
                >
                  Current <span className="text-[#fab02d]">Meta</span>
                </h1>
                <h2
                  className="font-semibold text-2xl text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)]
                               max-2xl:text-xl max-sm:text-lg"
                >
                  Discover the top performing weapons in CODM right now!
                </h2>
              </div>

              <div className="flex p-2 px-4 rounded-4xl bg-[#fab02d] w-fit items-center gap-2">
                <HugeiconsIcon icon={Calendar02Icon} className="text-black" />
                <p className="text-black font-semibold">
                  {guns.find((gun) => gun.id === "currentSeason")?.season ?? ""}
                </p>
                {user && (
                  <HugeiconsIcon
                    icon={Edit04Icon}
                    className="text-black"
                    onClick={handleEdit}
                  />
                )}
              </div>
            </div>
          </ImageSlider>
        </div>

        <div className="relative w-full">
          <div className="flex w-full flex-col mt-5 relative">
            {gunTypes
              .filter((category) => category !== "Extras")
              .map((category) => (
                <div
                  key={category}
                  className="w-full pt-22 -mt-18"
                  ref={(element) => {
                    categoryRefs.current[category] = element;
                  }}
                >
                  <div className="flex items-center">
                    <div className="flex mb-5">
                      <div className="h-8 aspect-square relative overflow-hidden">
                        <div className="w-2 h-20 rotate-20 bg-[#fcb02d] absolute top-1/2 left-1/2 -translate-1/2" />
                      </div>
                      <h2 className="text-2xl font-semibold">
                        Top 10 {category}
                      </h2>
                    </div>

                    {editMode && (
                      <div className="flex">
                        {category === "All Guns" && (
                          <div>
                            <HugeiconsIcon
                              icon={Edit04Icon}
                              className="text-white"
                              onClick={handleEditTop10}
                            />
                          </div>
                        )}

                        <HugeiconsIcon
                          icon={Eraser01Icon}
                          onClick={() => resetTop10(category)}
                        />
                      </div>
                    )}
                  </div>

                  <GunList
                    guns={guns}
                    showGuns={editMode || editTop10 ? "editMode" : "meta"}
                    gunType={category}
                    setShowGunsmith={setShowGunsmith}
                    setGunData={setGunData}
                    setTop={setTop}
                    top={top}
                    editTop10={editTop10}
                    searchQuery={searchQueries}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Custom scrollbar - outside the scrollable container */}
      <div ref={scrollbarRef} className="custom-scrollbar">
        <div ref={thumbRef} className="custom-scrollbar-thumb" />
      </div>
    </div>
  );
};

export default MetaPage;
