import React from "react";
import AdminRouteLoadingShell from "@/components/admin/AdminRouteLoadingShell";
import AdminMagazineStyleLoading from "@/components/admin/AdminMagazineStyleLoading";

export default function AdminClubEditLoading() {
  return (
    <AdminRouteLoadingShell>
      <AdminMagazineStyleLoading />
    </AdminRouteLoadingShell>
  );
}
