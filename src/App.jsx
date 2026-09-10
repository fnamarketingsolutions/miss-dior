import { Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import Home from './pages/Home'
import Contact from './pages/Contact'

export default function App() {
  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </SmoothScroll>
  )
}
