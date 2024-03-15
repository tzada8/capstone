import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import "./styles/buttons.css";
import "./styles/pages.css";
import "./styles/text.css";

import { routes } from "./routes/Routes";
import Comparisons from "./pages/comparisons/Comparisons";
import Home from "./pages/home/Home";
import ProductSearch from "./pages/product-search/ProductSearch";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";

import HowItWorks from "./pages/home/how-it-works/HowItWorks";
import DataPipeline from "./pages/home/data-pipeline/DataPipeline";

function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
          <Routes>
            <Route path={routes.home} element={<Home />} />
            <Route path={routes.data_pipeline} element={<DataPipeline />} />
            <Route path={routes.how_it_works} element={<HowItWorks />} />
            <Route path={routes.productSearch} element={<ProductSearch />} />
            <Route path={routes.comparisons} element={<Comparisons />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
