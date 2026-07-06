import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
