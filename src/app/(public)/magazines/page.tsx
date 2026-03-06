import MagazinesClient from "./MagazinesClient";
import { getCachedAllMagazines } from "@/lib/cached-queries";

export default async function MagazinesPage() {
  const magazines = await getCachedAllMagazines();
  return <MagazinesClient initialMagazines={magazines} />;
}
