import "./../styles/auth.scss";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { register } from "../store/authService";

export default function Register() {

const nav = useNavigate();

const [firstname, setFirstname] = useState("");
const [lastname, setLastname] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function submit() {

setLoading(true);
setError("");

try {

await register({
firstname,
lastname,
email,
password
});

nav("/");

} catch (err: any) {

setError(
err?.response?.data?.message ||
"Registration failed"
);

} finally {

setLoading(false);

}

}

return (

<div className="auth-page">

<div className="auth-page__card">

<h1 className="auth-page__title">
Register
</h1>

<div className="auth-page__form">

<input
className="auth-page__input"
placeholder="Firstname"
onChange={e => setFirstname(e.target.value)}
/>

<input
className="auth-page__input"
placeholder="Lastname"
onChange={e => setLastname(e.target.value)}
/>

<input
className="auth-page__input"
placeholder="Email"
onChange={e => setEmail(e.target.value)}
/>

<input
className="auth-page__input"
type="password"
placeholder="Password"
onChange={e => setPassword(e.target.value)}
/>

{error && (
<p style={{ color: "red", fontSize: "14px" }}>
{error}
</p>
)}

<button
className="auth-page__button"
onClick={submit}
disabled={loading}
>

{loading ? "Creating account..." : "Register"}

</button>

<div
className="auth-page__link"
onClick={() => nav("/")}
>

Already registered ?
<span> Login</span>

</div>

</div>

</div>

</div>

);

}