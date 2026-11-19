import "./App.css";
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import AddGun from "./components/AddGun";
import Sidebar from "./components/Sidebar";
import MainPage from "./components/MainPage";
import MetaPage from "./components/MetaPage";
import GunsPage from "./components/GunsPage";
import GunsmithPage from "./components/GunsmithPage";
import { db } from "./services/firebase";
import { ref, onValue } from "firebase/database";
import BottomBar from "./components/BottomBar";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AboutPage from "./components/AboutPage";
import Chiz from "./components/Chiz";
import LoginPage from "./components/LoginPage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

function App() {
  const [showAddGun, setShowAddGun] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Home");
  const [previousTab, setPreviousTab] = useState("Home");
  const [showGunsmith, setShowGunsmith] = useState(false);
  const [gunData, setGunData] = useState(null);
  const [metaGunData, setMetaGunData] = useState([]);
  const [selectedSideBar, setSelectedSideBar] = useState("");
  const categoryRefs = useRef({});
  const [showSideBar, setShowSideBar] = useState(false);
  const [showSelected, setShowSelected] = useState("");
  const [navTab, setNavTab] = useState("Home");
  const [windowSize, setWindowSize] = useState(0);
  const sideBarButtonRef = useRef(null);
  const [searchQueries, setSearchQueries] = useState("");
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollToCategory = (category) => {
    categoryRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const gunsRef = ref(db, "guns");

    const unsubscribe = onValue(gunsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const gunsArray = Object.entries(data).map(([id, gun]) => ({
          id,
          ...gun,
        }));

        setMetaGunData(gunsArray);
      } else {
        setMetaGunData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const containerRef = useRef(null);
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const generateLogos = () => {
      const { width, height } = container.getBoundingClientRect();

      if (!width || !height) return;

      const result = [];

      const totalLogos = Math.min(
        100,
        Math.max(12, Math.floor((width * height) / 20000)),
      );

      for (let i = 0; i < totalLogos; i++) {
        let placed = false;

        for (let attempt = 0; attempt < 100; attempt++) {
          const size = 80 + Math.random() * 50;

          const x = Math.random() * width;
          const y = Math.random() * height;

          const radius = size * 0.72;

          const overlaps = result.some((logo) => {
            const distance = Math.hypot(logo.x - x, logo.y - y);

            return distance < logo.radius + radius + 12;
          });

          if (!overlaps) {
            result.push({
              id: i,
              x,
              y,
              size,
              radius,
              rotation: Math.random() * 360,
            });

            placed = true;
            break;
          }
        }

        if (!placed) continue;
      }

      setLogos(result);
    };

    generateLogos();

    const observer = new ResizeObserver(generateLogos);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <div ref={containerRef} className="relative h-screen">
        <div className="logo-pattern">
          {logos.map((logo) => (
            <img
              key={logo.id}
              src="https://ik.imagekit.io/chizwebappv3/chizkodemlogo.png"
              alt=""
              style={{
                position: "absolute",
                top: `${logo.y}px`,
                left: `${logo.x}px`,
                width: `${logo.size}px`,
                height: `${logo.size}px`,
                transform: `translate(-50%, -50%) rotate(${logo.rotation}deg)`,
              }}
            />
          ))}
        </div>
        <Navbar
          setSelectedTab={setSelectedTab}
          setPreviousTab={setPreviousTab}
          selectedTab={selectedTab}
          previousTab={previousTab}
          setShowGunsmith={setShowGunsmith}
          selectedSideBar={selectedSideBar}
          setSelectedSideBar={setSelectedSideBar}
          setShowSideBar={setShowSideBar}
          setShowSelected={setShowSelected}
          showSelected={showSelected}
          navTab={navTab}
          setNavTab={setNavTab}
          showSideBar={showSideBar}
          sideBarButtonRef={sideBarButtonRef}
          searchQueries={searchQueries}
          setSearchQueries={setSearchQueries}
        />
        <div className="flex ">
          <Sidebar
            showAddGun={showAddGun}
            setShowAddGun={setShowAddGun}
            setSelectedTab={setSelectedTab}
            scrollToCategory={scrollToCategory}
            selectedTab={selectedTab}
            selectedSideBar={selectedSideBar}
            setSelectedSideBar={setSelectedSideBar}
            showSideBar={showSideBar}
            setShowSideBar={setShowSideBar}
            setWindowSize={setWindowSize}
            windowSize={windowSize}
            sideBarButtonRef={sideBarButtonRef}
            setNavTab={setNavTab}
            navTab={navTab}
            user={user}
          />

          <div
            className={`all-page-container mt-22 relative max-h-[calc(100vh-88px)] overflow-auto flex w-full ${showGunsmith ? "hidden" : "block"} p-5 pb-0
                       max-lg:px-4! max-sm:p-0!`}
          >
            <Routes>
              <Route
                path="/chiz"
                element={
                  <div className={`w-full h-fit max-[926px]:pb-26`}>
                    <Chiz
                      selectedTab={selectedTab}
                      previousTab={previousTab}
                      metaGunData={metaGunData}
                      setShowGunsmith={setShowGunsmith}
                      setGunData={setGunData}
                      categoryRefs={categoryRefs}
                      searchQueries={searchQueries}
                      setSearchQueries={setSearchQueries}
                      guns={metaGunData}
                    />
                  </div>
                }
              />
              <Route
                path="/"
                element={
                  <div className={`w-full h-fit max-[926px]:mb-26!`}>
                    <MainPage
                      setShowGunsmith={setShowGunsmith}
                      setGunData={setGunData}
                      selectedTab={selectedTab}
                      setWindowSize={setWindowSize}
                      windowSize={windowSize}
                    />
                  </div>
                }
              />

              <Route
                path="/Metas"
                element={
                  <div className={` w-full pb-0`}>
                    <MetaPage
                      selectedTab={selectedTab}
                      previousTab={previousTab}
                      metaGunData={metaGunData}
                      setShowGunsmith={setShowGunsmith}
                      setGunData={setGunData}
                      categoryRefs={categoryRefs}
                      searchQueries={searchQueries}
                      setSearchQueries={setSearchQueries}
                      user={user}
                    />
                  </div>
                }
              />

              <Route
                path="/Builds"
                element={
                  <div className={` w-full`}>
                    <GunsPage
                      selectedTab={selectedTab}
                      previousTab={previousTab}
                      guns={metaGunData}
                      setShowGunsmith={setShowGunsmith}
                      setGunData={setGunData}
                      categoryRefs={categoryRefs}
                      scrollToCategory={scrollToCategory}
                      selectedSideBar={selectedSideBar}
                      searchQueries={searchQueries}
                      setSearchQueries={setSearchQueries}
                    />
                  </div>
                }
              />

              <Route
                path="/about"
                element={
                  <div className={` w-full`}>
                    <AboutPage />
                  </div>
                }
              />

              <Route
                path="/Upload"
                element={
                  <div className={`w-full`}>
                    <AddGun user={user} />
                  </div>
                }
              />

              <Route
                path="/attachments/:gunName"
                element={
                  <div
                    className={`gunsmith-containers flex w-full p-5 max-[600px]:p-0 max-[600px]:pt-5 h-fit`}
                  >
                    <GunsmithPage
                      gunData={gunData}
                      setShowGunsmith={setShowGunsmith}
                    />
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="w-full">
                    <LoginPage user={user} />
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
        <BottomBar
          setSelectedTab={setSelectedTab}
          setPreviousTab={setPreviousTab}
          selectedTab={selectedTab}
          previousTab={previousTab}
          setShowGunsmith={setShowGunsmith}
          selectedSideBar={selectedSideBar}
          setSelectedSideBar={setSelectedSideBar}
          setShowSelected={setShowSelected}
          showSelected={showSelected}
          navTab={navTab}
          setNavTab={setNavTab}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
