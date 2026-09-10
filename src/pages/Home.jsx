import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TheScent from '../components/TheScent'
import ScentVideo from '../components/ScentVideo'
import PerfumeBoutique from '../components/PerfumeBoutique'
import BottleDropCollection from '../components/BottleDropCollection'
import Gallery from '../components/Gallery'
import FindYours from '../components/FindYours'
import Footer from '../components/Footer'
import TheRituals from '../components/TheRituals'
import Products from '../components/Products'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheScent />
        <ScentVideo />
        <PerfumeBoutique />
        <Products />
        <BottleDropCollection />
        <TheRituals />
        <Gallery />
        <FindYours />
      </main>
      <Footer />
    </>
  )
}
