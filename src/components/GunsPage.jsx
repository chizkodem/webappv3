import React, { useEffect, useRef, useState } from "react";
import ImageSlider from "./ImageSlider";
import { HugeiconsIcon } from "@hugeicons/react";
import Calendar02Icon from "@hugeicons/core-free-icons/Calendar02Icon";
import AtomicPowerIcon from "@hugeicons/core-free-icons/AtomicPowerIcon";
import {
  ArrowDownOneZeroIcon,
  ArrowUpOneZeroIcon,
  CheeseIcon,
  Sidebar,
} from "@hugeicons/core-free-icons";
import { gunTypes } from "../services/gunCat";
import GunList from "./GunList";
import { useNavigate } from "react-router-dom";

const GunsPage = ({
  selectedTab,
  previousTab,
  guns,
  setShowGunsmith,
  setGunData,
  categoryRefs,
  scrollToCategory,
  selectedSideBar,
  searchQueries,
}) => {
  const [filter, setFilter] = useState("releaseOrder");
  const gunsPageContainerRef = useRef(null);
  const scrollbarRef = useRef(null);
  const thumbRef = useRef(null);
  const [sortReverse, setSortReverse] = useState(false);
  const [scrollParent, setScrollParent] = useState(null);

  useEffect(() => {
    setScrollParent(gunsPageContainerRef.current);
  }, []);

  useEffect(() => {
    scrollToCategory(selectedSideBar);
  }, [selectedSideBar]);

  const handleScroll = () => {
    const container = gunsPageContainerRef.current;
    const track = scrollbarRef.current;
    const thumb = thumbRef.current;

    if (!container || !track || !thumb) return;

    const maxScroll = container.scrollHeight - container.clientHeight;

    const progress = maxScroll > 0 ? container.scrollTop / maxScroll : 0;

    const maxTravel = track.clientHeight - thumb.offsetHeight;

    thumb.style.transform = `translateY(${progress * maxTravel}px)`;
  };

  const navigate = useNavigate();

  return (
    <div className="w-full relative">
      <div
        ref={gunsPageContainerRef}
        onScroll={handleScroll}
        className="gunspage-container w-full overflow-y-scroll max-h-[calc(100vh-108px)] max-[926px]:pb-26!"
      >
        <div
          className={`transition-all duration-500 w-full mx-auto relative border max-sm:mt-3 border-[#fcb02d] rounded-4xl`}
        >
          <ImageSlider selectedTab={selectedTab}>
            <div
              className="w-fit p-1 pb-5 flex flex-col gap-2
                          max-md:px-5 max-md:mx-auto"
            >
              <img
                src="https://ik.imagekit.io/chizwebappv3/Call-of-Duty-Mobile-Logo-PNG-Image.png?updatedAt=1794075853073"
                alt=""
                className="w-50"
              />
              <div className="flex flex-col">
                <h1
                  className="text-6xl font-bold italic leading-15 text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)]
                             max-md:text-5xl max-md:leading-10 max-[444px]:text-4xl!"
                >
                  Best <span className="text-[#fab02d]">Loadout Builds</span>
                </h1>
                <h2 className="font-semibold text-2xl text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)] max-[600px]:text-xl">
                  Discover the builds of every weapons in CODM right now!
                </h2>
              </div>
              <div className="flex gap-4 max-[375px]:text-sm max-[375px]:gap-2">
                <div
                  className="flex p-2 px-4 rounded-4xl bg-[#fab02d] w-fit items-center gap-2 max-[375px]:px-2 cursor-pointer"
                  onClick={() => navigate("/Metas")}
                >
                  <HugeiconsIcon
                    icon={AtomicPowerIcon}
                    className="text-black"
                  />
                  <p className="text-black font-semibold">Meta Builds</p>
                </div>
                <div
                  className="flex p-2 px-4 rounded-4xl border border-white w-fit items-center gap-2 bg-[#00000071] max-[375px]:px-2 cursor-pointer"
                  onClick={() => navigate("/chiz")}
                >
                  <HugeiconsIcon icon={CheeseIcon} className="text-[#dad9d9]" />
                  <p className="text-white font-semibold text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)] cursor-pointer">
                    Chiz's Fave Guns
                  </p>
                </div>
              </div>
            </div>
          </ImageSlider>
        </div>

        <div>
          <div className="flex w-full flex-col mt-5 meta-container relative">
            {gunTypes
              .filter(
                (category) => category !== "All Guns" && category !== "Extras",
              )
              .map((category) => (
                <div
                  key={category}
                  className="full mb-5 max-[926px]:pt-22 max-[926px]:-mt-18"
                  ref={(element) => {
                    categoryRefs.current[category] = element;
                  }}
                >
                  <div className="flex items-center mb-3">
                    <div className="flex w-full items-center">
                      <div className="h-8 aspect-square relative overflow-hidden">
                        <div className="w-2 h-20 rotate-20 bg-[#fcb02d] absolute top-1/2 left-1/2 -translate-1/2"></div>
                      </div>
                      <h2 className="text-2xl font-semibold mr-3 max-[444px]:text-xl max-[360px]:text-lg">
                        {category}s
                      </h2>
                      <div onClick={() => setSortReverse((prev) => !prev)}>
                        {sortReverse ? (
                          <HugeiconsIcon icon={ArrowDownOneZeroIcon} />
                        ) : (
                          <HugeiconsIcon icon={ArrowUpOneZeroIcon} />
                        )}
                      </div>
                    </div>

                    <div>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-[#202229] text-white border border-[#57535a] rounded-xl px-4 py-2 outline-none cursor-pointer"
                      >
                        <option value="releaseOrder">Default</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="popularity">Popularity</option>
                        <option value="likes">Most Liked</option>
                      </select>
                    </div>
                  </div>
                  <GunList
                    guns={guns}
                    showGuns="gunsPage"
                    gunType={category}
                    setShowGunsmith={setShowGunsmith}
                    setGunData={setGunData}
                    filter={filter}
                    setFilter={setFilter}
                    sortReverse={sortReverse}
                    searchQuery={searchQueries}
                    scrollParent={scrollParent}
                    selectedSideBar={selectedSideBar}
                  />
                </div>
              ))}
          </div>
        </div>
        {/* Custom scrollbar - outside the scrollable container */}
        <div ref={scrollbarRef} className="custom-scrollbar">
          <div ref={thumbRef} className="custom-scrollbar-thumb" />
        </div>
      </div>
    </div>
  );
};

export default GunsPage;
