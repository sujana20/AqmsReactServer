
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
function ExceedenceReport() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [AllData, setAllData] = useState([]);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [Units, setUnits] = useState([]);
  const [Criteria, setcriteria] = useState([]);
  const [ListExceedence, setListExceedence] = useState(null);

  const GetLookupData = function () {
    fetch(process.env.REACT_APP_WSurl + "api/AirQuality/GetExceedenceLookupData", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setAllData(data);
        setStations(data.listStations);  
        let resArr = [];
        data.listParameters.filter(function(item){
          let i = resArr.findIndex(x => (x.parameter == item.parameter));
          if(i <= -1){
                resArr.push(item);
          }
          return null;
        });
        setPollutents(resArr);
        console.log(resArr)
        }
      }).catch((error) => toast.error('Unable to get the users list. Please contact adminstrator'));
  }

  const Parameterchange=function(e){
      let value = e.target.value;
     // setUnits([]);
      //setcriteria([]);
      document.getElementById("unitid").value="";
      document.getElementById("intervalid").value="";
        let resArr=[];
        let resArr1=[];
      AllData.listParameters.filter(function(item){
        if(item.parameter == value){
        let i = resArr.findIndex(x => (x.unitID == item.unitID));
        let j = resArr1.findIndex(x => (x.interval == item.interval));
        if(i <= -1){
              resArr.push(item);
        }
        if(j <= -1){
          resArr1.push(item);
            }
      }
        return null;
      });
    setUnits(resArr);
    setcriteria(resArr1);
  }

  const GetUnitName=function(param){
    let unitName=AllData.listReportedunits.filter(x=>x.id==param)[0]?.unitName;
    return unitName;
  }
  const GetInterval=function(param){
    let Interval=param / 60;
    return Interval+"-H";
  }

  const ReportValidations = function (Station, Pollutent, UnitID,Fromdate, Todate, Interval) {
    let isvalid = true;
    if (Station == "") {
      toast.error('Please select station', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (Pollutent == "") {
      toast.error('Please select pollutent', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (UnitID == "") {
      toast.error('Please select from date', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    }else if (Fromdate == "") {
      toast.error('Please select from date', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (Todate == "") {
      toast.error('Please select to date', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (Interval == "") {
      toast.error('Please select interval', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    }
    return isvalid;
  }
  const GenarateReport=function(){
    let StationID = document.getElementById("stationid").value;
    let PollutentName = document.getElementById("pollutentid").value;
    let UnitID=document.getElementById("unitid").value;
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("intervalid").value;
    let valid = ReportValidations(StationID, PollutentName,UnitID, Fromdate, Todate, Interval);
    if (!valid) {
      return false;
    }
    let Exceedencevalue=AllData.listParameters.filter(x=>x.parameter==PollutentName && x.interval == Interval && x.unitID==UnitID)[0]?.excedenceValue;
    let params = new URLSearchParams({StationID: StationID, FromDate: Fromdate, ToDate: Todate, Parameter: PollutentName, UnitID:UnitID, Interval: Interval,Exceedencevalue:Exceedencevalue});
 
    fetch(process.env.REACT_APP_WSurl + "api/AirQuality/ParameterExceedence?"+params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListExceedence(data);
        }
      }).catch((error) => console.log(error));
  }

  useEffect(() => {
    initializeJsGrid();
  });
  useEffect(() => {
    GetLookupData();
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
        data: ListExceedence,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.average || item.average.includes(filter.average))
              && (!filter.date || item.date.includes(filter.date))
              && (!filter.hour || item.hour.includes(filter.hour))
            );
          });
        }
      },
      fields: [
        { title: "Rank",   itemTemplate: function(_, item) {
          var index = window.jQuery(gridRefjsgridreport.current).jsGrid("option", "data").indexOf(item);
          return index + 1; // Display index (add 1 for 1-based indexing)
            },
            width: 50 // Set the column width as needed},
          },
        { name: "average", title: "Average", type: "text" },
        { name: "date", title: "Date", type: "text" },
        { name: "hour", title: "Hour", type: "text", },
        /* {
          type: "control", width: 100, editButton: false, deleteButton: false
        }, */
      ]
    });
  }
 
  return (
    <main id="main" className="main" >

        <section className="section">
          <div className="container">
          <div className="card">
              <div className="card-body">
                <div className="row filtergroup">
                  <div className="col">
                    <label className="form-label">Station Name</label>
                    <select className="form-select stationid" id="stationid">
                    <option selected> Select Station Name</option>
                      {Stations.map((x, y) =>
                        <option value={x.id} key={y}>{x.stationName}</option>
                      )}
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">Parameters</label>
                    <select className="form-select pollutentid" id="pollutentid" onChange={(e)=>Parameterchange(e)}>
                    <option selected> Select Parameter</option>
                      {Pollutents.map((x, y) =>
                        <option value={x.parameter} key={y} >{x.parameter}</option>
                      )}
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">Units</label>
                    <select className="form-select pollutentid" id="unitid">
                    <option value="" selected> Select Unit</option>
                      {Units.map((x, y) =>
                        <option value={x.unitID} key={y} >{GetUnitName(x.unitID)}</option>
                      )}
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">From Date</label>
                    <DatePicker className="form-control" id="fromdateid" selected={fromDate} onChange={(date) => setFromDate(date)} />
                  </div>
                  <div className="col">
                    <label className="form-label">To Date</label>
                    <DatePicker className="form-control" id="todateid" selected={toDate} onChange={(date) => setToDate(date)} />
                  </div>
                  <div className="col">
                    <label className="form-label">Interval</label>
                    <select className="form-select" id="intervalid">
                      <option value="" selected>Select Interval</option>
                      {Criteria.map((x, y) =>
                        <option value={x.interval} key={y} >{GetInterval(x.interval)}</option>
                      )}
                    </select>
                  </div>

                  <div className="col-md-12  mt-4">
                    <button type="button" className="btn btn-primary" onClick={GenarateReport}>Generate Report</button>
                  </div>
                </div>
              </div>
            </div>
            {ListExceedence && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>
    </main>
  );
}
export default ExceedenceReport;