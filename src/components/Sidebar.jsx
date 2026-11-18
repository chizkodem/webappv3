import React, { useEffect, useRef, useState, Fragment } from "react";
import "../css/sidebar.css";
import { gunTypes } from "../services/gunCat";
import {
  DashboardSquareAddIcon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
  SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home11Icon } from "@hugeicons/core-free-icons";
import SidebarLeftIcon from "@hugeicons/core-free-icons/SidebarLeftIcon";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const Sidebar = ({
  showAddGun,
  selectedTab,
  setSelectedTab,
  scrollToCategory,
  selectedSideBar,
  setSelectedSideBar,
  showSideBar,
  setShowSideBar,
  windowSize,
  setWindowSize,
  sideBarButtonRef,
  setNavTab,
  user,
}) => {
  const sideBarRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [hoverSideBar, setHoverSideBar] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTab === "Meta") {
      setSelectedSideBar("");
    }
    if (selectedTab === "Home") {
      setSelectedSideBar("");
    }
    if (selectedTab === "All Guns") {
      setSelectedSideBar("");
    }
    if (selectedTab === "chizpage") {
      setSelectedSideBar("");
    }
  }, [selectedTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target) &&
        !sideBarButtonRef.current?.contains(event.target) &&
        document.documentElement.clientWidth < 926
      ) {
        setShowSideBar(false);
        setMinimized(true);
        setHover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = document.documentElement.clientWidth;

      setWindowSize(width);

      if (width > 926) {
        setShowSideBar(true);
        setMinimized(false);
      }

      if (width < 926) {
        setMinimized(true);
        setShowSideBar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (document.documentElement.clientWidth <= 926 && !hoverSideBar) {
      setShowSideBar(false);
      setMinimized(true);
      setHover(false);
      console.log(hoverSideBar);
    }
  }, [hoverSideBar, selectedTab]);

  const handleSidebarClick = () => {
    if (selectedTab === "Home") {
      navigate("/Builds");
      setSelectedTab("All Guns");
      setNavTab("All Guns");
    }
    if (selectedTab === "chizpage") {
      navigate("/Builds");
      setSelectedTab("All Guns");
      setNavTab("All Guns");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out!");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div
      ref={sideBarRef}
      onMouseOver={() => {
        setHover(true);
        setHoverSideBar(true);
      }}
      onMouseLeave={() => {
        setHover(!minimized);
      }}
      className={`sidebar-container mt-22 flex flex-col border-r border-[#faaf2d4b] duration-500 rounded-3xl justify-between h-[calc(100vh-90px)] ${minimized ? "w-23" : "w-70"} p-2 max-[926px]:bg-[#090a0e] shadow-[10px_0_10px_rgba(255, 170, 0, 0.08)] z-50 relative
                  max-[926px]:absolute max-[926px]:h-fit max-[926px]:top-4/10 max-[926px]:-translate-y-1/2 max-[926px]:rounded-2xl  ${showSideBar ? "max-[926px]:translate-x-[15%]" : "-translate-x-full"} ${
                    selectedTab === "All Guns" ? "" : "duration-500"
                  }`}
    >
      <div
        className={`absolute top-2 left-8/10 z-10 justify-center items-center h-15 w-15 ${hover ? "flex" : "hidden"}
                    `}
        onClick={() => setMinimized((prev) => !prev)}
      >
        {minimized ? (
          <HugeiconsIcon icon={SidebarRightIcon} />
        ) : (
          <HugeiconsIcon icon={SidebarLeftIcon} />
        )}
      </div>
      <div
        className={`p-4 min-[926px]:hidden -z-1 absolute border transition-all duration-300 border-[#fab02d] bg-[#000000ce] -translate-y-1/2 translate-x-1/2 ${
          showSideBar
            ? "right-1/2 -bottom-21 border-t-0 rounded-b-4xl opacity-0"
            : "-right-7 bottom-1/2 border-l-0 rounded-r-4xl opacity-100"
        }`}
        ref={sideBarButtonRef}
        onClick={() => setShowSideBar((prev) => !prev)}
      >
        <HugeiconsIcon
          icon={showSideBar ? SidebarLeft01Icon : SidebarRight01Icon}
          className="sidebar-button scale-150 max-[490px]:scale-100 text-[#fab02d]"
        />
      </div>
      <div
        className="sidebar-radio-container overflow-hidden top-0 left-0"
        style={{
          "--total-radio":
            selectedTab === "All Guns"
              ? 7
              : selectedTab === "Home"
                ? 8
                : selectedTab === "Meta" || "chizpage"
                  ? 8
                  : 7,
        }}
      >
        {selectedTab !== "All Guns" && selectedTab !== "Home" && (
          <>
            <input
              type="radio"
              name="radio"
              id="All Guns"
              checked={selectedSideBar === "All Guns"}
              value="All Guns"
              onChange={(e) => setSelectedSideBar(e.target.value)}
              onClick={() => {
                scrollToCategory("All Guns");
                handleSidebarClick();
              }}
            />
            <label
              htmlFor="All Guns"
              className={`flex items-center gap-1 ${selectedSideBar === "All Guns" ? "font-bold" : "font-semibold"}`}
            >
              <div className="">
                <img
                  src={`https://raw.githubusercontent.com/chizkodem/images-storage/refs/heads/main/All Guns.svg`}
                  alt=""
                  className={`aspect-video scale-150 w-9  object-contain ${selectedSideBar === "All Guns" ? "icon-gold" : "icon-gray"} duration-500`}
                />
              </div>
              <p
                className={`${minimized ? "opacity-0 duration-100" : "opacity-100 delay-150 duration-500"} absolute left-14`}
              >
                All Guns
              </p>
            </label>
          </>
        )}

        {gunTypes
          .filter((category) =>
            selectedTab === "All Guns"
              ? category !== "Extras" && category !== "All Guns"
              : selectedTab === "Home"
                ? category !== "All Guns"
                : category !== "Extras" && category !== "All Guns",
          )
          .map((category) => (
            <Fragment key={category}>
              <input
                type="radio"
                name="radio"
                id={category}
                checked={selectedSideBar === category}
                value={category}
                onChange={(e) => setSelectedSideBar(e.target.value)}
              />
              <label
                htmlFor={category}
                className={`flex items-center gap-1 ${selectedSideBar === category ? "font-bold" : "font-semibold"} relative`}
                onClick={() => {
                  scrollToCategory(category);
                  handleSidebarClick();
                }}
              >
                <div className="">
                  <img
                    src={`https://raw.githubusercontent.com/chizkodem/images-storage/refs/heads/main/${category}.svg`}
                    alt=""
                    className={`aspect-video w-9 -rotate-30 object-contain ${selectedSideBar === category ? "icon-gold" : "icon-gray"} duration-500`}
                  />
                </div>
                <p
                  className={`${minimized ? "opacity-0 duration-100" : "opacity-100 delay-150 duration-500"} absolute left-14`}
                >
                  {category}
                </p>
              </label>
            </Fragment>
          ))}

        <div
          className={`glider-container ${selectedSideBar === "" ? "hiddden" : ""}`}
        >
          <div
            className={`glider ${selectedSideBar === "" ? "hidden" : ""}`}
          ></div>
        </div>
      </div>

      {user && (
        <button className="logout-Btn mx-auto" onClick={handleLogout}>
          <div className="logout-sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>
          <div className="logout-text">Logout</div>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
