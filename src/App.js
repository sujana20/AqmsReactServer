import React, { useEffect, useState ,Suspense, lazy} from "react";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Header from './Layouts/Header';
import Sidenavbar from "./Layouts/Sidenavbar";
import Pagination from "./Pagination";
import { LayoutCssClasses } from "ag-grid-community";
const Login =lazy(() => import("./Pages/Login"));
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
function App() {
   // const [location, setlocation] = useState(window.location.pathname);
   
    //const [LicenseExpired, setLicenseExpired] = useState(true);
    let LicenseExpired;
    const currentUser = JSON.parse(sessionStorage.getItem('UserData'));

    const Lisence = JSON.parse(sessionStorage.getItem('LisenceInformation'));
    LicenseExpired=true;
    if(Lisence!=null){
      var Licensestartdate=Lisence.startDate.split("T")[0];
      var Licenseenddate=Lisence.endDate.split("T")[0];

      if(Licensestartdate<=Licenseenddate){
        LicenseExpired=true;
      }
      else {
        LicenseExpired=false;
      }
      var today=new Date();
      var month = String(today.getMonth()+1).padStart(2, '0');
      var year = today.getFullYear();
      var date = String(today.getDate()).padStart(2, '0');
      var currentDate = year + "-" + month + "-" + date;
    }
    

    if(currentUser!=null){
      var permissions=currentUser.permissions.split(",");
    }
    
  return (
    
    <div>
      {/* <BrowserRouter basename={process.env.REACT_APP_BASE_URL}> 
      <ToastContainer /> */}
      {currentUser!=null?<Header />:""}
      {currentUser!=null?<Sidenavbar />:""}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route   path="/" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)}  />
          <Route   path="/Login" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)} />
          <Route   path="*" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)} />
          <Route   path="/Dashboard" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Dashboard")>=0 ? <ServerDashBoard /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Profile" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Profile")>=0 ? <Profile /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Parameters" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Parameters")>=0 ? <Parameters /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AirQuality" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("AirQuality")>=0 ? <AirQuality /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AverageDataReport" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("AverageDataReport")>=0 ? <AverageDataReport /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/StatisticalReport" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Statistical Reports")>=0 ? <StasticsReport /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/StasticsDataReport" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("StasticsDataReport")>=0 ? <StasticsDataReport /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Adduser" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Users")>=0 ? <Adduser /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddStation" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Station")>=0 ? <AddStation /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddDevice" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Device")>=0 ? <AddDevice /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddParameter" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Parameter")>=0 ? <AddParameter /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/UserLogHistory" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Users Log")>=0 ? <UserLogHistory /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/PredefinedCharts" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Predefined Charts")>=0 ? <PredefinedCharts /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/DetailedAnalysisReports" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Detailed Analysis Report")>=0 ? <DetailedAnalysisReports /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/GsiModbusDrivers" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("GsiModbusDrivers")>=0 ? <GsiModbusDrivers /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/Calibrations"  exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Calibrations")>=0 ? <Calibration /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/AverageAlarm"  exact element={currentUser !=null && LicenseExpired && permissions.indexOf("AverageAlarm")>=0 ? <AverageAlarm /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/DataProcessing"  exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Data Validation")>=0 ? <DataProcessing /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/AppLogHistory" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Application Log")>=0 ? <AppLogHistory /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/LiveData"  exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Livedata")>=0 ? <LiveData /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/DataProcessingClient" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("DataProcessingClient")>=0 ? <DataProcessingClient /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/HistoricalData"  exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Data Browsing")>=0 ? <HistoricalData /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)}/>
          <Route   path="/LiveDataReports" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("LiveDataReports")>=0 ? <LiveDataReports /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/GroupingParameter" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Grouping")>=0 ? <GroupingParameter /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/UserGroups" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Users Group")>=0 ? <UserGroups /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/PagenotFound" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("PagenotFound")>=0 ? <PagenotFound /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/AddLicence" exact element={currentUser !=null && permissions.indexOf("Licence")>=0 ? <AddLicence /> : currentUser !=null ? <PagenotFound/> : (<Navigate to="/" />)} />
          <Route   path="/ExceedenceReport" exact element={currentUser !=null && LicenseExpired && permissions.indexOf("Exceedence Report")>=0 ? <ExceedenceReport /> : currentUser !=null && !LicenseExpired ? <PagenotFound/> : (<Navigate to="/" />)} />
        </Routes>
      </Suspense>
  {/* </BrowserRouter> */}
  </div>
  );
}

export default App;
