import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const usefollow = () => {
  const querryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userid) => {
      try {
        const res = await fetch(`/api/v1/user/network/${userid}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

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
      Promise.all([
        querryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        querryClient.invalidateQueries({ queryKey: ["authUser"] }),
        querryClient.invalidateQueries({ queryKey: ["user"] }),
        querryClient.invalidateQueries({ queryKey: ["friends"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { follow, isPending };
};

export default usefollow;
