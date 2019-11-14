function setupView(dragon) {
  let spotArray = [];
  let transition;
  let myDragon = dragon;
  let initialized = new Date().getTime();
  let doSteps = new Date().getTime() + 180000;
  let interval;
  let intervalSet = false;
  console.log("And, here... we.... go!", myDragon.viewport);

  // Calling this function will move us to the next transition animation in our
  // list of transitions.
  var animate = function() {
    let ratio = myDragon.viewport.viewer.viewport._contentSize.y / myDragon.viewport.viewer.viewport._contentSize.x;
    let width, height;
    let zoomLevel;
    if (spotArray.length % 2) {
      //console.log("Zoom out");
      zoomLevel = (Math.random() * 2 + 4) / 100;
    } else {
      //console.log("Zoom in");
      zoomLevel = (Math.random() * 2 + 1) / 100;
    }
    let spot = {
      x: (Math.random() * 80) / 100 + 0.1,
      y: Math.random() * (ratio - zoomLevel),
      w: zoomLevel,
      h: zoomLevel
    };
    let box = new OpenSeadragon.Rect(spot.x, spot.y, spot.w, spot.h);
    transition = function() {
      myDragon.viewport.zoomSpring.animationTime = 5;
      myDragon.viewport.zoomSpring.springStiffness = 10;
      myDragon.viewport.centerSpringX.animationTime = 10;
      myDragon.viewport.centerSpringX.springStiffness = 10;
      myDragon.viewport.centerSpringY.animationTime = 10;
      myDragon.viewport.centerSpringY.springStiffness = 10;
      myDragon.viewport.zoomSpring.exponential = true;
      myDragon.viewport.centerSpringX.exponential = false;
      myDragon.viewport.centerSpringY.exponential = false;
      myDragon.viewport.fitBounds(box);
      updateCoordinatesInURL();
    };
    transition();
    spotArray.push(spot);
  };

  // setTimeout to check idle status.
  // it continues indefinitely.
  setTimeout(checkIdleStatus, 1000);
  myDragon.addHandler("canvas-click", function() {
    myDragon.viewport.zoomSpring.animationTime = 1.2;
    myDragon.viewport.zoomSpring.springStiffness = 6.5;
    myDragon.viewport.centerSpringX.animationTime = 1.2;
    myDragon.viewport.centerSpringX.springStiffness = 6.5;
    myDragon.viewport.centerSpringY.animationTime = 1.2;
    myDragon.viewport.centerSpringY.springStiffness = 6.5;
    myDragon.viewport.zoomSpring.exponential = undefined;
    myDragon.viewport.centerSpringX.exponential = undefined;
    myDragon.viewport.centerSpringY.exponential = undefined;
    initialized = new Date().getTime();
    doSteps = new Date().getTime() + 180000;
    clearInterval(interval);
    intervalSet = false;
    setTimeout(checkIdleStatus, 1000);
  });

  function checkIdleStatus() {
    // Checking time
    if (doSteps < initialized && intervalSet === false) {
      intervalSet = true;
      //Time to start
      animate();
      interval = setInterval(() => {
        animate();
      }, 10000);
    } else {
      setTimeout(checkIdleStatus, 1000);
    }
    initialized = new Date().getTime();
  }
}

function updateCoordinatesInURL() {
  var viewportBounds = myDragon.viewport.getBounds();
  // var tiledImage = myDragon.world.getItemAt(0); // Assuming you want the first (or only) image
  // var imageBounds = tiledImage.viewportToImageRectangle(viewportBounds);
  var posJSON = 'x:' + precise(viewportBounds.x) + ',y:' + precise(viewportBounds.y) +
                ',w:' + precise(viewportBounds.width) + ',h:' + precise(viewportBounds.height);

  if (window.history.replaceState) {
    newLoc = window.location.href.replace(/#.*/, "") + '#' + posJSON;
    window.history.replaceState({ }, document.title, newLoc);
  }
}