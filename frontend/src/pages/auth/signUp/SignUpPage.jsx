import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
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
    <div className="max-w-screen-xl mx-auto flex h-screen px-10 ">
      <div className="flex-1 hidden lg:flex items-center  justify-center w-full">
        <XSvg className=" md:h-2/3 fill-white md:w-2/3" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20  flex gap-4 flex-col "
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center">
            <XSvg className="w-24 lg:hidden fill-white" />
            <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          </div>

          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex flex-wrap md:flex-row flex-col gap-4">
            <label className="input input-bordered rounded flex items-center gap-2 md:flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 md:flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>

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
            className="btn rounded-full btn-primary text-white  hover:shadow-[0_0_15px_.8px_#1DA1F2]
           transition ease-in-out duration-300"
          >
            Sign up
          </button>
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>

        <div className="flex flex-col gap-3 md:flex-row md:w-2/3  items-center md:gap-1 justify-between mt-4 w-full">
          <p className="text-white text-lg flex-1">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline lg:w-[132px] w-[116px] flex-1">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
