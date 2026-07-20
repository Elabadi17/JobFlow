import { Routes, Route } from "react-router-dom";



import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./components/layout/MainLayout";
import Applications from "./pages/Applications";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import CVPage from "./pages/CVPage";

export default function App() {
return (
<Routes>

{/* AUTH */}
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />

{/* APP WITH LAYOUT */}
<Route element={<MainLayout />}>

<Route path="/dashboard" element={<Dashboard />} />
<Route path="/applications" element={<Applications />} />
<Route path="/companies" element={<Companies />} />
<Route path="/cv" element={<CVPage />} />

</Route>

</Routes>
);
}