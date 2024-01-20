import LandingPage from "@/components/screens/LandingPage"
import Borrow from "@/components/screens/borrow/Borrow"
import NavBar from "@/components/ui/NavBar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import DashboardLayout from "./components/screens/dashboard/Layout"

function App() {

    return (
        <div className="bg-zinc-900 h-screen">
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Router>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/borrow" element={<Borrow />} />
                        <Route path="/borrow/stake" element={<Borrow />} />
                        <Route path="/dashboard" element={<DashboardLayout />} />
                        <Route path="/dashboard/repay" element={<DashboardLayout repayLoan={true} />} />
                    </Routes>
                </Router>
                <Toaster />
            </ThemeProvider>
        </div>
    )
}

export default App
