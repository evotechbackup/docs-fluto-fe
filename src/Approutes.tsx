import { Route, Routes } from "react-router-dom";
import Layout from "./components/pages/layout/Layout";
import FaqsPages from "./components/pages/faqs/FaqsPages";
import ApiReference from "./components/pages/apiref/ApiReference";
import DocumentMainPage from "./components/pages/docs/DocumentMainPage";

function Approutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DocumentMainPage />} />
        <Route path="/faqs" element={<FaqsPages />} />
        <Route path="/api-reference" element={<ApiReference />} />
      </Route>
    </Routes>
  );
}

export default Approutes;
