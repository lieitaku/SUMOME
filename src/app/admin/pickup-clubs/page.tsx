import { getHomePickupClubs } from "@/lib/actions/pickup-clubs";
import { prisma } from "@/lib/db";
import PickupClubsSettingsCard from "@/components/admin/pickup-clubs/PickupClubsSettingsCard";
import type { SlotItem } from "@/components/admin/pickup-clubs/PickupClubsSettingsCard";

export default async function AdminPickupClubsPage() {
  const result = await getHomePickupClubs();
  const slots: SlotItem[] =
    result.data ??
    [
      { sortOrder: 0, clubId: null, club: null },
      { sortOrder: 1, clubId: null, club: null },
      { sortOrder: 2, clubId: null, club: null },
    ];

  const clubOptions = await prisma.club.findMany({
    where: { slug: { not: "official-hq" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (result.error) {
    return (
      <div className="max-w-6xl mx-auto font-sans">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
          {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          注目の相撲クラブ編集
        </h1>
        <p className="text-gray-500 mt-1 text-xs md:text-sm">
          トップページの「Pick Up Clubs」に表示する3つのクラブを選びます。左・中央・右の順で表示されます。
        </p>
      </div>

      <PickupClubsSettingsCard initialSlots={slots} clubOptions={clubOptions} />
    </div>
  );
}
