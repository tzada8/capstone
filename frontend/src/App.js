import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/home/Home";
import ProductSearch from "./pages/product-search/ProductSearch";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-search" element={<ProductSearch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
