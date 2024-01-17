import NavBar from "@/components/ui/NavBar"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import LandingPage from "@/components/screens/LandingPage"
import Borrow from "@/components/screens/borrow/Borrow"
import DashboardLayout from "./components/screens/dashboard/Layout"

function App() {

    return (
        <div className="bg-zinc-900 h-screen">
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/borrow" element={<Borrow />} />
                    <Route path="/dashboard" element={<DashboardLayout />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
