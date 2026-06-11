import { useState } from "react";
import { loginUser }
from "../services/authService";
import { useNavigate }
from "react-router-dom";

function Login() {

  const navigate =
  useNavigate();

  const [formData,
  setFormData] =
  useState({
    email: "",
    password: "",
  });

  const handleChange =
  (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
      e.target.value,
    });
  };

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      const data =
      await loginUser(
        formData
      );

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      localStorage.setItem(
        "token",
        data.accessToken
      );

      console.log(
        "TOKEN SAVED:",
        localStorage.getItem(
          "token"
        )
      );

      alert(
        "Login successful"
      );

      navigate(
        "/dashboard"
      );

    } catch (error) {

      console.log(
        "LOGIN ERROR:",
        error
      );

      alert(
        "Login failed"
      );
    }
  };

  return (
    <div className="
      h-screen
      flex
      items-center
      justify-center
    ">

      <form
        onSubmit={
          handleSubmit
        }
        className="
        w-[350px]
        shadow-lg
        p-6
        rounded-lg
        flex
        flex-col
        gap-4
      "
      >

        <h1 className="
          text-2xl
          font-bold
          text-center
        ">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
          className="
          border
          p-2
          rounded
        "
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={
            formData.password
          }
          onChange={
            handleChange
          }
          className="
          border
          p-2
          rounded
        "
          required
        />

        <button
          type="submit"
          className="
          bg-black
          text-white
          p-2
          rounded
        "
        >
          Login
        
          </button>

<p className="
text-center
text-sm
mt-2
">
Don't have an account?

<span
onClick={() =>
navigate("/register")
}
className="
text-blue-600
cursor-pointer
ml-1
font-semibold
"
>
Register
</span>

</p>

</form>

    </div>
  );
}

export default Login;