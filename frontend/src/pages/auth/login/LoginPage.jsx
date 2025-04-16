import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden md:flex items-center  justify-center w-full">
        <XSvg className=" md:h-3/4 fill-white md:w-3/4" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center w-full h-full">
        <form
          className="md:w-3/4  mx-auto md:mx-20  flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center">
            <XSvg className="w-24 md:hidden fill-white" />
            <h1 className="text-4xl font-extrabold text-white">
              {"Let's"} go.
            </h1>
          </div>

          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button
            className="btn rounded-full btn-primary w-full text-white hover:shadow-[0_0_15px_.8px_#1DA1F2]
           transition ease-in-out duration-300"
          >
            Login
          </button>
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        <div className="flex flex-col md:flex-row md:w-2/3  items-center md:gap-4 justify-between mt-4 gap-4 md:min-w-[340px]">
          <p className="text-white text-lg text-center">
            {"Don't"} have an account?
          </p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline lg:w-[108px] w-[116px] ">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
