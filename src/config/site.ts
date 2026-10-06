export interface ScreenItem {
  id: string;
  label: string;
  caption: string;
  src: string;
  alt: string;
  glowColor?: string;
}

export const APK_URL = "https://github.com/ragiib/falcon_player/releases/download/v1.0.0/falcon_player.apk";
export const REPO_URL = "https://github.com/ragiib/falcon_player";
export const RELEASES_URL = "https://github.com/ragiib/falcon_player/releases";
export const VERSION = "1.0.0";
export const APK_SIZE_MB = "24.2";
export const MIN_ANDROID = "7.0 (API 24)";
export const SITE_NAME = "Falcon Player";
export const SITE_TITLE = "Falcon Player — Ad-Free 4K Video & Audio Player for Android";
export const SITE_DESCRIPTION = "A fast, ad-free Android player for 4K video and your whole music library. Everything plays directly from your device, with zero telemetry and nothing in the way.";

export const SCREENS: ScreenItem[] = [
  {
    id: "player",
    label: "Player",
    caption: "Fast seeking, speed control and subtitles over your video.",
    src: "/screens/player.webp",
    alt: "Falcon Player playback interface showing video playback with playback timeline, speed adjustments, and subtitle overlay controls.",
    glowColor: "rgba(229, 15, 30, 0.35)", // brand red glow
  },
  {
    id: "tracks",
    label: "Tracks",
    caption: "Switch audio tracks and subtitles in one sheet.",
    src: "/screens/tracks.webp",
    alt: "Falcon Player tracks bottom sheet showing multi-language audio track selection and subtitle stream controls.",
    glowColor: "rgba(180, 20, 45, 0.32)", // deep crimson glow
  },
  {
    id: "browse",
    label: "Browse",
    caption: "Browse storage folders and favorites.",
    src: "/screens/browse.webp",
    alt: "Falcon Player file browser displaying internal storage folders, SD card directories, and bookmarked favorite folders.",
    glowColor: "rgba(235, 60, 40, 0.30)", // warm flame glow
  },
  {
    id: "audio",
    label: "Audio",
    caption: "Your music by tracks, albums, artists and genres.",
    src: "/screens/audio.webp",
    alt: "Falcon Player audio library organized into tracks, albums, artists, and music genres with instant offline playback.",
    glowColor: "rgba(210, 30, 60, 0.32)", // ruby glow
  },
  {
    id: "library",
    label: "Videos",
    caption: "Every video folder, with previews.",
    src: "/screens/library.webp",
    alt: "Falcon Player video library showcasing folders, video thumbnails, resolutions, and video count previews.",
    glowColor: "rgba(242, 20, 35, 0.35)", // vivid brand red glow
  },
];

export const FACTS = [
  { label: "No ads", detail: "Completely ad-free and tracking-free" },
  { label: "4K, large files smooth", detail: "Hardware acceleration & zero stutter" },
  { label: `${APK_SIZE_MB} MB`, detail: "Lightweight standalone installer" },
  { label: "Open source on GitHub", detail: "Transparent and independently auditable" },
];

export const INSTALL_STEPS = [
  {
    number: "01",
    title: "Download the APK",
    description: `Grab falcon_player.apk (${APK_SIZE_MB} MB) directly from our official GitHub release.`,
  },
  {
    number: "02",
    title: "Open the file",
    description: "Tap the download notification or open the file from your browser's download manager.",
  },
  {
    number: "03",
    title: "Allow this source if prompted",
    description: "If Android asks for permission to install apps from your browser or file manager, toggle 'Allow from this source'.",
  },
  {
    number: "04",
    title: "Install and play",
    description: "Tap 'Install' and launch Falcon Player. Grant local media storage permissions to start playing right away.",
  },
];
