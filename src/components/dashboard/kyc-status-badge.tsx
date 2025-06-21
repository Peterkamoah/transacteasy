import { Badge } from "@/components/ui/badge"
import type { KycStatus } from "@/lib/types"

type KycStatusBadgeProps = {
  status: KycStatus
}

export const KycStatusBadge = ({ status }: KycStatusBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case 'verified':
        return 'success'
      case 'rejected':
        return 'destructive'
      case 'pending':
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
