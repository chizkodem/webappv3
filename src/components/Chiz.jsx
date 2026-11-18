import React from "react";
import ImageSlider from "./ImageSlider";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiSearch01Icon,
  AtomicPowerIcon,
  Calendar02Icon,
  CheeseIcon,
  Edit04Icon,
} from "@hugeicons/core-free-icons";
import GunList from "./GunList";
import { useNavigate } from "react-router-dom";

const Chiz = ({
  selectedTab,
  previousTab,
  metaGunData,
  setShowGunsmith,
  setGunData,
  categoryRefs,
  searchQueries,
  setSearchQueries,
  guns,
}) => {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full">
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
                className="text-6xl font-bold italic leading-15 text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)]
                max-2xl:text-4xl max-xl:text-4xl max-sm:text-4xl max-sm:leading-10"
              >
                Chiz's Fave <span className="text-[#fab02d]">Guns</span>
              </h1>
              <h2
                className="font-semibold text-2xl text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)]
                               max-2xl:text-xl max-sm:text-lg"
              >
                Discover the top performing weapons in CODM right now!
              </h2>
            </div>

            <div className="flex gap-4 max-[375px]:text-sm max-[375px]:gap-2">
              <div
                className="flex p-2 px-4 rounded-4xl bg-[#fab02d] w-fit items-center gap-2 max-[375px]:px-2 cursor-pointer"
                onClick={() => navigate("/Metas")}
              >
                <HugeiconsIcon icon={AtomicPowerIcon} className="text-black" />
                <p className="text-black font-semibold">Meta Builds</p>
              </div>
              <div
                className="flex p-2 px-4 rounded-4xl border border-white w-fit items-center gap-2 bg-[#00000071] max-[375px]:px-2 cursor-pointer"
                onClick={() => navigate("/Builds")}
              >
                <HugeiconsIcon icon={AiSearch01Icon} className="w-5 mr-1" />
                Browse All Guns
              </div>
            </div>
          </div>
        </ImageSlider>
      </div>

      <div className="mt-5">
        <div className="flex mb-5">
          <div className="h-8 aspect-square relative overflow-hidden">
            <div className="w-2 h-20 rotate-20 bg-[#fcb02d] absolute top-1/2 left-1/2 -translate-1/2" />
          </div>
          <h2 className="text-2xl font-semibold">10 of my Favorite guns</h2>
        </div>

        <GunList
          guns={guns}
          showGuns="chizPage"
          gunType="All Guns"
          setShowGunsmith={setShowGunsmith}
          setGunData={setGunData}
          top={top}
          searchQuery={searchQueries}
        />
      </div>
    </div>
  );
};

export default Chiz;
