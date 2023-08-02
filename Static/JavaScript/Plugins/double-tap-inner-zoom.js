//  To check and keep the translate value inside the image size wrapper.
document.addEventListener("DOMContentLoaded", function () {
    const maxImgArea = (zoomImgArea, transformOffsetValue) => transformOffsetValue > zoomImgArea ? zoomImgArea : (transformOffsetValue < -zoomImgArea ? -zoomImgArea : transformOffsetValue);
    const getTouchValues = ({x, y},{clientX, clientY}) => [(clientX - x),(clientY - y)];

    var doubleTapZoomImages = document.querySelectorAll(".js-double-tap-zoom");             // Select all imgs which require zoom functionality.
    for (let zoomImage of doubleTapZoomImages) {
        let scaleImageByValue = 3;                                                          // Set the amount of zoom level.
        let zoomImgWidth = zoomImage.offsetWidth, zoomImgHeight = zoomImage.offsetHeight;   // Img height

        let zoomedImage = false, firstTouch = false;
        let prevXAxisTouch, prevYAxisTouch;                                                  // prev touch on img x & y-axis values for zoomed img movement
        let transformOffsetX, transformOffsetY;                                              // translate offset values

        zoomImage.addEventListener("touchstart", function(event) {
            if (zoomedImage) {
                ({clientX :prevXAxisTouch, clientY :prevYAxisTouch} = event.changedTouches[0]);
            }
        });

        zoomImage.addEventListener("touchmove", function(event) {
            if(zoomedImage) {
                event.preventDefault();
                zoomImage.style.transitionDuration = "0s";

                const {clientX :xAxisTouch, clientY :yAxisTouch} = event.changedTouches[0];

                transformOffsetX = maxImgArea(zoomImgWidth,transformOffsetX + xAxisTouch - prevXAxisTouch);
                transformOffsetY = maxImgArea(zoomImgHeight,transformOffsetY + yAxisTouch - prevYAxisTouch);
                zoomImage.style.transform = `translate3d( ${transformOffsetX}px, ${transformOffsetY}px, 0px) scale( ${scaleImageByValue})`;

                prevXAxisTouch = xAxisTouch;
                prevYAxisTouch = yAxisTouch;
            }
        });

        zoomImage.addEventListener("touchend", function(event) {
            if(!firstTouch) {
                firstTouch = true;
                setTimeout(function() {firstTouch = false; }, 300);
            }
            else {
                event.preventDefault();
                zoomImage.style.transitionDuration = "300ms";

                if (zoomedImage) {
                    zoomImage.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
                    zoomedImage = false;
                }
                else {
                    const [xAxisTouch, yAxisTouch] = getTouchValues(event.target.getBoundingClientRect(),event.changedTouches[0]);

                    transformOffsetX = maxImgArea(zoomImgWidth, -(xAxisTouch - zoomImgWidth/2)*scaleImageByValue);
                    transformOffsetY = maxImgArea(zoomImgHeight, -(yAxisTouch - zoomImgHeight/2)*scaleImageByValue);
                    zoomImage.style.transform = `translate3d( ${transformOffsetX}px, ${transformOffsetY}px, 0px) scale( ${scaleImageByValue})`;

                    zoomedImage = true;
                }
            }
        });
    }
});
