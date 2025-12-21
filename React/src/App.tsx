import "./App.css";
import { BrowserRouter } from "react-router-dom";

import Header from "./global/components/header/Header";
import Footer from "./pages/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;