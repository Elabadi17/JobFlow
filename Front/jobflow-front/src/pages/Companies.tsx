import { useEffect, useState } from "react";

import {
getCompanies,
createCompany,
deleteCompany
} from "../services/company.service";

import Modal from "../components/modal/Modal";

import "../styles/table.scss";

export default function Companies() {

const [companies, setCompanies] = useState<any[]>([]);
const [open, setOpen] = useState(false);

const [name, setName] = useState("");
const [website, setWebsite] = useState("");
const [location, setLocation] = useState("");

useEffect(() => {
load();
}, []);

async function load() {
const res = await getCompanies();
setCompanies(res.data.content);
}

async function create() {

await createCompany({
name,
website,
location
});

setOpen(false);
setName("");
setWebsite("");
setLocation("");

load();

}

return (


<div>

<h1>Companies</h1>

<button
className="create-btn"
onClick={() => setOpen(true)}
>
+ New Company
</button>

{/* TABLE */}
<div className="table">

<table>

<thead>
<tr>
<th>Name</th>
<th>Website</th>
<th>Location</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{companies.map((c) => (

<tr key={c.id}>

<td>{c.name}</td>
<td>{c.website}</td>
<td>{c.location}</td>

<td>

<button
onClick={() => deleteCompany(c.id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* MODAL */}

<Modal open={open} onClose={() => setOpen(false)}>

<h2>Create Company</h2>

<input placeholder="Name"
value={name}
onChange={e => setName(e.target.value)}
/>

<input placeholder="Website"
value={website}
onChange={e => setWebsite(e.target.value)}
/>

<input placeholder="Location"
value={location}
onChange={e => setLocation(e.target.value)}
/>

<button onClick={create}>
Create
</button>

</Modal>

</div>


);

}