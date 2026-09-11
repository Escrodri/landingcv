import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Una URL por rubro para los anuncios: /repositor, /cajero… (ver src/campanias.ts).
            Un rubro desconocido muestra la versión general: nunca perdemos tráfico pago por un typo. */}
        <Route path="/:rubro" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
