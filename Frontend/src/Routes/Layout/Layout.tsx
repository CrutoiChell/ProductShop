import s from "./Layout.module.scss"
import { Header } from "../../Components/Header/Header"
import { Outlet } from "react-router-dom"
import { useState } from "react"

export function Layout() {

  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
};

