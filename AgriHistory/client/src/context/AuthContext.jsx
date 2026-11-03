import { createContext, useContext, useMemo, useState } from "react";
import API from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("agri_user"))}catch{return null}});
 const login=async(data)=>{const {data:res}=await API.post("/auth/login",data);localStorage.setItem("agri_token",res.token);localStorage.setItem("agri_user",JSON.stringify(res.user));setUser(res.user);return res.user};
 const register=async(data)=>{const {data:res}=await API.post("/auth/register",data);localStorage.setItem("agri_token",res.token);localStorage.setItem("agri_user",JSON.stringify(res.user));setUser(res.user);return res.user};
 const logout=()=>{localStorage.removeItem("agri_token");localStorage.removeItem("agri_user");setUser(null)};
 const value=useMemo(()=>({user,login,register,logout}),[user]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
