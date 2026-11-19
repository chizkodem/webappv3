import React, { useEffect, useRef, useState } from "react";
import "../css/GunsmithPage.css";
import { getAttachmentImage } from "../services/attachmentImages";
import { HugeiconsIcon } from "@hugeicons/react";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import Award03Icon from "@hugeicons/core-free-icons/Award03Icon";
import ChartIcon from "@hugeicons/core-free-icons/ChartIcon";
import IdeaIcon from "@hugeicons/core-free-icons/IdeaIcon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import { ArrowTurnBackwardIcon, Checkmark } from "@hugeicons/core-free-icons";
import LazyImage from "./LazyImage";
import LazyAttachmentImage from "./LazyAttachmentImage";
import { shortenedGunTypes } from "../services/gunCat";
import { get, ref, runTransaction } from "firebase/database";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const GunsmithPage = ({ gunData, setShowGunsmith }) => {
  const [liked, setLiked] = useState(false);
  const gunSmithRef = useRef(null);
  const quotes = [
    "Precision isn't luck. It's built, one attachment at a time.",
    "A perfect build turns every weakness into an advantage.",
    "Every weapon has potential. It's up to you to unlock it.",
    "A weapon is only as deadly as the hands that build it.",
    "No two operators fight alike. No two builds should either.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const gun = gunData || {};

  const priorityBuildName = gun.priority || Object.keys(gun.builds || {})[0];

  const [selectedBuild, setSelectedBuild] = useState(priorityBuildName);
  const currentBuild = gun.builds?.[selectedBuild];

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

  useEffect(() => {
    setSelectedBuild(priorityBuildName);
  }, [priorityBuildName]);

  const handlePlace = (place) => {
    if (place === 1) return "first-place";
    if (place === 2) return "second-place";
    if (place === 3) return "third-place";

    return "";
  };
  const tips = [
    "Keep your crosshair at head level.",
    "Pre-aim common enemy positions before peeking.",
    "Avoid unnecessary spray transfers between targets.",
    "Learn your weapon's recoil pattern.",
    "Don't fight recoil; control it with small adjustments.",
    "Prioritize accuracy over firing speed.",
    "Aim before committing to a gunfight.",
    "Know your weapon's effective damage range.",
    "Don't force long-range fights with an SMG.",
    "Use strafing to make yourself a harder target.",
    "Pre-fire when you know an enemy is holding an angle.",
    "Reload only when you have a safe opportunity.",
    "Don't challenge an enemy who already has the advantage.",
    "Disengage when a gunfight isn't in your favor.",
  ];

  const handleLikeButton = async () => {
    const loadoutCode = currentBuild?.loadoutCode;

    if (!loadoutCode || liked || likeLoading) return;

    setLikeLoading(true);

    try {
      const savedLikes = JSON.parse(
        localStorage.getItem("likedBuilds") || "[]",
      );

      // Prevent liking the same build twice
      if (savedLikes.includes(loadoutCode)) {
        setLiked(true);
        return;
      }

      // Find the gun containing this build
      const gunsRef = ref(db, "guns");
      const snapshot = await get(gunsRef);
      const gunsData = snapshot.val() || {};

      const existingGun = Object.entries(gunsData).find(([, gun]) =>
        Object.values(gun.builds || {}).some(
          (build) => build.loadoutCode === loadoutCode,
        ),
      );

      if (!existingGun) {
        alert("Could not find this build.");
        return;
      }

      const [gunId] = existingGun;

      // Increment the gun's total likes
      const likesRef = ref(db, `guns/${gunId}/likes`);

      const result = await runTransaction(likesRef, (currentLikes) => {
        return (currentLikes || 0) + 1;
      });

      if (result.committed) {
        savedLikes.push(loadoutCode);

        localStorage.setItem("likedBuilds", JSON.stringify(savedLikes));

        setLiked(true);
      }
    } catch (error) {
      console.error("Error liking build:", error);
      alert("Could not like this build. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };

  const [randomTips] = useState(() =>
    [...tips].sort(() => Math.random() - 0.5).slice(0, 3),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gunSmithRef.current && !gunSmithRef.current.contains(event.target)) {
        setShowGunsmith(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedBuilds") || "[]");

    setLiked(savedLikes.includes(currentBuild?.loadoutCode));
  }, [currentBuild?.loadoutCode]);

  const handleLike = () => {
    const loadoutCode = currentBuild?.loadoutCode;

    if (!loadoutCode || liked) return;

    const savedLikes = JSON.parse(localStorage.getItem("likedBuilds") || "[]");

    if (savedLikes.includes(loadoutCode)) return;

    savedLikes.push(loadoutCode);

    localStorage.setItem("likedBuilds", JSON.stringify(savedLikes));
    setLiked(true);
  };

  const navigate = useNavigate();

  return (
    <div ref={gunSmithRef} className="w-full">
      <div className="gun-hero border border-[#faaf2d49] w-full h-95 max-[927px]:h-115 max-[600px]:h-105 rounded-2xl p-5 max-[600px]:p-0 flex overflow-hidden relative">
        <div className="hero-text-container w-200 z-2">
          <div className="flex flex-col justify-between h-full">
            <div
              className="flex cursor-pointer p-2 px-8 border w-fit rounded-4xl font-bold z-1 max-[600px]:m-5"
              onClick={() => navigate(-1)}
            >
              <HugeiconsIcon icon={ArrowTurnBackwardIcon} />
              <p>Back to Builds</p>
            </div>

            <div className="flex flex-col gap-2 pl-10 max-[500px]:pl-5">
              <h1 className="text-7xl font-bold italic max-[1070px]:text-5xl">
                {gun.gunName}
              </h1>
              <div className="flex gap-5 items-center ">
                <h2 className="text-4xl font-semibold">
                  {selectedBuild} Build
                </h2>
                <div
                  className="heart-container relative right-2 bottom-2 -mb-2"
                  title="Like"
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    id={`like-${currentBuild?.loadoutCode}`}
                    checked={liked}
                    disabled={likeLoading}
                    onChange={handleLikeButton}
                  />
                  <div className="svg-container">
                    <svg
                      viewBox="0 0 24 24"
                      className="svg-outline"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                    </svg>
                    <svg
                      viewBox="0 0 24 24"
                      className="svg-filled"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                    </svg>
                    <svg
                      className="svg-celebrate"
                      width="100"
                      height="100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="10,10 20,20"></polygon>
                      <polygon points="10,50 20,50"></polygon>
                      <polygon points="20,80 30,70"></polygon>
                      <polygon points="90,10 80,20"></polygon>
                      <polygon points="90,50 80,50"></polygon>
                      <polygon points="80,80 70,70"></polygon>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <p className="bg-[#fab02d] text-black font-bold p-1 px-3 rounded-xl">
                  <span className={`max-[415px]:hidden`}>{gun.gunType}</span>
                  <span className={`min-[415px]:hidden`}>
                    {shortenedGunTypes[gun.gunType] || gun.gunType}
                  </span>
                </p>
                <p className="border border-[#ffffff69] bg-[#4444444b] font-semibold p-1 px-3 rounded-xl">
                  Best Builds
                </p>
                <p className="border border-[#ffffff69] bg-[#4444444b] font-semibold p-1 px-3 rounded-xl">
                  Chiz on Top
                </p>
              </div>
              <p className="text-2xl max-w-100">{randomQuote}</p>
            </div>
          </div>
        </div>

        <div className="absolute h-full w-full -mt-5 -ml-5 z-1">
          {/* Shadow */}
          <LazyImage
            src={gun.iconURL}
            alt=""
            className="object-contain max-w-350 absolute right-[calc(-150px+50vw)] max-[1425px]:w-300 max-[1240px]:w-250 max-[1070px]:w-200 max-[1425px]:right-[calc(-200px+50vw)] top-1/2 translate-x-[57%] max-[815px]:top-4/10 translate-y-[-49%] max-[927px]:right-[55%] max-[927px]:w-[120vw] max-[815px]:top-9/20 max-[600px]:w-[130vw] max-[600px]:right-[53%] max-[600px]:top-1/2 max-[500px]:top-9/20 top-1/2 gun-hero-shadow"
          />

          {/* Actual gun */}
          <LazyImage
            src={gun.iconURL}
            alt=""
            className="object-contain max-w-350 absolute right-[calc(-150px+50vw)] max-[1425px]:w-300 max-[1240px]:w-250 max-[1070px]:w-200 max-[1425px]:right-[calc(-200px+50vw)] max-[927px]:right-[55%] max-[927px]:w-[120vw] max-[815px]:top-9/20 max-[600px]:w-[130vw] max-[600px]:right-[53%] max-[600px]:top-1/2 max-[500px]:top-9/20 top-1/2 translate-x-[55%] -translate-y-1/2"
          />
        </div>
        <img
          src="https://ik.imagekit.io/chizwebappv3/Call-of-Duty-Mobile-Logo-PNG-Image.png?updatedAt=1794075853073"
          alt=""
          className="absolute right-2 top-0 w-50 max-[500px]:w-35"
        />
      </div>

      <div className="grid grid-cols-[2fr_1fr] max-[1205px]:grid-cols-1 attachments-container justify-between w-full gap-5">
        {/* gunparts */}
        <div className="gunpart-build-overview-container col-start-1 row-start-1">
          <div className="gunpart-container max-w-245 p-5 max-[600px]:p-0 max-[600px]:pt-5 flex-1">
            <div className="flex items-center mb-3 justify-between flex-wrap">
              <div className="flex items-center shrink-0">
                <div className="h-8 aspect-square relative overflow-hidden">
                  <div className="w-2 h-20 rotate-20 bg-[#fcb02d] absolute top-1/2 left-1/2 -translate-1/2"></div>
                </div>
                <p className="text-2xl font-semibold">Attachments</p>
              </div>

              <div className="flex justify-center mx-auto">
                <div className="build-radio-inputs min-w-fit">
                  {Object.entries(gun.builds || {}).map(
                    ([buildName, buildData]) => (
                      <label
                        key={buildName}
                        className="build-radio min-w-fit"
                        htmlFor={`radio-${buildName}`}
                      >
                        <input
                          type="radio"
                          name="gun-build"
                          id={`radio-${buildName}`}
                          value={buildName}
                          checked={selectedBuild === buildName}
                          onChange={(e) => setSelectedBuild(e.target.value)}
                        />
                        <span className="build-name min-w-fit">
                          {buildName}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] max-[600px]:grid-cols-2 gap-4 max-[600px]:gap-1 justify-center">
              {currentBuild?.attachments &&
                Object.entries(currentBuild.attachments)
                  .filter(([field, value]) => value.trim() !== "")
                  .map(([field, value]) => (
                    <div
                      key={field}
                      className="flex border border-[#ffffff3d] rounded-xl h-30 gunpart min-w-0 max-w-100"
                    >
                      <div className="flex relative -mr-8 aspect-square w-34 max-[600px]:w-20 max-[600px]:ml-5 max-[600px]:-mr-4 max-[500px]:w-15">
                        <LazyAttachmentImage
                          field={field}
                          value={value}
                          className="aspect-square w-24 max-[600px]:w-20 max-[500px]:w-15 object-cover absolute left-1/2 top-1/2 translate-[-50%] gun-part-shadow"
                        />

                        <LazyAttachmentImage
                          field={field}
                          value={value}
                          className="aspect-square w-24 max-[600px]:w-20 max-[500px]:w-15 object-cover absolute left-1/2 top-1/2 translate-[-50%]"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-5 max-[600px]:text-sm">
                        <h2 className="font-semibold text-gray-400">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </h2>
                        <p className="font-semibold">{value}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* build overview */}

        {!gun.notes === "" && (
          <div className="build-overview h-fit mx-5 p-3 border rounded-2xl border-[#ffffff33] row-start-2 col-start-1 max-[1205px]:row-start-3 max-[1205px]:col-start-1">
            <div className="flex">
              <div className="h-8 aspect-square relative overflow-hidden">
                <div className="w-2 h-20 rotate-20 bg-[#fcb02d] absolute top-1/2 left-1/2 -translate-1/2"></div>
              </div>
              <p className="text-2xl font-semibold">Build Overview</p>
            </div>
            <p className="px-1 text-2xl font-semibold text-[#8b8b8b]">
              {currentBuild?.notes}
            </p>
          </div>
        )}

        {/* loadout info tips */}
        <div
          className="loadout-info-tips-container flex min-[1205px]:flex-col flex-wrap gap-3 min-w-100 max-w-140 max-[1205px]:max-w-full p-5 pb-0 row-span-2 col-start-2 row-start-1 max-[1205px]:row-start-2 max-[1205px]:col-start-1 max-[1205px]:row-span-1
                         max-[500px]:min-w-0"
        >
          <div className="loadout-code-container flex flex-1 min-w-90 max-[500px]:min-w-60 justify-between border p-5 h-fit flex-col border-[#fab02d] rounded-2xl gap-3 shadow-[0px_0px_10px_1px_#faaf2d8e,inset_0px_0px_10px_1px_#faaf2d8e]">
            <div className="flex justify-between w-full">
              <div className="flex gap-3">
                <HugeiconsIcon icon={Award03Icon} className="text-[#fab02d]" />
                <h2 className="font-bold text-xl max-[500px]:text-lg">
                  Loadout Code
                </h2>
              </div>
              <div
                className={`flex gap-2 duration-500 border p-1 px-3 rounded-4xl cursor-pointer ${
                  copied[currentBuild?.loadoutCode]
                    ? "border-[#09b612] text-[#09b612]"
                    : "border-[#fab02d] text-[#fab02d]"
                }`}
                onClick={() => handleCopy(currentBuild?.loadoutCode)}
              >
                <HugeiconsIcon
                  icon={CopyIcon}
                  className={`${
                    copied[
                      currentBuild?.loadoutCode
                        ? "text-[#09b612]"
                        : "text-[#fab02d]"
                    ]
                  }`}
                />
                <p className="font-semibold">Copy</p>
              </div>
            </div>
            <div className="h-15 flex items-center justify-center border bg-[#161616] border-[#bdbdbd42] rounded-2xl">
              <p className="font-semibold text-3xl text-[#b3b3b3] max-[500px]:text-2xl">
                {currentBuild?.loadoutCode}
              </p>
            </div>
          </div>

          <div className="build-info-container flex-1 border min-w-80 max-[500px]:min-w-60 border-[#ffffff44] flex flex-col p-2 px-5 rounded-2xl bg-[#161616]">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={ChartIcon} className="text-[#fab02d]" />
              <p className="font-bold mt-1 text-xl">Build info</p>
            </div>
            <div className="flex gap-15">
              <ul className="list-disc ml-5 leading-5">
                <li className="text-[#ffffff81]">Category</li>
                <li className="text-[#ffffff81]">Playstyle</li>
                <li className="text-[#ffffff81]">Range</li>
                <li className="text-[#ffffff81]">Difficulty</li>
              </ul>
              <ul className="leading-5">
                <li className="font-semibold">: {gun.gunType}</li>
                <li className="font-semibold">: {currentBuild?.playStyle}</li>
                <li className="font-semibold">: {currentBuild?.range}</li>
                <li className="font-semibold">: {currentBuild?.difficulty}</li>
              </ul>
            </div>
          </div>

          <div className="tips-container w-full border border-[#fab02d] p-2 px-5 rounded-2xl flex flex-col gap-2 bg-linear-to-tl from-[#fab02d]/20 to-transparent mb-26">
            <div className="flex gap-2">
              <HugeiconsIcon icon={IdeaIcon} className="text-[#fab02d]" />
              <h2 className="font-bold text-xl">Pro Tips</h2>
            </div>
            <div className="flex flex-col">
              {randomTips.map((tip, index) => (
                <div key={index} className="flex gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-[#fab02d] shrink-0"
                  />
                  <p className="text-lg">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GunsmithPage;
