import { BrowserRouter, Routes, Route } from "react-router";
import Header from "./src/Header.jsx";
import App from "./src/App.jsx";
import AddUser from "./src/AddUser.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
