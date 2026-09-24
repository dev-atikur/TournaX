import { useMemo } from "react";
import useAuth from "./useAuth";
import { staffPermissions } from "../utils/permissions";

export default function useStaff() {
  const { user } = useAuth();
  return useMemo(() => staffPermissions(user?.role), [user?.role]);
}
