import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [mutate] = mutationHook();

  const executMutate = async (toastMessgae, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessgae || "Loading...");
    try {
      const res = await mutate(...args);
      console.log(res);
      if (res.data) {
        toast.success(res.data.message, { id: toastId });
        setData(res.data);
        console.log(res.data);
      } else {
        toast.error(res?.error?.data?.message, { id: toastId });
      }
    } catch (error) {
      toast.error(res?.error?.data?.message, { id: toastId });
      console.log(error);
    }
  };

  return [executMutate, isLoading, data];
};

export { useErrors, useAsyncMutation };
