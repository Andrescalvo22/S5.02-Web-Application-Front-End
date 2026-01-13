import { RepairDetailsAdmin } from "@/components/repair-details-admin";

export default async function RepairDetailsAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RepairDetailsAdmin repairId={id} />;
}
