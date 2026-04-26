import type { VideoSource } from "@/data/prefecture-animations";

export function getYoutubeId(source: VideoSource): string | null {
  if (source.kind === "youtube") return source.videoId;
  return null;
}
