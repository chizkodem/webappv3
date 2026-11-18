import React, { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home11Icon,
  SearchIcon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
} from "@hugeicons/core-free-icons";
import AtomicPowerIcon from "@hugeicons/core-free-icons/AtomicPowerIcon";
import AmmoIcon from "@hugeicons/core-free-icons/AmmoIcon";
import BadgeInfoIcon from "@hugeicons/core-free-icons/BadgeInfoIcon";
import TiktokIcon from "@hugeicons/core-free-icons/TiktokIcon";
import "../css/Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({
  showAddGun,
  setShowAddGun,
  setSelectedTab,
  setPreviousTab,
  setShowGunsmith,
  selectedTab,
  previousTab,
  selectedSideBar,
  setSelectedSideBar,
  setShowSideBar,
  showSideBar,
  showSelected,
  setShowSelected,
  navTab,
  setNavTab,
  sideBarButtonRef,
  searchQueries,
  setSearchQueries,
}) => {
  const searchRef = useRef(null);
  const timerRef = useRef(null);
  const [revealSearch, setRevealSearch] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const routes = {
      "/": "Home",
      "/Metas": "Meta",
      "/Builds": "All Guns",
      "/about": "About",
      "/chiz": "chizpage",
    };

    setSelectedTab(routes[location.pathname]);
    setNavTab(routes[location.pathname]);
  }, [location.pathname]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setRevealSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabChange = (newTab) => {
    const routes = {
      Home: "/",
      Meta: "/Metas",
      "All Guns": "/Builds",
      About: "/about",
      chizpage: "/chiz",
    };

    setSelectedTab(newTab);
    setNavTab(newTab);
    navigate(routes[newTab]);
    handleNavClick(newTab);
  };

  const handleNavClick = (value) => {
    setNavTab(value);
    setShowSelected(true);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setShowSelected(false);
    }, 2000);
  };

  return (
    <div className="navbar fixed flex w-full h-22 px-10 max-lg:px-5 shadow-[1px_1px_5px_#fab02d] z-60 bg-[#000000]">
      <div className="navbar-content flex items-center justify-between w-full">
        <div className="flex items-center">
          {/* chizpage logo */}
          <div
            className="flex max-2xl:mr-5 max-xl:mr-0 mr-20 items-center cursor-pointer relative"
            onClick={() => {
              handleTabChange("chizpage");
            }}
          >
            <div className="relative">
              <img
                src="https://ik.imagekit.io/chizwebappv3/chizkodemlogo.png?updatedAt=1794040487219"
                alt=""
                className="w-20 aspect-square
                         max-[490px]:w-15"
              />
              <div
                className={`absolute -z-1 outside-circle transition-all duration-1000 w-20 overflow-hidden rounded-[100vh] aspect-square bg-transparent top-1/2 left-1/2 -translate-1/2 ${
                  navTab === "chizpage" ? "scale-100" : "scale-50"
                }`}
              >
                <div
                  className={`spinthing absolute -z-1 outside-circle transition-all duration-1000 w-50 h-5  top-1/2 left-1/2 -translate-1/2  ${
                    navTab === "chizpage"
                      ? "bg-[#fab02d] rotate-765"
                      : "bg-transparent -rotate-45"
                  }`}
                ></div>
                <div className="inner-circle absolute w-17 aspect-square top-1/2 left-1/2 -translate-1/2 bg-black rounded-[40vh]"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold max-sm:hidden z-1">
              <span className="text-white">CHIZ</span>
              <span className="text-[#fcb12d]">KODEM</span>
            </h1>
            <h1 className="text-3xl font-bold max-sm:hidden absolute top-10 left-38.25 -translate-1/2">
              <span className="text-[#fcb12d]">CHIZ</span>
              <span className="text-[#5e5e5e] ">KODEM</span>
            </h1>
          </div>
        </div>

        {/* tab buttons */}
        <div className="nav-tab max-[926px]:hidden">
          <div className="nav-tab-container p-2 gap-10 max-lg:gap-5">
            <label
              className={`nav-tab-btn flex p-2 gap-2 ${
                showSelected && navTab === "Home" ? "selected" : ""
              } ${navTab === "Home" ? "bg-[#ffffff34] rounded-lg" : ""}`}
            >
              <input
                type="radio"
                name="nav-tab"
                className="hidden"
                value="Home"
                checked={navTab === "Home"}
                onChange={() => {
                  handleTabChange("Home");
                }}
              />
              <HugeiconsIcon
                icon={Home11Icon}
                className={`${navTab === "Home" ? "text-[#fcb12d]" : ""}`}
              />
              <span
                className={`font-semibold ${navTab === "Home" ? "text-[#fcb12d]" : ""}`}
              >
                Home
              </span>
            </label>

            <label
              className={`nav-tab-btn p-2 flex gap-2 ${
                showSelected && navTab === "Meta" ? "selected" : ""
              } ${navTab === "Meta" ? "bg-[#ffffff34] rounded-lg" : ""}`}
            >
              <input
                type="radio"
                name="nav-tab"
                className="hidden"
                value="Meta"
                checked={navTab === "Meta"}
                onChange={() => {
                  handleTabChange("Meta");
                }}
              />
              <HugeiconsIcon
                icon={AtomicPowerIcon}
                className={`${navTab === "Meta" ? "text-[#fcb12d]" : ""}`}
              />
              <span
                className={`font-semibold ${navTab === "Meta" ? "text-[#fcb12d]" : ""}`}
              >
                Meta
              </span>
            </label>

            <label
              className={`nav-tab-btn flex p-2 gap-2 ${
                showSelected && navTab === "All Guns" ? "selected" : ""
              } ${navTab === "All Guns" ? "bg-[#ffffff34] rounded-lg" : ""}`}
            >
              <input
                type="radio"
                name="nav-tab"
                className="hidden"
                value="All Guns"
                checked={navTab === "All Guns"}
                onChange={() => {
                  handleTabChange("All Guns");
                }}
              />
              <HugeiconsIcon
                icon={AmmoIcon}
                className={`${navTab === "All Guns" ? "text-[#fcb12d]" : ""}`}
              />
              <span
                className={`font-semibold ${navTab === "All Guns" ? "text-[#fcb12d]" : ""}`}
              >
                Builds
              </span>
            </label>

            <label
              className={`nav-tab-btn flex p-2 gap-2 ${
                showSelected && navTab === "About" ? "selected" : ""
              } ${navTab === "About" ? "bg-[#ffffff34] rounded-lg" : ""}`}
            >
              <input
                type="radio"
                name="nav-tab"
                className="hidden"
                value="About"
                checked={navTab === "About"}
                onChange={() => {
                  handleTabChange("About");
                }}
              />
              <HugeiconsIcon
                icon={BadgeInfoIcon}
                className={`${navTab === "About" ? "text-[#fcb12d]" : ""}`}
              />
              <span
                className={`font-semibold ${navTab === "About" ? "text-[#fcb12d]" : ""}`}
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

        {/* search bar */}
        <div className="flex gap-5 max-2xl:gap-2.5 items-center">
          <div className="search-container max-2xl:w-50 flex max-xl:hidden">
            <button>
              <svg
                width="17"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <input
              className="input"
              placeholder="Search for a gun..."
              type="text"
              value={searchQueries}
              onChange={(e) => setSearchQueries(e.target.value)}
            />
            <button
              className="reset"
              type="reset"
              onClick={(e) => setSearchQueries("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* search bar for small devices */}
          <div
            ref={searchRef}
            className="relative mr-6  max-[490px]:mr-4 xl:hidden"
          >
            <div
              className={`absolute left-1/2 -translate-1/2 h-10 w-10 max-[490px]:h-8 max-[490px]:w-8 pl-4 transition-all duration-300 ${
                revealSearch
                  ? "w-50 max-[490px]:w-50  max-[490px]:h-10 border-b-2 border-[#fab02d] bg-[#444] rounded-none top-16"
                  : "border-transparent bg-[#fab02d] rounded-4xl top-1/2"
              }`}
              onClick={() => setRevealSearch(true)}
            >
              <div className="flex w-full h-full items-center justify-center">
                <HugeiconsIcon
                  icon={SearchIcon}
                  className={`shrink-0 max-[490px]:scale-80 ${
                    revealSearch ? "text-[#fab02d]" : " text-black"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Seach for a gun..."
                  className="w-full min-w-0 outline-none p-2"
                  value={searchQueries}
                  onChange={(e) => setSearchQueries(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* light switch with follow button */}
          <div className=" flex items-center gap-5 max-2xl:gap-2.5">
            <label className="theme-switch max-2xl:[--toggle-size:12px] max-xl:[--toggle-size:9px]">
              <input type="checkbox" className="theme-switch__checkbox" />
              <div className="theme-switch__container">
                <div className="theme-switch__clouds"></div>
                <div className="theme-switch__stars-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 144 55"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="theme-switch__circle-container">
                  <div className="theme-switch__sun-moon-container">
                    <div className="theme-switch__moon">
                      <div className="theme-switch__spot"></div>
                      <div className="theme-switch__spot"></div>
                      <div className="theme-switch__spot"></div>
                    </div>
                  </div>
                </div>
              </div>
            </label>

            <div>
              <button className="flex bg-[#fab02d] text-black font-bold px-3 p-3 max-2xl:p-3 max-2xl:px-2 max-xl:px-3 rounded-2xl max-[490px]:px-1! max-[490px]:p-1!  max-[490px]:rounded-md">
                <HugeiconsIcon icon={TiktokIcon} className="fill-black" />
                <p className=" max-xl:hidden">Follow on TikTok</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
