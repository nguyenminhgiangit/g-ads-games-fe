import { sys } from "cc";

export function detectPlatform(): "web" | "ios" | "android" | "other" {
  if (sys.isBrowser) return "web";
  if (sys.os === sys.OS.IOS) return "ios";
  if (sys.os === sys.OS.ANDROID) return "android";
  return "other";
}