/**
 * Falcon Player - Download Flow Interactivity
 * - Fresh throwaway-anchor download on every click (prevents browser duplicate-navigation block)
 * - Temporary "Download started" feedback on all download buttons
 * - visibilitychange reset so cancelled downloads never leave button stuck
 * - "started" document state for highlighting install steps
 * - Timed smooth-scroll to #download section
 * - Android vs Desktop device detection for QR disclosure
 * - Copy website link to clipboard
 */

export function initDownloadFlow(): void {
  const downloadButtons = document.querySelectorAll<HTMLAnchorElement>("[data-download-btn]");
  const qrContainers = document.querySelectorAll<HTMLElement>("[data-qr-disclosure]");
  const copyBtn = document.getElementById("qr-copy-btn");
  const copyBtnText = document.getElementById("copy-btn-text");

  // Device detection: Check if device is Android
  const userAgent = navigator.userAgent || "";
  const isAndroid = /android/i.test(userAgent);

  qrContainers.forEach((container) => {
    if (isAndroid) {
      container.style.display = "none";
    } else {
      container.style.display = "inline-block";
    }
  });

  // Handle Download APK clicks
  // -------------------------------------------------------------------
  // Root cause of the bug: after a browser download-warning is cancelled,
  // the browser marks that exact <a> element's href as "already navigated"
  // and silently ignores subsequent clicks on the same element.
  //
  // Fix: preventDefault on every click, then fire a FRESH programmatic
  // navigation through a brand-new, immediately-discarded <a> element.
  // The browser never sees the same element twice, so its guard never fires.
  // -------------------------------------------------------------------

  let resetTimer: number | null = null;
  let isDownloading = false;

  /** Revert all button labels and clear downloading state. */
  function resetDownloadState(): void {
    isDownloading = false;
    document.documentElement.removeAttribute("data-download-status");
    downloadButtons.forEach((button) => {
      const original = button.getAttribute("data-original-text");
      const labelEl =
        button.querySelector<HTMLElement>(".btn-label") ||
        button.querySelector<HTMLElement>("span");
      if (labelEl && original) {
        labelEl.textContent = original;
      }
      button.removeAttribute("aria-disabled");
    });
  }

  /** Fire a fresh navigation to `url` using a throwaway anchor so the
   *  browser treats every download click as a completely new request. */
  function triggerFreshDownload(url: string): void {
    const tempAnchor = document.createElement("a");
    tempAnchor.href = url;
    // Let the browser handle .apk as a download (no download attribute
    // needed; GitHub serves the correct Content-Disposition header).
    tempAnchor.style.display = "none";
    document.body.appendChild(tempAnchor);
    tempAnchor.click();
    // Remove immediately — we never reuse this element.
    document.body.removeChild(tempAnchor);
  }

  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Always prevent default so we control the navigation ourselves.
      e.preventDefault();

      const apkUrl = btn.getAttribute("href") || "";
      if (!apkUrl) return;

      // Stash original label text on first click.
      if (!btn.hasAttribute("data-original-text")) {
        const labelEl =
          btn.querySelector<HTMLElement>(".btn-label") ||
          btn.querySelector<HTMLElement>("span");
        btn.setAttribute("data-original-text", labelEl?.textContent || "");
      }

      // Fire the download immediately via a throwaway anchor.
      triggerFreshDownload(apkUrl);

      // Mark downloading state on the document.
      isDownloading = true;
      document.documentElement.setAttribute("data-download-status", "started");

      // Update all button labels.
      downloadButtons.forEach((button) => {
        const labelEl =
          button.querySelector<HTMLElement>(".btn-label") ||
          button.querySelector<HTMLElement>("span");
        if (labelEl) {
          if (!button.hasAttribute("data-original-text")) {
            button.setAttribute(
              "data-original-text",
              labelEl.textContent || ""
            );
          }
          labelEl.textContent = "Download started";
        }
      });

      // Clear any existing reset timer.
      if (resetTimer !== null) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }

      // Auto-reset after 6 seconds (covers normal download acceptance).
      resetTimer = window.setTimeout(() => {
        resetTimer = null;
        resetDownloadState();
      }, 6000);

      // Smooth-scroll to #download section ~900 ms after click.
      window.setTimeout(() => {
        const downloadSec = document.getElementById("download");
        if (downloadSec) {
          const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          downloadSec.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
            block: "start",
          });
        }
      }, 900);
    });
  });

  // visibilitychange fires when the user returns to the tab after
  // dismissing the browser's download-warning dialog (cancel or accept).
  // Reset immediately so the button is never permanently stuck.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && isDownloading) {
      // Give the browser a tick to settle, then reset.
      window.setTimeout(() => resetDownloadState(), 150);
      if (resetTimer !== null) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
    }
  });

  // Copy link functionality
  if (copyBtn && copyBtnText) {
    copyBtn.addEventListener("click", async () => {
      const urlToCopy = window.location.href;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(urlToCopy);
        } else {
          // Clipboard API not available (very old browser / non-secure context)
          console.error("Clipboard API unavailable");
          return;
        }

        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = "Copied!";
        copyBtn.style.color = "var(--color-brand)";

        setTimeout(() => {
          copyBtnText.textContent = originalText;
          copyBtn.style.color = "";
        }, 2000);
      } catch (err) {
        console.error("Could not copy link: ", err);
      }
    });
  }
}
