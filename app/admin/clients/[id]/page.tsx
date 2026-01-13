import { ClientDetails } from "@/components/client-details"

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  return <ClientDetails clientId={params.id} />
}
