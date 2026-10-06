/**
 * Falcon Player - Hero Phone Interactivity
 * - Screen switcher with crossfade & slide
 * - Ambient glow color interpolation
 * - 3D spring-smoothed pointer tilt via requestAnimationFrame lerp
 * - Specular light glint tracking pointer
 * - Reduced motion respects
 */

export function initHeroPhone(): void {
  const stage = document.getElementById("phone-stage");
  const tiltWrapper = document.getElementById("phone-tilt-wrapper");
  const phoneFrame = document.getElementById("phone-frame");
  const glint = document.getElementById("specular-glint");
  const glow = document.getElementById("ambient-glow");
  const captionEl = document.getElementById("phone-caption");
  const switchBtns = Array.from(document.querySelectorAll<HTMLButtonElement>("#phone-switcher .switch-btn"));
  const screenImgs = Array.from(document.querySelectorAll<HTMLImageElement>("#screen-stack .screen-img"));

  if (!stage || !tiltWrapper || !switchBtns.length || !screenImgs.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  let currentIndex = 0;

  // Function to switch active screen
  function setScreen(targetIndex: number): void {
    if (targetIndex < 0 || targetIndex >= screenImgs.length || targetIndex === currentIndex) {
      return;
    }

    const prevIndex = currentIndex;
    currentIndex = targetIndex;

    // Update switcher buttons
    switchBtns.forEach((btn, idx) => {
      const isActive = idx === targetIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // Update screen images
    screenImgs.forEach((img, idx) => {
      img.classList.remove("was-previous");
      if (idx === targetIndex) {
        img.classList.add("is-active");
      } else if (idx === prevIndex) {
        img.classList.remove("is-active");
        img.classList.add("was-previous");
      } else {
        img.classList.remove("is-active");
      }
    });

    // Update live caption
    const activeImg = screenImgs[targetIndex];
    if (captionEl && activeImg) {
      const captionText = activeImg.getAttribute("data-caption") || "";
      captionEl.textContent = captionText;
    }

    // Update ambient glow color
    if (glow && activeImg) {
      const glowColor = activeImg.getAttribute("data-glow");
      if (glowColor) {
        glow.style.setProperty("--current-glow", glowColor);
      }
    }
  }

  // Bind click & keyboard navigation to switcher buttons
  switchBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => setScreen(idx));

    btn.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (idx + 1) % switchBtns.length;
        switchBtns[next].focus();
        setScreen(next);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (idx - 1 + switchBtns.length) % switchBtns.length;
        switchBtns[prev].focus();
        setScreen(prev);
      }
    });
  });

  // -------------------------------------------------------------
  // 3D Tilt with rAF spring smoothing & Specular Glint
  // Only for desktop fine pointer and when reduced motion is off
  // -------------------------------------------------------------
  if (isFinePointer && !prefersReducedMotion && phoneFrame) {
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    let targetGlintX = 50;
    let targetGlintY = 50;
    let currentGlintX = 50;
    let currentGlintY = 50;
    let targetGlintOpacity = 0;
    let currentGlintOpacity = 0;

    let isHovering = false;
    let rafId: number | null = null;

    const MAX_TILT_X = 5; // deg
    const MAX_TILT_Y = 7; // deg
    const LERP_FACTOR = 0.085; // smooth spring feel

    function updateTilt(): void {
      currentRotX += (targetRotX - currentRotX) * LERP_FACTOR;
      currentRotY += (targetRotY - currentRotY) * LERP_FACTOR;

      currentGlintX += (targetGlintX - currentGlintX) * LERP_FACTOR;
      currentGlintY += (targetGlintY - currentGlintY) * LERP_FACTOR;
      currentGlintOpacity += (targetGlintOpacity - currentGlintOpacity) * LERP_FACTOR;

      tiltWrapper.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(3)}deg) rotateY(${currentRotY.toFixed(3)}deg)`;

      if (glint) {
        glint.style.setProperty("--glint-x", `${currentGlintX.toFixed(1)}%`);
        glint.style.setProperty("--glint-y", `${currentGlintY.toFixed(1)}%`);
        glint.style.setProperty("--glint-opacity", currentGlintOpacity.toFixed(3));
      }

      // Check if we should keep animating
      const deltaX = Math.abs(targetRotX - currentRotX);
      const deltaY = Math.abs(targetRotY - currentRotY);
      const deltaGlint = Math.abs(targetGlintOpacity - currentGlintOpacity);

      if (isHovering || deltaX > 0.005 || deltaY > 0.005 || deltaGlint > 0.005) {
        rafId = requestAnimationFrame(updateTilt);
      } else {
        rafId = null;
        tiltWrapper.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        if (glint) glint.style.setProperty("--glint-opacity", "0");
      }
    }

    function startRaf(): void {
      if (!rafId) {
        rafId = requestAnimationFrame(updateTilt);
      }
    }

    // Pointer move over stage
    stage.addEventListener("pointermove", (e: PointerEvent) => {
      isHovering = true;
      const rect = phoneFrame.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from center [-1, 1]
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

      targetRotY = normX * MAX_TILT_Y;
      targetRotX = -normY * MAX_TILT_X;

      // Glint follows pointer coordinates
      const glintX = ((e.clientX - rect.left) / rect.width) * 100;
      const glintY = ((e.clientY - rect.top) / rect.height) * 100;
      targetGlintX = Math.max(0, Math.min(100, glintX));
      targetGlintY = Math.max(0, Math.min(100, glintY));
      targetGlintOpacity = 1;

      startRaf();
    });

    stage.addEventListener("pointerleave", () => {
      isHovering = false;
      targetRotX = 0;
      targetRotY = 0;
      targetGlintOpacity = 0;
      startRaf();
    });
  }
}
