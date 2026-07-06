import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// Kit design tokens + global styles, imported here explicitly: the production
// tree-shaker drops the kit's own side-effect style imports when the kit is
// consumed from source via the vite alias (dev mode is unaffected).
import '../../New-UIKit/src/styles/tokens.scss'
import '../../New-UIKit/src/styles/globals.css'
import './index.css'
import ODIMatrix from './ODIMatrix.tsx'
import MarketPage from './MarketPage.tsx'
import { GlossaryProvider } from './Glossary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GlossaryProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/odi-matrix" replace />} />
          <Route path="/odi-matrix" element={<ODIMatrix />} />
          <Route path="/market-page" element={<MarketPage />} />
        </Routes>
      </GlossaryProvider>
    </BrowserRouter>
  </StrictMode>,
)
