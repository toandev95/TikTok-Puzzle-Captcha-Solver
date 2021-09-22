const _ = require("lodash");
const cv = require("opencv4nodejs-prebuilt");

const puzzle = (filePath) => {
  const contours = cv
    .imread(filePath)
    .cvtColor(cv.COLOR_BGR2GRAY)
    .gaussianBlur(new cv.Size(3, 3), 0)
    .canny(600, 250)
    .findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  const imgContours = [];

  _(contours)
    .sort((c0, c1) => c1.area - c0.area)
    .forEach((contour) => {
      const rotatedRect = contour.minAreaRect();

      const rectHeight = Math.ceil(rotatedRect.size.height);
      const rectWidth = Math.ceil(rotatedRect.size.width);

      const rectCount = rectWidth - rectHeight;

      if (rectCount >= -5 || rectCount < 0) {
        imgContours.push({
          contour: contour.getPoints(),
          center: rotatedRect.center,
        });
      }
    });

  return imgContours;
};

module.exports = { puzzle };
