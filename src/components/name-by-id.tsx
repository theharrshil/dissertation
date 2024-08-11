import React from "react";
import { useUserById } from "@/hooks/queries/get-user-by-id";

export const NameById: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useUserById(id);
  if (data) return <p className="ml-1 capitalize">{data.name}</p>;
  return <p>Loading...</p>;
};
