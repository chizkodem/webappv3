import { useEffect, useState } from "react";
import ImageDropZone from "./ImageDropZone";
import "../css/gunTypeRadio.css";
import "../css/upload.css";
import { gunTypes } from "../services/gunCat";
import { ref, push, get, set, update } from "firebase/database";
import { auth, db } from "../services/firebase";
import { deleteFromImageKit, uploadToImageKit } from "../services/imagekit";
import { attachmentOptions } from "../services/attachments";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  Cancel02Icon,
  CloudUploadIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import LazyAttachmentImage from "./LazyAttachmentImage";

const AddGun = () => {
  const [gunName, setGunName] = useState("");
  const [iconImage, setIconImage] = useState(null);
  const [buildType, setBuildType] = useState("");
  const [gunType, setGunType] = useState("");
  const [notes, setNotes] = useState("");
  const [sideNotes, setSideNotes] = useState("");
  const [releaseOrder, setReleaseOrder] = useState("");
  const [playStyle, setPlayStyle] = useState("");
  const [range, setRange] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loadoutCode, setLoadoutCode] = useState("");
  const [priority, setPriority] = useState("");
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  const [attachments, setAttachments] = useState({
    muzzle: "",
    barrel: "",
    optic: "",
    stock: "",
    perk: "",
    laser: "",
    underBarrel: "",
    ammunition: "",
    rearGrip: "",
    triggerAction: "",
    guard: "",
  });

  const attachmentFields = [
    "muzzle",
    "barrel",
    "optic",
    "stock",
    "perk",
    "laser",
    "underBarrel",
    "ammunition",
    "rearGrip",
    "triggerAction",
    "guard",
  ];

  const navigate = useNavigate();

  console.log(checked);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setChecked(true);

    if (
      !gunName.trim() ||
      !gunType ||
      !buildType.trim() ||
      !playStyle.trim() ||
      !range.trim() ||
      !difficulty.trim() ||
      !loadoutCode.trim()
    ) {
      if (gunName === "") {
        alert("gun name is Empty ");
      } else if (gunType === "") {
        alert("gun type is Empty ");
      } else if (buildType.trim() === "") {
        alert("build type is Empty ");
      } else if (playStyle.trim() === "") {
        alert("playstyle is Empty ");
      } else if (range.trim() === "") {
        alert("range is Empty ");
      } else if (difficulty.trim() === "") {
        alert("difficulty is Empty ");
      } else if (loadoutCode.trim() === "") {
        alert("loadoutCode is Empty ");
      }
      return;
    }

    const attachmentCount = Object.values(attachments).filter(
      (value) => value.trim() !== "",
    ).length;

    if (attachmentCount > 5) {
      alert("Maximum of 5 attachments allowed.");
      return;
    }

    try {
      const gunsRef = ref(db, "guns");
      const snapshot = await get(gunsRef);
      const gunsData = snapshot.val() || {};

      // Find an existing gun first
      const existingGun = Object.entries(gunsData).find(
        ([, gun]) =>
          gun.gunName?.trim().toLowerCase() === gunName.trim().toLowerCase() &&
          gun.gunType === gunType,
      );

      const buildName = buildType.trim();

      let gunId;
      let iconData = null;
      let oldIconFileId = null;

      if (!existingGun && !iconImage) {
        alert("Please upload a gun icon.");
        return;
      }
      let finalPriority = priority.trim();

      if (existingGun) {
        const [existingId, gunData] = existingGun;

        gunId = existingId;
        oldIconFileId = gunData.iconFileId || null;

        const builds = gunData.builds || {};

        const currentPriority = gunData.priority?.trim() || "";
        finalPriority = priority.trim() || currentPriority;

        if (
          finalPriority &&
          finalPriority !== buildName &&
          !builds[finalPriority]
        ) {
          alert("Priority build doesn't exist!");
          return;
        }

        if (!finalPriority) {
          alert("Please set a priority build!");
          return;
        }

        if (iconImage) {
          iconData = await uploadToImageKit(
            iconImage,
            "/chiz-attachments-v3/guns",
          );
        }
      } else {
        finalPriority = priority.trim();

        if (!finalPriority) {
          alert("Please set a priority build!");
          return;
        }

        if (finalPriority !== buildName) {
          alert("Priority build doesn't exist!");
          return;
        }
        iconData = await uploadToImageKit(
          iconImage,
          "/chiz-attachments-v3/guns",
        );
      }

      // Prepare build data
      const buildData = {
        attachments,
        sideNotes,
        notes: notes.trim(),
        range,
        difficulty,
        loadoutCode,
        playStyle,
      };

      if (existingGun) {
        const updates = {
          [`builds/${buildName}`]: buildData,
          priority: finalPriority,
        };

        if (releaseOrder !== "") {
          updates.releaseOrder = releaseOrder;
        }

        if (iconData) {
          updates.iconURL = iconData.url;
          updates.iconFileId = iconData.fileId;
        }

        try {
          await update(ref(db, `guns/${gunId}`), updates);
        } catch (error) {
          // Clean up the newly uploaded image if Firebase fails
          if (iconData?.fileId) {
            try {
              await deleteFromImageKit(iconData.fileId);
            } catch (deleteError) {
              console.error("Failed to clean up new icon:", deleteError);
            }
          }

          throw error;
        }

        // Firebase succeeded, so now delete the old image
        if (iconData && oldIconFileId) {
          try {
            await deleteFromImageKit(oldIconFileId);
          } catch (error) {
            console.error("Failed to delete old icon:", error);
          }
        }

        setChecked(false);
        setBuildType("");
        setPriority("");
        setReleaseOrder("");
        setLoadoutCode("");
        alert("Build added successfully!");
      } else {
        const newGunRef = push(gunsRef);

        try {
          await set(newGunRef, {
            gunName: gunName.trim(),
            gunType,
            iconURL: iconData.url,
            iconFileId: iconData.fileId,
            priority: finalPriority,
            releaseOrder,
            builds: {
              [buildName]: buildData,
            },
          });
        } catch (error) {
          try {
            await deleteFromImageKit(iconData.fileId);
          } catch (deleteError) {
            console.error("Failed to clean up new icon:", deleteError);
          }

          throw error;
        }

        setChecked(false);
        setBuildType("");
        setPriority("");
        setReleaseOrder("");
        setLoadoutCode("");
        alert("Gun and build added successfully!");
      }

      setIconImage(null);
    } catch (error) {
      console.error("Error adding gun/build:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const attachmentsCount = Object.values(attachments).filter(
    (value) => value.trim() !== "",
  ).length;

  const handleBuildTypeChange = (e) => {
    setBuildType(e.target.value);
  };

  return (
    <section>
      <div className="border upload-hero-container w-full h-35 flex rounded-2xl border-[#faaf2d8e] mb-5">
        <div className="flex items-center justify-center w-full gap-2">
          <div className="scale-500 mr-12 relative">
            <HugeiconsIcon icon={CloudUploadIcon} className="text-[#fab02d]" />
          </div>
          <div>
            <h1 className="text-5xl font-bold italic">
              Upload a Gun <span className="text-[#fab02d]">Build</span>
            </h1>
            <h2 className="text-xl">
              Share your loadout with the community and help other players
              dominate in CODM!
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="upload-form-container w-full grid grid-cols-[2fr_1fr] gap-5"
      >
        <div className="p-4 w-full border border-[#faaf2d93] rounded-2xl">
          <div className="flex flex-wrap gap-2">
            <div className="bg-[#2022299a] p-2 rounded-2xl border border-[#474747c0]">
              <p>Weapon Name</p>
              <input
                type="text"
                placeholder="Gun Name"
                value={gunName}
                onChange={(e) => setGunName(e.target.value)}
                className={`${checked && !gunName ? "empty" : ""}`}
              />
            </div>

            <div className="bg-[#2022299a] px-2 rounded-2xl border border-[#474747c0] flex flex-col justify-center">
              {" "}
              <p>Built Type</p>
              <div
                className={`customCheckBoxHolder ${checked && !buildType ? "border border-red-700 rounded-xl" : ""}`}
              >
                <input
                  className={`customCheckBoxInput`}
                  id="cCB1"
                  name="gunType"
                  type="radio"
                  value="Main"
                  checked={buildType === "Main"}
                  onChange={handleBuildTypeChange}
                />
                <label className="customCheckBoxWrapper" htmlFor="cCB1">
                  <div className="customCheckBox">
                    <div className="inner">Main</div>
                  </div>
                </label>

                <input
                  className="customCheckBoxInput"
                  id="cCB2"
                  name="gunType"
                  type="radio"
                  value="Red Dot"
                  checked={buildType === "Red Dot"}
                  onChange={handleBuildTypeChange}
                />
                <label className="customCheckBoxWrapper" htmlFor="cCB2">
                  <div className="customCheckBox">
                    <div className="inner">Red Dot</div>
                  </div>
                </label>

                <input
                  className="customCheckBoxInput"
                  id="cCB3"
                  name="gunType"
                  type="radio"
                  value="AR"
                  checked={buildType === "AR"}
                  onChange={handleBuildTypeChange}
                />
                <label className="customCheckBoxWrapper" htmlFor="cCB3">
                  <div className="customCheckBox">
                    <div className="inner">AR</div>
                  </div>
                </label>

                <input
                  className="customCheckBoxInput"
                  type="radio"
                  id="cCB4"
                  name="gunType"
                  value="SMG"
                  checked={buildType === "SMG"}
                  onChange={handleBuildTypeChange}
                />
                <label className="customCheckBoxWrapper" htmlFor="cCB4">
                  <div className="customCheckBox">
                    <div className="inner">SMG</div>
                  </div>
                </label>

                <div className="customBuildTypeContainer ml-5">
                  <input
                    type="text"
                    placeholder="custom build type"
                    value={buildType}
                    onChange={handleBuildTypeChange}
                    className="border"
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full gap-5">
              <div className="gunType bg-[#2022299a] p-2 rounded-2xl border border-[#474747c0]">
                <p>Gun Category</p>
                <select
                  value={gunType}
                  onChange={(e) => setGunType(e.target.value)}
                  className={`w-full p-2 rounded-md border text-[rgb(160,160,160)] border-[rgb(83,83,83)] ${checked && !gunType ? "border border-red-700 rounded-xl" : ""}`}
                >
                  <option value="" disabled>
                    Select Gun Type
                  </option>

                  {gunTypes
                    .filter((type) => type !== "All Guns")
                    .map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-[#15171f9a] text-white"
                      >
                        {type}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-[#2022299a] p-2 rounded-2xl border border-[#474747c0]">
                <p>Set Priority</p>
                <input
                  type="text"
                  placeholder="Set Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`border ${checked && !priority ? "border border-red-700 rounded-xl" : ""}`}
                />
              </div>

              <div className="bg-[#2022299a] p-2 rounded-2xl border border-[#474747c0]">
                <p>Release Order</p>
                <input
                  type="number"
                  value={releaseOrder}
                  onChange={(e) => setReleaseOrder(e.target.value)}
                  placeholder="Release order"
                  className="border"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="attachments-container mb-5 w-full z-10 border border-[#242424] bg-[#3b3b3b33] rounded-2xl p-1 mt-2">
            <p className="text-2xl font-semibold">Attachments</p>

            <div className="flex flex-wrap w-full gap-3">
              {attachmentFields.map((field) => (
                <div
                  key={field}
                  className="flex relative flex-col w-full max-w-60 z-10 bg-[#2022299a] p-2 rounded-2xl border border-[#474747c0]"
                >
                  <div className="flex justify-between">
                    <p>{field}</p>
                    {attachments[field] && (
                      <HugeiconsIcon
                        icon={Cancel02Icon}
                        className="text-red-600"
                        onClick={() =>
                          setAttachments((prev) => ({ ...prev, [field]: "" }))
                        }
                      />
                    )}
                  </div>
                  <input
                    list={`suggestions-${field}`}
                    className="border disabled:bg-gray-900 z-10 disabled:cursor-not-allowed"
                    disabled={
                      attachmentsCount >= 5 && attachments[field].trim() === ""
                    }
                    placeholder="..."
                    value={attachments[field]}
                    onChange={(e) =>
                      setAttachments((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  />

                  <datalist id={`suggestions-${field}`}>
                    {attachmentOptions[field]?.map((option, index) => (
                      <option
                        key={`${field}-${option}-${index}`}
                        value={option}
                      />
                    ))}
                  </datalist>
                </div>
              ))}
            </div>
          </div>

          {/* Other information */}
          <div className="flex gap-5">
            <div className="bg-[#2022299a] p-2 rounded-2xl border border-[#474747c0]">
              <p>Loadout Code</p>
              <input
                type="text"
                placeholder="Loadout Code..."
                value={loadoutCode}
                onChange={(e) => setLoadoutCode(e.target.value)}
                className={`border ${checked && !loadoutCode ? "empty" : ""}`}
              />
            </div>

            <div className="bg-[#2022299a]  p-2 rounded-2xl border border-[#474747c0]">
              <p>Play Style</p>
              <select
                value={playStyle}
                onChange={(e) => setPlayStyle(e.target.value)}
                className={`bg-[#2022299a] text-white border border-[#57535a] rounded-xl px-4 py-2 outline-none cursor-pointer ${checked && !playStyle ? "border border-red-700 rounded-xl" : ""}`}
              >
                <option value="Passive" className="bg-[#15171f9a] text-white">
                  Passive
                </option>
                <option value="Agressive" className="bg-[#15171f9a] text-white">
                  Agressive
                </option>
                <option
                  value="Passive/Aggressive"
                  className="bg-[#15171f9a] text-white"
                >
                  Passive/Aggressive
                </option>
              </select>
            </div>

            <div className="bg-[#2022299a]  p-2 rounded-2xl border border-[#474747c0]">
              <p>Range</p>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className={`bg-[#2022299a] text-white border border-[#57535a] rounded-xl px-4 py-2 outline-none cursor-pointer ${checked && !range ? "border border-red-700 rounded-xl" : ""}`}
              >
                <option value="Close - Mid">Close - Mid</option>
                <option value="Mid - Long">Mid - Long</option>
                <option value="Close - Long">Close - Long</option>
              </select>
            </div>

            <div className="bg-[#2022299a]  p-2 rounded-2xl border border-[#474747c0]">
              <p>Difficulty</p>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={`bg-[#2022299a] text-white border border-[#57535a] rounded-xl px-4 py-2 outline-none cursor-pointer ${checked && !difficulty ? "border border-red-700 rounded-xl" : ""}`}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="bg-[#2022299a] p-2 rounded-2xl border border-[#474747c0]">
              <p>Side Notes</p>
              <input
                type="text"
                placeholder="Side Notes..."
                className="border"
                value={sideNotes}
                onChange={(e) => setSideNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Build Notes */}
          <div>
            <p>Additional Details {"(Optional)"}</p>
            <textarea
              name="notes"
              id="notes"
              placeholder="Describe this build..."
              className="border border-[#97979779] w-full rounded-md pt-2 pl-2 resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* preview container */}
        <div className="flex flex-col gap-5 p-3 border border-[#faaf2d93] rounded-2xl bg-[#1313139c]">
          <div>
            <div className="flex">
              <HugeiconsIcon icon={ViewIcon} />
              <p>Preview</p>
            </div>
            <div
              className={`bg-[#1313139c] border border-[#777777af] -z-1 rounded-xl ${checked && !iconImage ? "border-[#ff0000af]" : ""}`}
            >
              <ImageDropZone
                iconImage={iconImage}
                setIconImage={setIconImage}
              />
            </div>
          </div>
          <div>
            {/* gunparts preview here */}
            <div className="border p-3 h-40 rounded-xl bg-[#1313139c] border-[#777777af] -z-1">
              <h1>{gunName ? gunName : "Gun Name"}</h1>
              <p className="">
                {buildType ? `${buildType} build` : "Build Type"}
              </p>

              <div className="flex flex-wrap gap-2 justify-evenly">
                {Object.entries(attachments)
                  .filter(([field, value]) => value.trim() !== "")
                  .map(([field, value]) => (
                    <div key={value}>
                      <div className="border w-fit z-10 h-18 shadow-[inset_0px_0px_5px_3px_#57535a65] shrink-0 rounded-xl p-1 overflow-hidden aspect-square">
                        <LazyAttachmentImage
                          field={field}
                          value={value}
                          className="aspect-square object-cover"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              Add Gun/Build
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddGun;
