import React, { useState } from "react";
import ArrowBigLeftDashIcon from "@hugeicons/core-free-icons/ArrowBigLeftDashIcon";
import ArrowBigRightDashIcon from "@hugeicons/core-free-icons/ArrowBigRightDashIcon";
import { HugeiconsIcon } from "@hugeicons/react";
import AiSearch01Icon from "@hugeicons/core-free-icons/AiSearch01Icon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";

const ImageSlider = ({ children, selectedTab }) => {
  const slides = [
    {
      url: "https://ik.imagekit.io/chizwebappv3/death%20alice%20hero%20clean.jpg",
    },
    {
      url: "https://ik.imagekit.io/chizwebappv3/siren%20hero%20clean.jpg",
    },
    {
      url: "https://ik.imagekit.io/chizwebappv3/ghost%20hero%20clean.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className={`h-full transition-all duration-500 relative`}>
      <div
        onClick={handlePrevious}
        className="flex items-center justify-center absolute left-0 top-1/2 h-full w-15 -translate-y-1/2 z-11 cursor-pointer p-3"
      >
        <div className="p-2 rounded-[100vw] bg-[#00000080] border border-[#fffdfd4b] max-lg:hidden">
          <HugeiconsIcon icon={ArrowBigLeftDashIcon} />
        </div>
      </div>

      <div
        onClick={handleNext}
        className="flex absolute right-0 w-15 justify-center items-center top-1/2 -translate-y-1/2 z-11 cursor-pointer h-full 
                  "
      >
        <div className="p-2 rounded-[100vw] bg-[#00000080] border border-[#fffdfd4b] max-lg:hidden">
          <HugeiconsIcon icon={ArrowBigRightDashIcon} className="" />
        </div>
      </div>

      <div
        style={{ backgroundImage: `url("${slides[currentIndex].url}")` }}
        className={`w-full h-full rounded-4xl bg-no-repeat bg-contain relative overflow-hidden shadow-[inset_calc(-10px-5vw)_0px_100px_#000,inset_calc(10px+5vw)_0px_100px_#000] ${
          selectedTab === "Home"
            ? currentIndex === 0
              ? "bg-position-[calc(70%+10vw)_center] max-2xl:bg-cover"
              : currentIndex === 1
                ? "bg-position-[calc(50%+20vw)_center] max-2xl:bg-cover"
                : currentIndex === 2
                  ? "bg-position-[calc(65%+15vw)_center] max-2xl:bg-cover"
                  : ""
            : currentIndex === 0
              ? "bg-position-[calc(65%+10vw)_20%] bg-size-[960px] max-2xl:bg-size-[960px]"
              : currentIndex === 1
                ? "bg-position-[calc(50%+21vw)_20%] bg-size-[960px] max-2xl:bg-size-[960px]"
                : currentIndex === 2
                  ? "bg-position-[calc(70%+10vw)_20%] bg-size-[960px] max-2xl:bg-size-[960px] max-[1000px]:bg-position-[calc(80%+20vw)_20%] max-[700px]:bg-position-[calc(80%+30vw)_20%] max-[500px]:bg-position-[center_20%]"
                  : ""
        }`}
      >
        <img
          src="https://ik.imagekit.io/chizwebappv3/hero%20text%20background.png"
          alt=""
          className={`${
            selectedTab === "Home"
              ? currentIndex === 0
                ? "absolute h-[110%] left-[calc(-300px+10vw)] max-2xl:left-[calc(-550px+25vw)]"
                : currentIndex === 1
                  ? "absolute h-[110%] left-[calc(-250px+15vw)] max-2xl:left-[calc(-550px+25vw)]"
                  : currentIndex === 2
                    ? "absolute h-[110%] left-[calc(-250px+15vw)] max-2xl:left-[calc(-550px+25vw)] "
                    : ""
              : currentIndex === 0
                ? "absolute h-[110%] left-[15%] max-2xl:left-[1%] max-xl:-left-50 max-[600px]:hidden"
                : currentIndex === 1
                  ? "absolute h-[110%] right-[50%] max-2xl:right-[50%] max-xl:right-[50%] max-[600px]:hidden"
                  : currentIndex === 2
                    ? "absolute h-[110%] right-[50%] max-2xl:right-[50%] max-xl:right-[50%] max-[600px]:hidden"
                    : ""
          }`}
        />

        <img
          src="https://ik.imagekit.io/chizwebappv3/build%20copy%20dominate.png"
          alt=""
          className={`${
            selectedTab === "Home"
              ? currentIndex === 0
                ? "absolute w-80 -right-10 top-20 rotate-45 max-2xl:rotate-0 max-2xl:right-15 max-2xl:top-40 max-[1350px]:right-0! max-[1288px]:w-50! max-[1288px]:right-15! max-[1288px]:top-45! max-[490px]:right-0! max-[490px]:rotate-43! max-[490px]:w-30! max-[640px]:top-0! max-[490px]:top-5!"
                : currentIndex === 1
                  ? "absolute w-80 right-10 top-10 rotate-5 max-2xl:hidden"
                  : currentIndex === 2
                    ? "absolute w-90 right-120 top-30 -rotate-48 max-2xl:hidden"
                    : ""
              : currentIndex === 0
                ? "absolute w-80 -right-10 top-15 rotate-45 max-2xl:rotate-0 max-2xl:right-15 max-2xl:top-45 max-[1350px]:right-0! max-[1288px]:w-50! max-[1288px]:right-15! max-[1288px]:top-55! max-[490px]:right-0! max-[490px]:rotate-43! max-[490px]:w-30! max-[640px]:top-5! max-[490px]:top-5!"
                : currentIndex === 1
                  ? "absolute w-80 right-10 top-10 rotate-5 max-2xl:hidden"
                  : currentIndex === 2
                    ? "absolute w-75 right-130 top-16 -rotate-48 max-[1760px]:right-115 max-2xl:hidden"
                    : ""
          }`}
        />

        <div
          className="relative z-10 flex flex-col gap-2 justify-center w-fit h-full pl-20
                          max-xl:gap-1 max-xl:p-2 max-xl:pl-20 max-lg:pl-10 max-[444px]:pl-2.5! max-[444px]:mx-auto max-[374px]:py-3!"
        >
          {children}
        </div>
      </div>

      <div className="flex absolute bottom-0 left-1/2 -translate-x-1/2 gap-1 font-sans mb-2 max-[672px]:hidden">
        {slides.map((slides, slideIndex) => (
          <div
            key={slideIndex}
            className={` cursor-pointer`}
            onClick={() => {
              setCurrentIndex(slideIndex);
            }}
          >
            <div
              className={`border-2 border-[#ffffffaf] aspect-square p-1.5 rounded-4xl bg-[#3b3b3b] ${currentIndex === slideIndex ? "bg-[#fcb02d]" : ""}`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
