import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DailyChecklistPage from "./pages/DailyChecklistPage.jsx";
import MedicineInteractionPage from "./pages/MedicineInteractionPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import SafetyGuidePage from "./pages/SafetyGuidePage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<UploadPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/medicine-interaction"
            element={<MedicineInteractionPage />}
          />
          <Route
            path="/daily-checklist/:medicineId"
            element={<DailyChecklistPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/safety-guide" element={<SafetyGuidePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}