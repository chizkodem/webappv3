import React, { useState } from "react";
import { getAttachmentImage } from "../services/attachmentImages";
import "../css/gunCard.css";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import {
  CheckCheckIcon,
  ChevronsRightIcon,
  CopyIcon,
  EyeIcon,
  HeartIcon,
  ThumbsUpIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { shortenedGunTypes } from "../services/gunCat";
import LazyImage from "./LazyImage";
import LazyAttachmentImage from "./LazyAttachmentImage";
import { ref, runTransaction } from "firebase/database";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const GunCard = ({
  gun,
  gunType,
  handlePlace,
  setShowGunsmith,
  setGunData,
  showGuns,
  windowSize,
  gunId,
}) => {
  const [firstBuildName, firstBuild] =
    Object.entries(gun.builds || {}).find(
      ([buildName]) => buildName === gun.priority,
    ) || [];

  const place = gunType === "All Guns" ? gun.metaPlace : gun.gunTypePlace;
  const chizFavePlace = showGuns === "chizPage" ? gun.chizFave : null;

  const handleViewBuild = async () => {
    try {
      const viewsRef = ref(db, `guns/${gunId}/views`);

      await runTransaction(viewsRef, (currentViews) => {
        return (currentViews || 0) + 1;
      });
    } catch (error) {
      console.error("Error recording build view:", error);
    }
  };

  const navigate = useNavigate();

  const handleOpenGunsmith = () => {
    setGunData(gun);
    navigate(`/attachments/${encodeURIComponent(gun.gunName)}`);
    handleViewBuild();
  };

  const [copied, setCopied] = useState({});
  const handleCopy = async (loadoutCode) => {
    if (!loadoutCode) return;

    try {
      await navigator.clipboard.writeText(loadoutCode);
      setCopied((prev) => ({ ...prev, [loadoutCode]: true }));
      setTimeout(() => {
        setCopied({});
      }, 3000);
      console.log("Copied " + loadoutCode + " to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div
      className="flex flex-col justify-between h-full w-full min-w-0 relative overflow-hidden"
      onClick={
        document.documentElement.clientWidth < 600 ? handleOpenGunsmith : null
      }
    >
      <div
        className={`z-1 absolute top-1/2 left-1/2 -translate-1/2 w-full h-full ${
          showGuns === "meta" || showGuns === "chizPage"
            ? "max-[600px]:top-9/20 max-[500px]:top-8/20 max-[374px]:top-8/20 max-[540px]:scale-130"
            : ""
        }`}
      >
        <LazyImage
          src={gun.iconURL}
          alt=""
          className={`absolute top-[55%] left-[47%] ${showGuns === "metaPage" ? "h-[130%]" : showGuns === "gunsPage" ? "w-full" : "w-[140%]"} max-w-none translate-y-[-53%] translate-x-[-50%] aspect-video object-cover gun-part-shadow ${
            showGuns === "meta" || showGuns === "chizPage"
              ? "w-[110%]!"
              : showGuns === "gunsPage"
                ? "max-[500px]:top-8/20"
                : ""
          }`}
        />
        <LazyImage
          src={gun.iconURL}
          alt=""
          className={`absolute top-1/2 left-1/2 ${showGuns === "metaPage" ? "h-[130%]" : showGuns === "gunsPage" ? "w-full" : "w-[140%]"} max-w-none translate-y-[-53%] translate-x-[-50%] aspect-video object-cover ${
            showGuns === "meta" || showGuns === "chizPage"
              ? "w-[110%]!"
              : showGuns === "gunsPage"
                ? "w-[130%]! max-[600px]:top-16 max-[500px]:top-18 max-[444px]:w-[145%]!"
                : ""
          }`}
        />
      </div>

      <div className="place-type-container flex justify-between z-1">
        <div
          className={`place-container flex ${
            showGuns === "gunsPage" ? "hidden" : ""
          }`}
        >
          <img
            src="https://ik.imagekit.io/chizwebappv3/crown%20icon.svg"
            alt=""
            className={`-m-2 ${handlePlace(place)} ${showGuns === "chizPage" ? handlePlace(chizFavePlace) : ""} ${
              showGuns === "meta"
                ? "w-10 h-10"
                : showGuns === "chizPage"
                  ? "w-10 h-10"
                  : "w-14"
            } ${place >= 4 ? "metapage" : ""}  ${showGuns === "chizPage" ? (chizFavePlace >= 4 ? "metapage" : "") : ""}`}
            loading="lazy"
          />
          <p
            className={`self-center ${handlePlace(place)} ${showGuns === "chizPage" ? handlePlace(chizFavePlace) : ""} text-[#c0babac9]  text-xl font-bold ${
              showGuns === "metaPage" ? "text-[#8b8b8b]" : ""
            }`}
          >
            #{showGuns === "chizPage" ? chizFavePlace : place}
          </p>
        </div>

        <div className="">
          <h2
            className={`shrink-0 text-xl font-bold z-999 text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)] ${
              showGuns === "meta"
                ? "text-[#d3d3d3] hidden"
                : showGuns === "gunsPage"
                  ? "max-[484px]:text-lg max-[450px]:text-sm"
                  : "hidden"
            } ${place === 4 ? "text-[#d3d3d3]" : ""}`}
          >
            {gun.gunName}
          </h2>
          <p
            className={`text-gray-400 leading-2 text-sm ${
              showGuns === "gunsPage" ? "min-[500px]:hidden" : "hidden"
            }`}
          >
            {gun.priority} Build
          </p>
        </div>
        <p className="shrink-0 gun-type h-fit text-black  rounded-lg font-bold z-1">
          <span
            className={` ${
              showGuns === "gunsPage"
                ? "px-3 max-[650px]:hidden"
                : showGuns === "meta" || showGuns === "chizPage"
                  ? "max-[500px]:hidden px-3"
                  : "px-3"
            }`}
          >
            {gun.gunType}
          </span>
          <span
            className={` ${
              showGuns === "gunsPage"
                ? "px-3 min-[650px]:hidden max-[484px]:text-sm! max-[400px]:px-1!"
                : showGuns === "meta" || showGuns === "chizPage"
                  ? "min-[500px]:hidden px-3"
                  : "px-3 hidden"
            }`}
          >
            {shortenedGunTypes[gun.gunType] || gun.gunType}
          </span>
        </p>
      </div>

      <div className="flex flex-col justify-around h-fit z-1">
        <div
          className={`${
            showGuns === "metas" ? "flex items-center justify-center gap-5" : ""
          }`}
        >
          <h2
            className={`${handlePlace(place)}-title ${showGuns === "chizPage" ? `${handlePlace(chizFavePlace)}-title` : ""} text-shadow-[2px_2px_5px_rgba(0,0,0,1),2px_2px_5px_rgba(0,0,0,1)] text-xl font-bold z-999 ${
              showGuns === "metaPage"
                ? "text-[#000000]"
                : showGuns === "gunsPage"
                  ? "hidden"
                  : ""
            } ${place >= 4 ? "text-[#919191]" : ""} ${chizFavePlace >= 4 ? "text-[#919191]" : ""}`}
          >
            {gun.gunName}
          </h2>
          <p
            className={`text-gray-400 ${
              showGuns === "showGuns" ? "max-[500px]:hidden" : ""
            }`}
          >
            {firstBuildName} Build
          </p>
        </div>

        <div
          className={`flex items-center gap-5 mb-1 ${
            showGuns === "meta" || showGuns === "chizPage"
              ? "max-[404px]:gap-2 max-[600px]:justify-center"
              : showGuns === "gunsPage"
                ? "max-[404px]:gap-3 max-[444px]:justify-center"
                : ""
          }`}
        >
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={ViewIcon} className="text-[#c7c9d0]" />
            <p className="text-[#c7c9d0] max-[600px]:text-sm">
              {gun.views ?? 0}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={HeartIcon} className="text-[#c7c9d0]" />
            <p className="text-[#c7c9d0] max-[600px]:text-sm">
              {gun.likes ?? 0}
            </p>
          </div>

          <div
            className={`flex shrink-0  items-center text-[#c7c9d0] ${
              showGuns === "homePage"
                ? "min-[600px]:hidden"
                : showGuns === "meta" || showGuns === "chizPage"
                  ? "min-[600px]:hidden"
                  : showGuns === "gunsPage"
                    ? "hidden"
                    : "hidden"
            }`}
          >
            <p className="text-sm text-[#fab02d] flex gap-1">
              <span
                className={`${showGuns === "meta" ? "max-[470px]:hidden" : ""}`}
              >
                View
              </span>
              <span
                className={`${showGuns === "meta" ? "max-[540px]:hidden" : ""}`}
              >
                Build
              </span>
            </p>
            <HugeiconsIcon
              icon={ChevronsRightIcon}
              className="text-[#fab02d]"
            />
          </div>
        </div>
        <div
          className={`flex w-full justify-between gap-2 ${
            showGuns === "meta" || showGuns === "chizPage"
              ? "max-[600px]:w-full"
              : "justify-between"
          }`}
        >
          <div
            className={`flex flex-wrap overflow-hidden min-w-8 gap-1 z-999  ${
              showGuns === "gunsPage"
                ? "hidden"
                : showGuns === "meta" || showGuns === "chizPage"
                  ? "max-h-10 max-2xl:max-h-8 max-[600px]:w-full max-[600px]:justify-center"
                  : showGuns === "homePage"
                    ? "max-h-10 max-2xl:max-h-10"
                    : "max-h-10"
            }`}
          >
            {firstBuild?.attachments &&
              Object.entries(firstBuild?.attachments)
                .filter(([field, value]) => value.trim() !== "")
                .map(([field, value]) => (
                  <div key={field} className="">
                    <div
                      className={`border w-fit z-10 h-10 shadow-[inset_0px_0px_5px_3px_#57535a65] shrink-0 rounded-xl p-1 overflow-hidden aspect-square ${showGuns === "chizPage" ? `${handlePlace(chizFavePlace)}-border` : `${handlePlace(place)}-border`} ${
                        showGuns === "meta" || showGuns === "chizPage"
                          ? "metapage-border max-2xl:border! max-2xl:h-8 max-[444px]:h-7! max-[444px]:rounded-lg max-[404px]:h-6!"
                          : showGuns === "homePage"
                            ? "max-2xl:border max-2xl:h-10"
                            : "h-10"
                      } ${place >= 4 || gun.chizFave ? "border-2 max-2xl:border border-[#57535a]" : ""}`}
                    >
                      <LazyAttachmentImage
                        field={field}
                        value={value}
                        className="aspect-square object-cover"
                      />
                    </div>
                  </div>
                ))}
          </div>

          <div
            className={`flex justify-center border-2 flex-1 p-0.5 transition-all duration-700 rounded-xl max-[600px]:border! ${
              copied[firstBuild?.loadoutCode]
                ? "border-[#239600] text=[#239600]"
                : "border-[#9b9b9b]"
            } ${showGuns === "gunsPage" ? "" : "hidden"}`}
          >
            <button
              className="flex gap-1 cursor-pointer"
              onClick={() => handleCopy(firstBuild?.loadoutCode)}
            >
              {copied[firstBuild?.loadoutCode] ? (
                <HugeiconsIcon
                  icon={CheckCheckIcon}
                  className="max-[500px]:w-4 text-[#239600]"
                />
              ) : (
                <HugeiconsIcon icon={CopyIcon} />
              )}
              <p
                className={
                  copied[firstBuild?.loadoutCode]
                    ? "text-[#33db00]"
                    : "text-[#eeeeee]"
                }
              >
                Copy{" "}
                <span
                  className={`${showGuns === "gunsPage" ? "max-[600px]:hidden" : ""} `}
                >
                  Code
                </span>
              </p>
            </button>
          </div>

          <div
            className={`view-build-button border-2 border-[#fcb12d] flex justify-center items-center rounded-2xl max-2xl:rounded-xl z-5 ${
              showGuns === "gunsPage"
                ? "flex-1 border"
                : showGuns === "meta" || showGuns === "chizPage"
                  ? "border-2 max-2xl:border p-0 text-sm px-2 max-[600px]:hidden"
                  : showGuns === "homePage"
                    ? "border-2 max-[600px]:border max-[600px]:hidden p-0 text-sm w-fit px-2"
                    : "border-2"
            }`}
            onClick={handleOpenGunsmith}
          >
            <button
              className={`font-bold text-[#fcb12d] flex items-center gap-1 shrink-0 cursor-pointer`}
            >
              <HugeiconsIcon
                icon={ViewIcon}
                className={`
                ${
                  showGuns === "meta" || showGuns === "chizPage"
                    ? "max-[1106px]:hidden"
                    : showGuns === "gunsPage"
                      ? "w-5"
                      : ""
                }`}
              />
              <p
                className={`-mb-1 flex gap-px ${showGuns === "meta" ? "mb-px" : ""}`}
              >
                <span
                  className={`${showGuns === "gunsPage" ? "max-[500px]:text-sm max-[600px]:mb-0.5" : ""}`}
                >
                  View
                </span>
                <span
                  className={`${
                    showGuns === "meta" || showGuns === "chizPage"
                      ? "max-[1106px]:hidden "
                      : showGuns === "gunsPage"
                        ? "max-[600px]:hidden "
                        : ""
                  }`}
                >
                  Build
                </span>
              </p>
              <HugeiconsIcon
                icon={ChevronsRightIcon}
                className={`${
                  showGuns === "meta" || showGuns === "chizPage"
                    ? "min-[1106px]:hidden"
                    : showGuns === "gunsPage"
                      ? "hidden"
                      : "min-[1106px]:hidden"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GunCard;
