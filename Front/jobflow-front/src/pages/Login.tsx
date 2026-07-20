import "./../styles/auth.scss";

import { useState } from "react";

import { useDispatch } from "react-redux";

import { loginSuccess } from "../store/authSlice";

import { useNavigate } from "react-router-dom";

import { login } from "../store/authService";

export default function Login() {

const nav=
useNavigate();

const dispatch=
useDispatch();

const[
email,
setEmail
]=useState("");

const[
password,
setPassword
]=useState("");

async function submit(){

const res=
await login({
email,
password
});

dispatch(
loginSuccess(
res.data.token
)
);

nav(
"/dashboard"
);

}

return (

<div className="auth-page">

<div className="auth-page__card">

<h1 className="auth-page__title">
Login
</h1>

<div className="auth-page__form">

<input
className="auth-page__input"
placeholder="Email"
onChange={
e=>
setEmail(
e.target.value
)
}
/>

<input
className="auth-page__input"
type="password"
placeholder="Password"
onChange={
e=>
setPassword(
e.target.value
)
}
/>

<button
className="auth-page__button"
onClick={submit}
>

Login

</button>

<div
className="auth-page__link"
onClick={()=>
nav("/register")
}
>

No account ?
<span>
 Register
</span>

</div>

</div>

</div>

</div>

);

}