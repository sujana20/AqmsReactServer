import React, { useEffect, useState ,Suspense, lazy} from "react";
import { BrowserRouter, Routes, Route, Navigate,useLocation} from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Header from './Layouts/Header';
import Sidenavbar from "./Layouts/Sidenavbar";
import Pagination from "./Pagination";
import { LayoutCssClasses } from "ag-grid-community";
const Login =lazy(() => import("./Pages/Login"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const ChangePassword = lazy(() => import("./Pages/ChangePassword"));
const Dashboard =lazy(() => import("./Pages/Dashboard"));
const Profile =lazy(() => import("./Pages/Profile"));
const Parameters =lazy(() => import("./Pages/Parameters"));
const AirQuality =lazy(() => import("./Pages/AirQuality"));
const AverageDataReport=lazy(() => import("./Pages/AverageDataReport"));
const StasticsReport=lazy(() => import("./Pages/StasticsReport"));
const StasticsDataReport=lazy(() => import("./Pages/StasticsDataReport"));
const Adduser=lazy(() => import("./Pages/Adduser"));
const AddStation=lazy(() => import("./Pages/AddStation"));
const AddDevice=lazy(() => import("./Pages/AddDevice"));
const AddParameter=lazy(() => import("./Pages/AddParameter"));
const UserLogHistory=lazy(() => import("./Pages/UserLogHistory"));
const PredefinedCharts=lazy(() => import("./Pages/PredefinedCharts"));
const DetailedAnalysisReports=lazy(() => import("./Pages/DetailedAnalysisReports"));
const GsiModbusDrivers=lazy(() => import("./Pages/GsiModbusDrivers"));
const Calibration=lazy(()=> import("./Pages/Calibration"));
const AverageAlarm=lazy(()=> import("./Pages/AverageAlarm"));
const DataProcessing=lazy(()=> import("./Pages/DataProcessing"));
const AppLogHistory=lazy(() => import("./Pages/AppLogHistory"));
const LiveData=lazy(()=> import("./Pages/LiveData"));
const DataProcessingClient=lazy(() => import("./Pages/DataProcessingClient"));
const HistoricalData=lazy(() => import("./Pages/HistoricalData"));
const LiveDataReports=lazy(() => import("./Pages/LiveDataReports"));
const GroupingParameter=lazy(() => import("./Pages/GroupingParameter"));
const ServerDashBoard=lazy(() => import("./Pages/ServerDashBoard"));
const UserGroups=lazy(() => import("./Pages/UserGroups"));
const PagenotFound=lazy(() => import("./Pages/PagenotFound"));
const AddLicence=lazy(() => import("./Pages/AddLicense"));
const ExceedenceReport=lazy(() => import("./Pages/ExceedenceReport"));
const WindRose=lazy(() => import("./Pages/WindRosecomp"));
const License =lazy(() => import("./Pages/License"));
function App() {   
    const location = useLocation();
    const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
    const shouldRenderHeaderAndSidebar = currentUser != null && location.pathname !== "/License";
    if(currentUser!=null){
      var permissions=currentUser.permissions.split(",");
    }
    
  return (    
    <div>
      {shouldRenderHeaderAndSidebar && <Header />}
      {shouldRenderHeaderAndSidebar && <Sidenavbar />}     
        <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route   path="/" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)}  />
          <Route   path="/Login" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)} />
          <Route   path="/ResetPassword" exact element={currentUser ==null ? <ResetPassword /> : (<Navigate to="/" />)} />
          <Route   path="/ForgotPassword" exact element={currentUser ==null ? <ForgotPassword /> : (<Navigate to="/" />)} />
          <Route   path="/ChangePassword" exact element={currentUser ==null ? <ChangePassword /> : (<Navigate to="/" />)} />
          <Route   path="*" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)} />
          <Route   path="/Dashboard" exact element={currentUser !=null && permissions.indexOf("Dashboard")>=0 ? <ServerDashBoard /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Profile" exact element={currentUser !=null && permissions.indexOf("Profile")>=0 ? <Profile /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Parameters" exact element={currentUser !=null && permissions.indexOf("Parameters")>=0 ? <Parameters /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AirQuality" exact element={currentUser !=null && permissions.indexOf("AirQuality")>=0 ? <AirQuality /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AverageDataReport" exact element={currentUser !=null && permissions.indexOf("AverageDataReport")>=0 ? <AverageDataReport /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/StatisticalReport" exact element={currentUser !=null && permissions.indexOf("Statistical Reports")>=0 ? <StasticsReport /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/StasticsDataReport" exact element={currentUser !=null && permissions.indexOf("StasticsDataReport")>=0 ? <StasticsDataReport /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Adduser" exact element={currentUser !=null && permissions.indexOf("Users")>=0 ? <Adduser /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddStation" exact element={currentUser !=null && permissions.indexOf("Station")>=0 ? <AddStation /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddDevice" exact element={currentUser !=null && permissions.indexOf("Device")>=0 ? <AddDevice /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddParameter" exact element={currentUser !=null && permissions.indexOf("Parameter")>=0 ? <AddParameter /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/UserLogHistory" exact element={currentUser !=null && permissions.indexOf("Users Log")>=0 ? <UserLogHistory /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/PredefinedCharts" exact element={currentUser !=null && permissions.indexOf("Predefined Charts")>=0 ? <PredefinedCharts /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/DetailedAnalysisReports" exact element={currentUser !=null && permissions.indexOf("Detailed Analysis Report")>=0 ? <DetailedAnalysisReports /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/GsiModbusDrivers" exact element={currentUser !=null && permissions.indexOf("GsiModbusDrivers")>=0 ? <GsiModbusDrivers /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Calibrations"  exact element={currentUser !=null && permissions.indexOf("Calibrations")>=0 ? <Calibration /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/AverageAlarm"  exact element={currentUser !=null && permissions.indexOf("AverageAlarm")>=0 ? <AverageAlarm /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/DataProcessing"  exact element={currentUser !=null && permissions.indexOf("Data Validation")>=0 ? <DataProcessing /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/AppLogHistory" exact element={currentUser !=null && permissions.indexOf("Application Log")>=0 ? <AppLogHistory /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/LiveData"  exact element={currentUser !=null && permissions.indexOf("Livedata")>=0 ? <LiveData /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/DataProcessingClient" exact element={currentUser !=null && permissions.indexOf("DataProcessingClient")>=0 ? <DataProcessingClient /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/HistoricalData"  exact element={currentUser !=null &&  permissions.indexOf("Data Browsing")>=0 ? <HistoricalData /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/LiveDataReports" exact element={currentUser !=null &&  permissions.indexOf("LiveDataReports")>=0 ? <LiveDataReports /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/GroupingParameter" exact element={currentUser !=null &&  permissions.indexOf("Grouping")>=0 ? <GroupingParameter /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/UserGroups" exact element={currentUser !=null &&  permissions.indexOf("Users Group")>=0 ? <UserGroups /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/PagenotFound" exact element={currentUser !=null &&  permissions.indexOf("PagenotFound")>=0 ? <PagenotFound /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddLicence" exact element={currentUser !=null && permissions.indexOf("Licence")>=0 ? <AddLicence /> : currentUser !=null ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/ExceedenceReport" exact element={currentUser !=null &&  permissions.indexOf("Exceedence Report")>=0 ? <ExceedenceReport /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/WindRose" exact element={currentUser !=null &&  permissions.indexOf("WindRose")>=0 ? <WindRose /> : currentUser !=null  ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route path="/License" exact element=<License /> />
        </Routes>
      </Suspense>
  
  </div>
  );
}

export default App;
