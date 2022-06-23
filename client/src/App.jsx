import styles from './App.module.css'
import SlideRoutes from 'react-slide-routes'
import { BrowserRouter, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import Trade from './pages/Trade'
import ErrorPage from './pages/ErrorPage'

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <SlideRoutes>
                <Route exact path="/" element={<Home />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="*" element={<ErrorPage />} />
            </SlideRoutes>
            <Footer />
        </BrowserRouter>
    )
}
