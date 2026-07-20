import "../styles/dashboard.scss";

import { useEffect, useState } from "react";
import { getApplications } from "../services/application.service";

export default function Dashboard() {

const [applications, setApplications] = useState<any[]>([]);

useEffect(() => {
load();
}, []);

async function load() {
const res = await getApplications();
setApplications(res.data.content);
}

const pending = applications.filter(a => a.status === "PENDING").length;
const accepted = applications.filter(a => a.status === "ACCEPTED").length;
const rejected = applications.filter(a => a.status === "REJECTED").length;

return (

<div className="dashboard">

{/* STATS */}
<div className="stats">

<div className="card">
<h3>Total</h3>
<p>{applications.length}</p>
</div>

<div className="card">
<h3>Pending</h3>
<p>{pending}</p>
</div>

<div className="card">
<h3>Accepted</h3>
<p>{accepted}</p>
</div>

<div className="card">
<h3>Rejected</h3>
<p>{rejected}</p>
</div>

</div>

{/* CHART */}
<div className="card">

{/*
📊 Chart widget (JobFlow status distribution)
*/}



</div>

</div>

);
}