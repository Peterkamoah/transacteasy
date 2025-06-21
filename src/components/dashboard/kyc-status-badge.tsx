import { Badge } from "@/components/ui/badge"
import type { KycStatus, InvoiceStatus } from "@/lib/types"

type KycStatusBadgeProps = {
  status: KycStatus | InvoiceStatus;
}

export const KycStatusBadge = ({ status }: KycStatusBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case 'verified':
      case 'paid':
        return 'success'
      case 'rejected':
      case 'overdue':
        return 'destructive'
      case 'unpaid':
        return 'outline';
      case 'pending':
      case 'cancelled':
      default:
        return 'secondary'
    }
  }

  return (
    <Badge variant={getVariant()} className="capitalize">
      {status}
    </Badge>
  )
}
