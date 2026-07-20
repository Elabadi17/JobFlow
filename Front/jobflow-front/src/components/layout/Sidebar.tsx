import { Link } from "react-router-dom";

export default function Sidebar() {
return (
<div className="sidebar">

<h2>JobFlow</h2>

<Link to="/dashboard">Dashboard</Link>
<Link to="/applications">Applications</Link>
<Link to="/companies">Companies</Link>
<Link to="/cv">CV</Link>

</div>
);
}