import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContexts";

export default function useAuth() {
  return useContext(AuthContext);
}
