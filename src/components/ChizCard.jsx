import React from "react";
import GunList from "./GunList";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import { HugeiconsIcon } from "@hugeicons/react";
import { ref, runTransaction } from "firebase/database";
import { useNavigate } from "react-router-dom";

const ChizCard = ({ guns, setGunData }) => {
  const navigate = useNavigate();
  const filteredGuns = guns.filter((gun) => {
    return gun.chizFave >= 1 && gun.chizFave <= 4;
  });

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

  const handleOpenGunsmith = (gun) => {
    setGunData(gun);
    navigate(`/attachments/${encodeURIComponent(gun.gunName)}`);
    handleViewBuild();
    console.log(gun.gunName);
  };

  return (
    <div
      className="border border-[#ffffff33] w-fit h-fit rounded-2xl p-2
                    max-lg:"
    >
      <div className="">
        <p className="font-bold text-xl max-2xl:text-lg">🔥 Chiz's Fave Guns</p>
      </div>

      <div className="flex flex-col gap-1 max-[672px]:flex-row max-[672px]:flex-wrap">
        {filteredGuns
          .sort((a, b) => Number(a.chizFave) - Number(b.chizFave))
          .map((gun) => (
            <div
              key={gun.id}
              className="flex justify-between min-w-65 items-center flex-1 cursor-pointer"
              onClick={() => handleOpenGunsmith(gun)}
            >
              <div key={gun.id} className="flex gap-5 flex-1">
                <div className="w-24 h-16 bg-[#00000028] rounded-2xl">
                  <img
                    src={gun.iconURL}
                    alt=""
                    className="object-contain h-full w-full scale-160"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h2 className="font-bold">{gun.gunName}</h2>
                  <p className="">{gun.priority} Build</p>
                </div>
              </div>

              <div className="ml-1">
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 mb-2" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChizCard;
