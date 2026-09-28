import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SiteLayout from './components/layout/SiteLayout'
import ContactPage from './pages/ContactPage'
import CandyShopPage from './pages/CandyShopPage'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import ProgrammingPage from './pages/ProgrammingPage'
import PurchaseProcessingPage from './pages/PurchaseProcessingPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import TicketSelectionPage from './pages/TicketSelectionPage'
import TermsPage from './pages/TermsPage'
import UpcomingReleasesPage from './pages/UpcomingReleasesPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cartelera" element={<ProgrammingPage />} />
          <Route path="/proximos-estrenos" element={<UpcomingReleasesPage />} />
          <Route path="/candy-shop" element={<CandyShopPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/peliculas/:movieId" element={<MovieDetailPage />} />
          <Route path="/funciones/:showtimeId/entradas" element={<TicketSelectionPage />} />
          <Route path="/compra/procesando" element={<PurchaseProcessingPage />} />
          <Route path="/compra/exito" element={<PurchaseSuccessPage />} />
          <Route path="/terminos-y-condiciones" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
