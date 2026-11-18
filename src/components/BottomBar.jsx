import React, { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home11Icon } from "@hugeicons/core-free-icons";
import AtomicPowerIcon from "@hugeicons/core-free-icons/AtomicPowerIcon";
import AmmoIcon from "@hugeicons/core-free-icons/AmmoIcon";
import BadgeInfoIcon from "@hugeicons/core-free-icons/BadgeInfoIcon";
import TiktokIcon from "@hugeicons/core-free-icons/TiktokIcon";
import "../css/Navbar.css";
import { useNavigate } from "react-router-dom";

const BottomBar = ({
  showAddGun,
  setShowAddGun,
  setSelectedTab,
  setPreviousTab,
  setShowGunsmith,
  selectedTab,
  previousTab,
  selectedSideBar,
  setSelectedSideBar,
  showSelected,
  setShowSelected,
  navTab,
  setNavTab,
}) => {
  const [search, setSearch] = useState("");
  const timerRef = useRef(null);

  const navigate = useNavigate();

  const handleTabChange = (newTab) => {
    if (newTab === selectedTab) return;

    const routes = {
      Home: "/",
      Meta: "/Metas",
      "All Guns": "/Builds",
      About: "/about",
    };

    setPreviousTab(selectedTab);
    setSelectedTab(newTab);
    setNavTab(newTab);

    navigate(routes[newTab]);

    handleNavClick(newTab);
  };

  useEffect(() => {
    if (selectedSideBar === "Home") {
      setSelectedTab("Home");
      setNavTab("Home");
      setShowSelected(true);

      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setShowSelected(false);
      }, 2000);
    }
  }, [selectedSideBar]);

  const handleNavClick = (value) => {
    setNavTab(value);
    setShowSelected(true);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setShowSelected(false);
    }, 2000);
  };

  return (
    <div className="fixed p-2 bottom-3 z-999 max-[926px]:flex rounded-2xl w-fit left-1/2 -translate-x-1/2 justify-center hidden bg-[#22242ce8] shadow-[0_-10px_10px_rgba(0,0,0,0.5)]">
      {/* tab buttons */}
      <div className="nav-tab flex justify-center">
        <div className="nav-tab-container p-2 gap-10 max-md:gap-10 max-lg:gap-5 max-sm:gap-1">
          {/* Home */}
          <label
            className={`nav-tab-btn flex max-[374px]:overflow-hidden transition-all duration-500 p-2 gap-2 ${
              showSelected && navTab === "Home" ? "selected" : ""
            } ${
              navTab === "Home"
                ? "bg-[#ffffff34] rounded-lg max-[374px]:w-22"
                : "max-[374px]:w-10 max-[374px]:bg-transparent"
            }`}
            onClick={() => {
              setShowGunsmith(false);
              handleTabChange("Home");
            }}
          >
            <input
              type="radio"
              name="nav-tab"
              className="hidden"
              value="Home"
              checked={navTab === "Home"}
              readOnly
            />
            <HugeiconsIcon
              icon={Home11Icon}
              className={`${navTab === "Home" ? "text-[#fcb12d]" : ""} shrink-0`}
            />
            <span
              className={`font-semibold whitespace-nowrap ${
                navTab === "Home"
                  ? "text-[#fcb12d] max-[374px]:max-w-20 max-[374px]:opacity-100"
                  : "max-[374px]:max-w-0 max-[374px]:opacity-0"
              }`}
            >
              Home
            </span>
          </label>

          {/* Meta */}
          <label
            className={`nav-tab-btn flex max-[374px]:overflow-hidden transition-all duration-500 p-2 gap-2 ${
              showSelected && navTab === "Meta" ? "selected" : ""
            } ${
              navTab === "Meta"
                ? "bg-[#ffffff34] rounded-lg max-[374px]:w-22"
                : "max-[374px]:w-10 max-[374px]:bg-transparent"
            }`}
            onClick={() => handleTabChange("Meta")}
          >
            <input
              type="radio"
              name="nav-tab"
              className="hidden"
              value="Meta"
              checked={navTab === "Meta"}
              readOnly
            />
            <HugeiconsIcon
              icon={AtomicPowerIcon}
              className={`${navTab === "Meta" ? "text-[#fcb12d]" : ""} shrink-0`}
            />
            <span
              className={`font-semibold whitespace-nowrap ${
                navTab === "Meta"
                  ? "text-[#fcb12d] max-[374px]:max-w-20 max-[374px]:opacity-100"
                  : "max-[374px]:max-w-0 max-[374px]:opacity-0"
              }`}
            >
              Meta
            </span>
          </label>

          {/* Builds */}
          <label
            className={`nav-tab-btn flex max-[374px]:overflow-hidden transition-all duration-500 p-2 gap-2 ${
              showSelected && navTab === "All Guns" ? "selected" : ""
            } ${
              navTab === "All Guns"
                ? "bg-[#ffffff34] rounded-lg max-[374px]:w-22"
                : "max-[374px]:w-10 max-[374px]:bg-transparent"
            }`}
            onClick={() => handleTabChange("All Guns")}
          >
            <input
              type="radio"
              name="nav-tab"
              className="hidden"
              value="All Guns"
              checked={navTab === "All Guns"}
              readOnly
            />
            <HugeiconsIcon
              icon={AmmoIcon}
              className={`${navTab === "All Guns" ? "text-[#fcb12d]" : ""} shrink-0`}
            />
            <span
              className={`font-semibold whitespace-nowrap ${
                navTab === "All Guns"
                  ? "text-[#fcb12d] max-[374px]:max-w-20 max-[374px]:opacity-100"
                  : "max-[374px]:max-w-0 max-[374px]:opacity-0"
              }`}
            >
              Builds
            </span>
          </label>

          {/* About */}
          <label
            className={`nav-tab-btn flex max-[374px]:overflow-hidden transition-all duration-500 p-2 gap-2 ${
              showSelected && navTab === "About" ? "selected" : ""
            } ${
              navTab === "About"
                ? "bg-[#ffffff34] rounded-lg max-[374px]:w-22"
                : "max-[374px]:w-10 max-[374px]:bg-transparent"
            }`}
            onClick={() => handleTabChange("About")}
          >
            <input
              type="radio"
              name="nav-tab"
              className="hidden"
              value="About"
              checked={navTab === "About"}
              readOnly
            />
            <HugeiconsIcon
              icon={BadgeInfoIcon}
              className={`${navTab === "About" ? "text-[#fcb12d]" : ""} shrink-0`}
            />
            <span
              className={`font-semibold whitespace-nowrap ${
                navTab === "About"
                  ? "text-[#fcb12d] max-[374px]:max-w-20 max-[374px]:opacity-100"
                  : "max-[374px]:max-w-0 max-[374px]:opacity-0"
              }`}
            >
              About
            </span>
          </label>

          <svg
            className="outline"
            overflow="visible"
            width="500"
            height="60"
            viewBox="0 0 400 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="rect"
              pathLength="100"
              x="0"
              y="0"
              width="500"
              height="60"
              fill="transparent"
              strokeWidth="2"
            ></rect>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
