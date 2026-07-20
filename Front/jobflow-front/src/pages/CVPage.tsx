import { useEffect, useState } from "react";

import {
uploadCV,
getCVs,
deleteCV
} from "../services/cv.service";

import Modal from "../components/modal/Modal";

import { FILE_BASE_URL } from "../config/file";

import "../styles/cv.scss";

export default function CV() {

const [cvs, setCvs] = useState<any[]>([]);
const [open, setOpen] = useState(false);

const [file, setFile] = useState<File | null>(null);
const [label, setLabel] = useState("");
const [note, setNote] = useState("");

useEffect(() => {
load();
}, []);

async function load() {
const res = await getCVs();
setCvs(res.data);
}

async function upload() {

if (!file) return;

await uploadCV(file, label, note);

setOpen(false);
setFile(null);
setLabel("");
setNote("");

load();

}



function openFile(filename: string) {
window.open(`${FILE_BASE_URL}${filename}`, "_blank");
}

function downloadFile(filename: string, name: string) {

const link = document.createElement("a");

link.href = `${FILE_BASE_URL}${filename}`;

link.download = name;

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

}

return (

<div className="cv-page">

<h1>CV Manager</h1>

<button className="create-btn"
onClick={() => setOpen(true)}
>
Upload CV
</button>

{/* LIST */}
<div className="cv-grid">

{cvs.map(cv => (

<div className="cv-card" key={cv.id}>

<h3>{cv.label}</h3>

<p>{cv.fileName}</p>

<p style={{ fontSize: 12, color: "#64748b" }}>
{cv.note}
</p>

{/* ACTIONS */}
<div style={{ display: "flex", gap: 8 }}>

<button
onClick={() => openFile(cv.fileUrl)}
>
View
</button>

<button
onClick={() => downloadFile(cv.fileUrl, cv.fileName)}
>
Download
</button>

<button onClick={() => deleteCV(cv.id)}>
Delete
</button>

</div>

</div>

))}

</div>

{/* MODAL */}
<Modal open={open} onClose={() => setOpen(false)}>

<h2>Upload CV</h2>

<input
type="text"
placeholder="Label"
value={label}
onChange={e => setLabel(e.target.value)}
/>

<input
type="text"
placeholder="Note"
value={note}
onChange={e => setNote(e.target.value)}
/>

<input
type="file"
onChange={e => setFile(e.target.files?.[0] || null)}
/>

<button onClick={upload}>
Upload
</button>

</Modal>

</div>

);

}