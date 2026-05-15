import {Routes, Route } from "react-router-dom"
import DashboardHome from "../pages/DashboardHome"
function dashboardRoutes(){
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<DashboardHome/>}/>
      </Routes>
    </>
  )
}

export default dashboardRoutes;