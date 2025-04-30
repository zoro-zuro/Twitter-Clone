import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton";
import usefollow from "../../hooks/usefollow";
import { debounce } from "lodash"; // Correct import for Lodash

const SearchPage = () => {
  const [username, setUsername] = useState("");

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["searchResults", username],
    queryFn: async () => {
      if (!username) return [];
      const res = await fetch(`/api/v1/search/${username}`);
      if (!res.ok) throw new Error("Failed to fetch search results.");
      const data = await res.json();
      return data.peoples;
    },
    enabled: !!username,
  });

  const { follow, isPending } = usefollow();

  const debouncefn = useMemo(() => {
    return debounce((value) => {
      setUsername(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncefn.cancel(); // Cleanup function to avoid memory leaks
    };
  }, [debouncefn]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    debouncefn(value); // Call the debounced function
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen pb-[52px] md:pb-0 relative">
      {!searchResults && (
        <img
          src="/backgroundsearchimg.jpg"
          alt=""
          className="absolute top-0 bottom-0 right-0 left-0 w-full h-full -z-50 object-cover"
        />
      )}
      <div className="">
        {/* Search Input */}
        <div className=" absolute top-0 left-0 right-0 flex justify-center items-center p-4 border-gray-700">
          <label className="input border-none bg-[#16181C] rounded-full flex items-center">
            <svg
              className="h-[1.4em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              required
              placeholder="Search"
              onChange={handleInputChange}
              className="bg-[#16181C] text-white ml-2"
            />
          </label>
        </div>
        <div className="pt-20">
          {/* Search Results */}
          {isSearching && <LoadingSpinner size="lg" />}
          {!isSearching && searchResults && !searchResults == [] ? (
            searchResults?.map((person) => (
              <Link
                to={`/profile/${person.username}`}
                className="flex items-center justify-between gap-4 m-2 px-12"
                key={person._id}
              >
                <div className="flex gap-2 items-center w-full">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
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
                        className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
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
            <div className="flex flex-col w-full h-screen items-center justify-center">
              <div className="text-center h-full text-white text-xl flex items-center justify-center w-full">
                No results found !
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
