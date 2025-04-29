import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TiDeleteOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useState } from "react";

const NotificationPage = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/notify/all");
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error ? data.error : "Something went wrong");
        }

        return data.notifications;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const querryClient = useQueryClient();

  const [notifyId, setnotifyId] = useState("");

  const { mutate: deleteNotif, isLoading: isDeleting } = useMutation({
    mutationFn: async (notifyId) => {
      try {
        const res = await fetch(
          `/api/v1/notify${notifyId == "" ? `/one/${notifyId}` : "/"}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error ? data.error : "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Successfully deleted");
      querryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });

  const deleteNotifications = (notifId) => {
    if (isDeleting) return;
    if (notifId) {
      setnotifyId(notifId);
    }
    deleteNotif();
  };

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen pb-[52px] md:pb-0">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div
            className="border-b border-gray-700 w-full flex justify-between"
            key={notification._id}
          >
            <div className="flex gap-2 p-4 w-full">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link
                className="w-full"
                to={`/profile/${notification.from.username}`}
              >
                <div className="flex justify-between h-full w-full items-center">
                  <div className="flex flex-row gap-2 h-full w-full items-center">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            notification.from.profileImg ||
                            "/avatar-placeholder.png"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-1 w-full">
                      <span className="font-bold">
                        @{notification.from.username}
                      </span>{" "}
                      {notification.type === "follow"
                        ? "followed you"
                        : "liked your post"}
                    </div>
                  </div>
                  <div
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteNotifications(notification._id);
                    }}
                  >
                    <TiDeleteOutline className="w-6 h-6 hover:text-orange-500" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
