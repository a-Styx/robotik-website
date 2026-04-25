// Unified robot model controller
// Configuration is read from data attributes on the model-viewer element

(function() {
  // Add a state variable to track animation status
  let animationState = "idle"; // "idle", "playing-part1", "paused-at-end"
  let savedTime = 0;
  let wasPlaying = false;
  const viewer = document.getElementById("model");
  const button = document.getElementById("playBtn");
  const stopButton = document.getElementById("stopBtn");
  let animationTimeout;

  // Get model configuration from data attributes
  const defaultModel = viewer.dataset.defaultModel || "Robo.glb";
  const pinsModel = viewer.dataset.pinsModel || "RoboPins.glb";

  viewer.addEventListener("load", () => {
    console.log("Available animations:", viewer.availableAnimations);
    viewer.loop = false;
    
    // Restore animation state if switching models
    if (savedTime > 0) {
      viewer.currentTime = savedTime;
      if (wasPlaying) {
        viewer.play();
      }
      savedTime = 0;
      wasPlaying = false;
    }
  });

  // Play Part 1 (0-2958ms)
  button.addEventListener("click", () => {
    if (!viewer.animationName) return;
    
    // Only play part 1 if animation is idle (not playing or paused in middle)
    if (animationState === "playing-part1" || animationState === "paused-at-end" || animationState === "playing-part2") return;
    
    if (animationTimeout) clearTimeout(animationTimeout);
    
    animationState = "playing-part1";
    viewer.currentTime = 0;
    viewer.play();
    
    // Pause at end of part 1
    animationTimeout = setTimeout(() => {
      viewer.pause();
      animationState = "paused-at-end";
    }, 2958);
  });

  // Play Part 2 (3000-5958ms) - only if part 1 just finished
  stopButton.addEventListener("click", () => {
    if (!viewer.animationName) return;
    
    // Only allow part 2 if we just finished part 1
    if (animationState !== "paused-at-end") return;
    
    if (animationTimeout) clearTimeout(animationTimeout);
    
    animationState = "playing-part2";
    viewer.currentTime = 3000;
    viewer.play();
    
    // Play for 2958ms (3000 to 5958)
    animationTimeout = setTimeout(() => {
      viewer.pause();
      animationState = "idle";
    }, 2958);
  });

  document.getElementById("onBtn").addEventListener("click", () => {
    // Save current animation state before switching
    savedTime = viewer.currentTime;
    wasPlaying = (animationState === "playing-part1" || animationState === "playing-part2");
    viewer.src = pinsModel;
  });

  document.getElementById("offBtn").addEventListener("click", () => {
    // Save current animation state before switching
    savedTime = viewer.currentTime;
    wasPlaying = (animationState === "playing-part1" || animationState === "playing-part2");
    viewer.src = defaultModel;
  });

  viewer.addEventListener("animation-finished", () => {
    viewer.pause();
    if (animationTimeout) clearTimeout(animationTimeout);
  });
})();