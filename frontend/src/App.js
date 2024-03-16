import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import "./styles/buttons.css";
import "./styles/pages.css";
import "./styles/text.css";

import { routes } from "./routes/Routes";
import Comparisons from "./pages/comparisons/Comparisons";
import DataPipeline from "./pages/home/data-pipeline/DataPipeline";
import Home from "./pages/home/Home";
import HowItWorks from "./pages/home/how-it-works/HowItWorks";
import ProductSearch from "./pages/product-search/ProductSearch";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";


function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
          <Routes>
            <Route path={routes.home} element={<Home />} />
            <Route path={routes.dataPipeline} element={<DataPipeline />} />
            <Route path={routes.howItWorks} element={<HowItWorks />} />
            <Route path={routes.productSearch} element={<ProductSearch />} />
            <Route path={routes.comparisons} element={<Comparisons />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
