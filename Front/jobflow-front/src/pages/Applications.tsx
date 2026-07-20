import { useEffect, useState } from "react";

import {
getApplications,
updateStatus,
deleteApplication,
createApplication
} from "../services/application.service";

import { getCompanies } from "../services/company.service";
import { getCVs } from "../services/cv.service";

import Modal from "../components/modal/Modal";

import "../styles/table.scss";

export default function Applications() {

const [data, setData] = useState<any[]>([]);
const [page, setPage] = useState(0);

/* MODAL */
const [open, setOpen] = useState(false);

/* FORM */
const [position, setPosition] = useState("");
const [notes, setNotes] = useState("");
const [salaryMin, setSalaryMin] = useState<number>(0);
const [salaryMax, setSalaryMax] = useState<number>(0);

const [companyId, setCompanyId] = useState("");
const [cvId, setCvId] = useState("");

/* DATA SELECTS */
const [companies, setCompanies] = useState<any[]>([]);
const [cvs, setCvs] = useState<any[]>([]);

useEffect(() => {
load();
loadSelects();
}, [page]);

async function load() {
const res = await getApplications(page, 10);
setData(res.data.content);
}

async function loadSelects() {
const c = await getCompanies();
const v = await getCVs();

setCompanies(c.data.content);
setCvs(v.data);
}

async function changeStatus(id: string, status: string) {
await updateStatus(id, status);
load();
}

async function remove(id: string) {
await deleteApplication(id);
load();
}

async function create() {
await createApplication( {
position,
notes,
salaryMin,
salaryMax,
companyId,
cvId
});

setOpen(false);

setPosition("");
setNotes("");
setSalaryMin(0);
setSalaryMax(0);

load();

}

return (

<div className="table">

<h1>Applications</h1>

{/* BUTTON OPEN MODAL */}
<button className="create-btn" onClick={() => setOpen(true)}>
+ New Application
</button>

{/* TABLE */}
<table>

<thead>
<tr>
<th>Position</th>
<th>Company</th>
<th>Status</th>
<th>Salary</th>
<th>CV</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{data.map((app) => (

<tr key={app.id}>

<td>{app.position}</td>
<td>{app.companyName}</td>

<td>
<select
value={app.status}
onChange={(e) =>
changeStatus(app.id, e.target.value)
}
>
{[
"APPLIED",
"INTERVIEW",
"TECHNICAL_TEST",
"OFFER",
"REJECTED",
"WITHDRAWN"
].map(s => (
<option key={s}>{s}</option>
))}
</select>
</td>

<td>
{app.salaryMin} - {app.salaryMax}
</td>

<td>{app.cvFileName}</td>

<td>
<button onClick={() => remove(app.id)}>
Delete
</button>
</td>

</tr>

))}

</tbody>

</table>

{/* PAGINATION */}
<div style={{ marginTop: 20 }}>
<button disabled={page === 0}
onClick={() => setPage(page - 1)}>
Prev
</button>

<button onClick={() => setPage(page + 1)}>
Next
</button>
</div>

{/* MODAL CREATE */}
<Modal open={open} onClose={() => setOpen(false)}>

<h2>Create Application</h2>

<input
placeholder="Position"
value={position}
onChange={e => setPosition(e.target.value)}
/>

<input
placeholder="Notes"
value={notes}
onChange={e => setNotes(e.target.value)}
/>

<input
type="number"
placeholder="Salary Min"
value={salaryMin}
onChange={e => setSalaryMin(Number(e.target.value))}
/>

<input
type="number"
placeholder="Salary Max"
value={salaryMax}
onChange={e => setSalaryMax(Number(e.target.value))}
/>

{/* COMPANY SELECT */}
<select
value={companyId}
onChange={e => setCompanyId(e.target.value)}
>
<option value="">Select Company</option>

{companies.map(c => (
<option key={c.id} value={c.id}>
{c.name}
</option>
))}
</select>

{/* CV SELECT */}
<select
value={cvId}
onChange={e => setCvId(e.target.value)}
>
<option value="">Select CV</option>

{cvs.map(c => (
<option key={c.id} value={c.id}>
{c.label}
</option>
))}
</select>

<button onClick={create}>
Create Application
</button>

</Modal>

</div>

);

}