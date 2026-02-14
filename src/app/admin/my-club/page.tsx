import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import EditClubForm from "@/components/admin/clubs/EditClubForm";

/**
 * 代表者(OWNER)用：自分のクラブのみ編集。管理者はこのページをメニューに持たない。
 */
export default async function MyClubPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/manager/login");

  const club = await prisma.club.findFirst({
    where: { ownerId: user.id },
  });

  if (!club) {
    return (
      <div className="max-w-6xl mx-auto font-sans">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <p className="text-amber-800 font-medium">クラブが登録されていません。</p>
          <p className="text-amber-600 text-sm mt-2">お問い合わせください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <EditClubForm initialData={club} canEditSlug={false} />
    </div>
  );
}
