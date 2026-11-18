import { upload } from "@imagekit/react";

export const uploadToImageKit = async (file, folder) => {
  // Request temporary authentication from our Express server
  const authResponse = await fetch(
    `${import.meta.env.VITE_API_URL}/api/imagekit/auth`,
  );

  if (!authResponse.ok) {
    throw new Error("Could not authenticate with ImageKit.");
  }

  const auth = await authResponse.json();

  // Upload the selected image
  const response = await upload({
    ...auth,
    file,
    fileName: file.name,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: response.url,
    fileId: response.fileId,
  };
};

export const deleteFromImageKit = async (fileId) => {
  if (!fileId) return;

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/imagekit/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete old ImageKit image.");
  }

  return response.json();
};

export default uploadToImageKit;
