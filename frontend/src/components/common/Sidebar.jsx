import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const data = {
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy1.png",
  };

  return (
    <div className="md:flex-[2_2_0] w-20  max-w-52">
      <div className="sticky top-0 left-0 bottom-0 h-screen flex flex-col border-r border-gray-700 w-20  md:w-full pt-5">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 md:w-14 md:h-14 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-8">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 md:pr-4 pr-2 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 md:pr-4 pr-2 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${data?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 md:pr-4 pr-2 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-5 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex mt-[px]">
              <div className="w-10 h-[] rounded-full ">
                <img
                  className=""
                  src={data?.profileImg || "/avatar-placeholder.png"}
                />
              </div>
            </div>
            <div className="flex md:justify-between justify-center flex-1 items-center">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{data?.username}</p>
              </div>
              <BiLogOut className="md:w-5 md:h-5 w-6 h-6 cursor-pointer" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
