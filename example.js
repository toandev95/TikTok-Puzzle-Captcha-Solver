const { join } = require("path");
const Jimp = require("jimp");
const fs = require("fs");
const { puzzle } = require("./main");

(async () => {
  // sample.1.png
  // sample.2.png
  // sample.3.png
  // sample.4.png
  // sample.5.png
  // sample.6.png
  const originalImg = await Jimp.read("sample.1.png");

  const jimpPath = join(__dirname, "images", "sample.1.png");

  const originalSize = {
    width: originalImg.bitmap.width,
    height: originalImg.bitmap.height,
  };

  // Resize image to 300px
  const saveImg = await originalImg
    .clone()
    .resize(originalSize.width + 6, originalSize.height + 6)
    .crop(6 / 2, 6 / 2, originalSize.width, originalSize.height)
    .crop(140, 0, originalSize.width - 140, originalSize.height)
    .resize(300, Jimp.AUTO)
    .writeAsync(jimpPath);

  // Find puzzle
  const imgContours = puzzle(jimpPath);

  fs.unlinkSync(jimpPath);

  if (imgContours.length > 0) {
    // Calc position
    const puzzleX = imgContours[0].center.x;
    const puzzleY = imgContours[0].center.y;

    const originalX = Math.round(
      puzzleX * ((originalSize.width - 140) / saveImg.bitmap.width)
    );
    const originalY = Math.round(
      puzzleY * (originalSize.height / saveImg.bitmap.height)
    );
    const x = originalX + 140;
    const y = originalY;

    // Result to x,y of origin image
    console.log({ x, y });
  }
})();
