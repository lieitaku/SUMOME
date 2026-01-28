import MagazineForm from "@/components/admin/magazines/MagazineForm";

export default function NewMagazinePage() {
    // 新建页面不需要获取初始数据
    return <MagazineForm isNew={true} />;
}