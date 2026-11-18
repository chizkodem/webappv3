const imageFiles = import.meta.glob(
  "../assets/litAttIcons/**/*.{png,jpg,jpeg,webp}",
  {
    query: "?url",
    import: "default",
  },
);

const attachmentImages = {};
const imagesByPart = {};

Object.keys(imageFiles).forEach((path) => {
  const match = path.match(
    /litAttIcons\/([^/]+)\/([^/]+)\.(png|jpg|jpeg|webp)$/i,
  );

  if (!match) return;

  const [, gunPart, gunPartName] = match;

  const partKey = gunPart.toLowerCase();
  const imageKey = `${partKey}/${gunPartName}`.toLowerCase();

  attachmentImages[imageKey] = path;

  if (!imagesByPart[partKey]) {
    imagesByPart[partKey] = [];
  }

  imagesByPart[partKey].push(path);
});

export const getAttachmentImage = async (gunPart, gunPartName) => {
  const partKey = gunPart.toLowerCase();
  const key = `${gunPart}/${gunPartName}`.toLowerCase();

  const availableImages = imagesByPart[partKey];

  // First, look for an exact match.
  let selectedPath = attachmentImages[key];

  if (!selectedPath && availableImages?.length) {
    const searchWords = gunPartName
      .toLowerCase()
      .split(/[\s-]+/)
      .filter((word) => word.length > 2);

    const matches = availableImages
      .map((path) => {
        const fileName = path
          .split("/")
          .pop()
          .replace(/\.[^.]+$/, "")
          .toLowerCase();

        const matchedWords = searchWords.filter((word) =>
          fileName.includes(word),
        ).length;

        return { path, matchedWords };
      })
      .filter((item) => item.matchedWords > 0)
      .sort((a, b) => b.matchedWords - a.matchedWords);

    selectedPath = matches[0]?.path;
  }

  // If there's still no match, choose a random image.
  if (!selectedPath) {
    if (!availableImages?.length) return null;

    selectedPath =
      availableImages[Math.floor(Math.random() * availableImages.length)];
  }

  // Import only the selected image.
  return await imageFiles[selectedPath]();
};
