
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import CommonFunctions from "../utils/CommonFunctions";
import Swal from "sweetalert2";
function ServerDashBoard() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListStations, setListStations] = useState([]);
  const [StationList, setStationList] = useState(true);
  const [StationId, setStationId] = useState(0);
  const [Status, setStatus] = useState(true);
  const [RefreshGrid, setRefreshGrid] = useState(false);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  const getDuration = window.DashboardRefreshtime;

  const GetStation = async function () {
    document.getElementById('loader').style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/StationsDashBoardData", {
      method: 'GET',
      headers: authHeader ,
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setRefreshGrid(RefreshGrid ? false : true);
          for (var i = 0; i < data.Table1.length; i++) {
            data.Table1[i].lastData = data.Table1[i].lastData.replace("T", " ").substring(0, 19);
            data.Table1[i].pollingdata = data.Table1[i].pollingdata.replace("T", " ").substring(0, 19);
            data.Table1[i].alarmcnt = data.Table1[i].alarmcnt <= 0 && data.Table1[i].alarmcnt == null ? "<span class='text-success'>Ok</span>" : "<span class='text-danger'>Active</span>";
            data.Table1[i].failurecnt = data.Table1[i].failurecnt <= 0 && data.Table1[i].failurecnt == null ? "<span class='text-success'>Ok</span>" : "<span class='text-danger'>Active</span>";
            data.Table1[i].CommunicationStatus = data.Table1[i].CommunicationStatus== 'Failed' ? "<span class='text-danger'>Failed</span>" : "<span>Ok</span>";
          }
          setListStations(data.Table1);
        }
        document.getElementById('loader').style.display = "none";
      }).catch((error) => toast.error('Unable to get the Stations list. Please contact adminstrator'));
  }
  useEffect(() => {
    initializeJsGrid();
  },[RefreshGrid]);

  useEffect(() => {
    const interval = setInterval(() => {
      GetStation('refresh');
    }, getDuration);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  })
  useEffect(() => {
    GetStation();
  }, [])
  const initializeJsGrid = function () {
    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: false,
      editing: false,
      inserting: false,
      sorting: true,
      paging: true,
      autoload: true,
      pageSize: 100,
      pageButtonCount: 5,
      controller: {
        data: ListStations,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.StationName || item.StationName.toUpperCase().indexOf(filter.StationName.toUpperCase()) >= 0)
              && (!filter.Description || item.Description.toUpperCase().indexOf(filter.Description.toUpperCase()) >= 0)
              && (!filter.lastData || item.lastData.toUpperCase().indexOf(filter.lastData.toUpperCase()) >= 0)
              && (!filter.alarmcnt || item.alarmcnt.toUpperCase().indexOf(filter.alarmcnt.toUpperCase()) >= 0)
              && (!filter.failurecnt || item.failurecnt.toUpperCase().indexOf(filter.failurecnt.toUpperCase()) >= 0)
              && (!filter.lastData || item.lastData.toUpperCase().indexOf(filter.lastData.toUpperCase()) >= 0)
              && (!filter.pollingdata || item.pollingdata.toUpperCase().indexOf(filter.pollingdata.toUpperCase()) >= 0)
              && (!filter.CommunicationStatus || item.CommunicationStatus.toUpperCase().indexOf(filter.CommunicationStatus.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "StationName", title: "Measurement Site", type: "text" },
        { name: "Description", title: "Station Label", type: "text" },
        { name: "lastData", title: "Communication", type: "text" },
        { name: "alarmcnt", title: "Alarms", type: "text" },
        { name: "failurecnt", title: "Failures", type: "text" },
        { name: "lastData", title: "Last Data", type: "text" },
        { name: "pollingdata", title: "Next Polling", type: "text" },
        { name: "CommunicationStatus",title:"Communication Status", type:"text"}
      ]
    });
  }

  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="row">
          <div id="loader" className="loader"></div>
        </div>
        <div className="pagetitle">
          {StationList && (
            <h1>Measurement Site Status</h1>
          )}
        </div>
        <section className="section">
          <div className="container mt-3">
            {StationList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>

      </div>
    </main>
  );
}
export default ServerDashBoard;