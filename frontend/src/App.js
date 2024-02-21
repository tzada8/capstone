import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import { routes } from "./routes/Routes";
import Comparisons from "./pages/comparisons/Comparisons";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import ProductSearch from "./pages/product-search/ProductSearch";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.productSearch} element={<ProductSearch />} />
          <Route path={routes.comparisons} element={<Comparisons />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
