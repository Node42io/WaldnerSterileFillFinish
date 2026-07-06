import { useNavigate, useLocation } from 'react-router-dom'
import { GridFour, Storefront } from '@phosphor-icons/react'
import { SidebarItem } from '@node42/ui-kit'

// Shared navigation for the ODI-waldner app. Only two pages live here — the ODI
// Matrix and a specific Market Page — so the sidebar is just those two items,
// with the active one derived from the current route.
export function ReportSidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <>
      <SidebarItem
        label="ODI Matrix"
        icon={<GridFour size={16} weight="regular" />}
        selected={pathname === '/odi-matrix'}
        onClick={() => navigate('/odi-matrix')}
      />
      <SidebarItem
        label="Market Page"
        icon={<Storefront size={16} weight="regular" />}
        selected={pathname === '/market-page'}
        onClick={() => navigate('/market-page')}
      />
    </>
  )
}

export default ReportSidebar
