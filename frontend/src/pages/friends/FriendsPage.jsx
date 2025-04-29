import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import usefollow from "../../hooks/usefollow";
import { MdArrowBack, MdCancel } from "react-icons/md";

const FriendsPage = () => {
  const [friendsType, setFriendsType] = useState("following");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { username } = useParams();
  const {
    data: friends,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["friends", friendsType, username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/v1/user/${friendsType}/${username}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error ? data.error : "Something went wrong");
        }

        return data.friends;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [friendsType, username, refetch]);

  const { follow, isPending } = usefollow();

  return (
    <div className="min-h-screen flex-[4_4_0]  border-r border-gray-700 relative pb-[52px] md:pb-0">
      <Link to={`/profile/${username}`}>
        <MdArrowBack className="text-2xl absolute top-4.5 left-2 z-50" />
      </Link>

      <div className="w-full flex border-gray-700 items-center  border-b">
        <div
          className=" flex-1 flex justify-center text-center p-3 pt-5 hover:bg-secondary transition duration-300 cursor-pointer relative"
          onClick={() => setFriendsType("following")}
        >
          following
          {friendsType == "following" && (
            <div className="absolute bottom-0 h-1 w-10 bg-primary rounded-full"></div>
          )}
        </div>

        <div
          className="flex flex-1 items-center justify-center text-center p-3 pt-5 hover:bg-secondary transition duration-300 cursor-pointer relative"
          onClick={() => setFriendsType("followers")}
        >
          followers
          {friendsType == "followers" && (
            <div className="absolute bottom-0 h-1 w-10 bg-primary rounded-full"></div>
          )}
        </div>
      </div>
      {isLoading ||
        (isRefetching && (
          <div className="flex flex-col w-full h-full items-center justify-center">
            <LoadingSpinner
              size="[200px]"
              className="flex items-center justify-center"
            />
          </div>
        ))}

      {!isRefetching && !isLoading && friends.length > 0 ? (
        friends.map((person) => (
          <Link
            to={`/profile/${person.username}`}
            className="flex w-full flex-col items-center justify-between gap-4 px-8 py-7 border-gray-700 border-b"
            key={person._id}
          >
            <div className="flex gap-4 items-center w-full">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={person.profileImg || "/avatar-placeholder.png"}
                    alt={`${person.fullname}'s avatar`}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between w-full">
                <span className="font-semibold tracking-tight truncate w-28">
                  {person.fullname}
                </span>
                <span className="text-sm text-slate-500">
                  @{person.username}
                </span>
              </div>
              {authUser._id !== person._id ? (
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-100 rounded-full btn-md opacity-90"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(person._id);
                    }}
                  >
                    {isPending && <LoadingSpinner size="sm" />}
                    {!isPending && authUser?.following.includes(person?._id)
                      ? "unfollow"
                      : "follow"}
                  </button>
                </div>
              ) : (
                <Link to={`/profile/${person.username}`} key={person._id}>
                  <button className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm">
                    veiw
                  </button>
                </Link>
              )}
            </div>
          </Link>
        ))
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <div className="text-center h-full text-white text-xl flex items-center justify-center w-full">
            No {friendsType == "following" ? "following" : "followers"} found !
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
