import "../App.css";
import React, { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import GunList from "./GunList";
import { gunTypes, shortenedGunTypes } from "../services/gunCat";
import { getAttachmentImage } from "../services/attachmentImages";
import ImageSlider from "./ImageSlider";
import ChizCard from "./ChizCard";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import AiSearch01Icon from "@hugeicons/core-free-icons/AiSearch01Icon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";
import {
  ArrowRight01Icon,
  ArrowRight05Icon,
  CheeseIcon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";

const MainPage = ({
  setShowGunsmith,
  setGunData,
  selectedTab,
  windowSize,
  setWindowSize,
}) => {
  const [guns, setGuns] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All Guns");
  // const [windowSize, setWindowSize] = useState(0);
  const filterRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  useEffect(() => {
    const gunsRef = ref(db, "guns");

    const unsubscribe = onValue(gunsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const gunsArray = Object.entries(data).map(([id, gun]) => ({
          id,
          ...gun,
        }));

        setGuns(gunsArray);
      } else {
        setGuns([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const el = filterRef.current;
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
  }, []);

  //   console.log("Guns:", guns);

  const navigate = useNavigate();
  const handleBrowseAllGunsClick = () => {
    navigate("/Builds");
  };
  const handleChizFaveGunsClick = () => {
    navigate("/chiz");
  };

  return (
    <div className="w-full h-full">
      <div className="max-2xl:mt-0 grid grid-cols-[minmax(0,1fr)_auto] max-lg:grid-cols-1! max-[672px]:grid-cols-2! gap-4">
        {/* hero */}
        <div
          className="h-95 w-full mx-auto relative border border-[#fcb02d98] rounded-4xl col-span-2 max-2xl:col-span-1 max-lg:col-span-1 max-lg:row-start-1 max-[672px]:col-span-2! max-[672px]:col-start-1! max-[672px]:row-start-1!
                     max-2xl:h-fit max-sm:mt-3"
        >
          <ImageSlider selectedTab={selectedTab}>
            <div className="max-2xl:my-2 max-xl:my-0">
              <img
                src="https://ik.imagekit.io/chizwebappv3/Call-of-Duty-Mobile-Logo-PNG-Image.png"
                alt=""
                className="w-50  max-2xl:w-40 max-2xl:-mt-3s"
                loading="lazy"
              />
              <h1
                className="font-bold text-6xl italic text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)]
                         max-2xl:text-4xl"
              >
                Chiz's gun builds & <br />{" "}
                <span className="text-[#fcb02d]">loadout codes</span>
              </h1>
              <p
                className="text-2xl font-semibold text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)]
                          max-2xl:text-xl max-[374px]:text-base!"
              >
                Find a gun, see the full attachment setup, <br /> and copy the
                loadout
              </p>
              <div className="flex gap-3 max-[444px]:gap-2">
                <button
                  className="bg-[#fcb02d] text-black font-bold px-4 rounded-4xl flex items-center p-2 text-md
                             max-2xl:text-sm max-[374px]:leading-4 max-[444px]:px-2 cursor-pointer"
                  onClick={handleBrowseAllGunsClick}
                >
                  <HugeiconsIcon icon={AiSearch01Icon} className="w-5 mr-1" />
                  Browse All Guns
                </button>
                <button
                  className="flex items-center border border-white text-white gap-1 font-bold p-2 px-4 rounded-4xl bg-[#4646464b] max-lg:bg-[#464646b7] max-xl:bg-[#46464681]
                             max-2xl:text-sm max-[444px]:px-2 cursor-pointer"
                  onClick={handleChizFaveGunsClick}
                >
                  <HugeiconsIcon
                    icon={CheeseIcon}
                    className="text-[#dad9d9] "
                  />
                  <p className="text-[#ffffff] font-semibold text-shadow-[2px_2px_4px_rgba(0,0,0,1)] max-[374px]:leading-4">
                    Chiz's Fave Guns
                  </p>
                </button>
              </div>
            </div>
          </ImageSlider>
        </div>

        {/* item 1 */}
        <div className="col-span-2 max-2xl:row-start-2 max-lg:col-span-2 max-lg:col-start-1 max-lg:row-start-2 max-[672px]:col-span-2! max-[672px]:col-start-1! max-[672px]:row-start-2!">
          <div className="flex justify-between">
            <div className="h-12 flex items-center">
              <div className="h-8 aspect-square relative overflow-hidden">
                <div className="w-2 h-20 rotate-20 bg-[#fcb02d] absolute top-1/2 left-1/2 -translate-1/2"></div>
              </div>
              <h2 className="text-2xl font-semibold">Filter by Category</h2>
            </div>
            <div className="flex mr-6 max-sm:mr-3 items-center">
              <p className="font-bold text-[#fcb12d] text-xl">View All</p>
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                className="text-[#fcb12d]"
              />
            </div>
          </div>
          <div className="relative max-w-335">
            <div
              ref={filterRef}
              className="flex gap-2 overflow-x-auto filter-container scroll-smooth"
            >
              {gunTypes
                .filter((category) => category !== "Extras")
                .map((category) => (
                  <div
                    key={category}
                    className={`flex shrink-0 gap-2 max-sm:gap-1 p-2 px-4 font-semibold rounded-4xl cursor-pointer ${
                      category === selectedFilter
                        ? "bg-[#fcb12d] text-[#2b2a2a] font-bold"
                        : "bg-[#2b2a2a]"
                    }`}
                    onClick={() => setSelectedFilter(category)}
                  >
                    <div>
                      <img
                        src={`https://raw.githubusercontent.com/chizkodem/images-storage/refs/heads/main/${category}.svg`}
                        alt=""
                        className={`aspect-video w-10 object-contain ${
                          selectedFilter === category
                            ? "icon-black"
                            : "icon-gray"
                        }`}
                        loading="lazy"
                      />
                    </div>
                    <span className="max-[500px]:hidden">{category}</span>
                    <span className="min-[500px]:hidden">
                      {shortenedGunTypes[category] || category}
                    </span>
                  </div>
                ))}
            </div>

            {canScrollLeft && (
              <button
                onClick={() =>
                  filterRef.current?.scrollBy({
                    left: -220,
                    behavior: "smooth",
                  })
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-4xl bg-[#1b1b1bd8] z-10 h-full p-2 flex items-center"
              >
                <HugeiconsIcon
                  icon={ArrowRight05Icon}
                  className="text-[#fcb12d] scale-125 rotate-180"
                />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() =>
                  filterRef.current?.scrollBy({
                    left: 220,
                    behavior: "smooth",
                  })
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-4xl h-full p-2 bg-[#1b1b1bd8] flex items-center"
              >
                <HugeiconsIcon
                  icon={ArrowRight05Icon}
                  className="text-[#fab02d] scale-125"
                />
              </button>
            )}
          </div>
        </div>

        {/* item 2 */}
        <div className="col-start-2 row-start-3 max-2xl:row-start-1 max-lg:col-start-2 max-lg:row-start-1 max-[672px]:col-start-1! max-[672px]:col-span-2! max-[672px]:row-start-4!">
          <ChizCard guns={guns} setGunData={setGunData} />
        </div>

        {/* item 3 */}
        <div className="flex justify-between items-center col-start-1 row-start-3 max-2xl:col-span-2 max-lg:col-span-2 max-lg:row-span-3 max-lg:row-start-3 max-lg:col-start-1 max-[672px]:col-span-2 max-[672px]:col-start-1! max-[672px]:row-start-3! max-[672px]:row-span-1!">
          <div className="w-full">
            <div className="flex justify-between">
              <div className="h-12 w-fit flex items-center">
                <div className="h-8 aspect-square relative overflow-hidden">
                  <div className="w-2 h-20 rotate-20 bg-[#fcb02d] absolute top-1/2 left-1/2 -translate-1/2"></div>
                </div>
                <h2 className="text-2xl font-semibold">Popular Builds</h2>
              </div>
            </div>

            <GunList
              guns={guns}
              showGuns="homePage"
              gunType={selectedFilter}
              setShowGunsmith={setShowGunsmith}
              setGunData={setGunData}
              windowSize={windowSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
