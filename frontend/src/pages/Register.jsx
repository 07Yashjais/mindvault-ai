import { useState } from "react";
import { registerUser }
from "../services/authService";

function Register() {

  const [formData,
  setFormData] =
  useState({
    name: "",
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
      await registerUser(
        formData
      );

      console.log(data);

      alert(
        "Registration successful"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Registration failed"
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
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={
            handleChange
          }
          className="
          border
          p-2
          rounded
        "
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={
            handleChange
          }
          className="
          border
          p-2
          rounded
        "
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={
            handleChange
          }
          className="
          border
          p-2
          rounded
        "
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
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;