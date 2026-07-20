import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "../../styles/layout.scss";

export default function MainLayout() {
return (
<div className="layout">

<Sidebar />

<div className="main">

<Navbar />

<div className="content">
<Outlet />
</div>

</div>

</div>
);
}