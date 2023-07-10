import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import * as bootstrap from 'bootstrap';
import CommonFunctions from "../utils/CommonFunctions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  defaults,
} from 'chart.js';
import annotationPlugin from "chartjs-plugin-annotation";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  annotationPlugin
);

function HistoricalData() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const chartRef = useRef();
  const jspreadRef = useRef(null);
  const [selectedStations, setselectedStations] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [ListReportData, setListReportData] = useState([]);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [selectedgrid, setselectedgrid] = useState([]);
  const [SelectedPollutents, setSelectedPollutents] = useState([]);
  const [Criteria, setcriteria] = useState([]);
  const [dataForGridcopy, setdataForGridcopy] = useState([]);
  const [ChartData, setChartData] = useState({ labels: [], datasets: [] });
  const [ChartOptions, setChartOptions] = useState();
  const [ListHistory, setListHistory] = useState([]);
  const [SelectedCells, setSelectedCells] = useState([]);
  const [Nestedheaders, setNestedheaders] = useState([]);
  const [Flagcodelist, SetFlagcodelist] = useState([]);
  const [revert, setrevert] = useState(false);
  const [Groups, setGroups] = useState([]);
  const [StationGroups, setStationGroups] = useState([]);
  const [GroupSelected, setGroupSelected] = useState("");
  const [LoadjsGridData, setLoadjsGridData] = useState(false);
  const [DataCount, setDataCount] = useState(0);
  const [ReportDataList, setReportDataList] = useState([]);
  const revertRef = useRef();
  revertRef.current = revert;
  const ReportDataListRef = useRef();
  ReportDataListRef.current = ReportDataList;
  const dataForGridref = useRef();
  let jsptable = null;
  var lastSelectedRow;
  let cellnames = [];
  var dataForGrid = [];
  let digit = window.decimalDigit
  const spreadsheetcontainer = document.querySelector(".jexcel_content");
  const pageLimit = 25; // Number of records per page
  let currentPage = 1; // Current page
  let startindex = 0;
  let isLoading = false;
  let requestId;

  const colorArray = ["#96cdf5", "#fbaec1", "#00ff00", "#800000", "#808000", "#008000", "#008080", "#000080", "#FF00FF", "#800080",
    "#CD5C5C", "#FF5733", "#1ABC9C", "#F8C471", "#196F3D", "#707B7C", "#9A7D0A", "#B03A2E", "#F8C471", "#7E5109"];

  useEffect(() => {
    fetch(process.env.REACT_APP_WSurl + "api/AirQuality/GetAllLookupData")
      .then((response) => response.json())
      .then((data) => {
        setAllLookpdata(data);
        setStations(data.listStations);
        SetFlagcodelist(data.listFlagCodes);
        setStationGroups(data.listStationGroups);

        let groupNamearray = data.listStationGroups;
        let groupnames = groupNamearray.filter((ele, ind) => ind === groupNamearray.findIndex(elem => elem.groupID === ele.groupID))
        setGroups(groupnames);
        setTimeout(function () {
          // $('#stationid').SumoSelect({
          //   triggerChangeCombined: true, placeholder: 'Select Station', floatWidth: 200, selectAll: true,
          //   search: true
          // });
          $('#pollutentid').SumoSelect({
            triggerChangeCombined: true, placeholder: 'Select Parameter', floatWidth: 200, selectAll: true,
            search: true
          });
        }, 100);
        //setcriteria(data.listPollutentsConfig);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    // if (!jspreadRef.current) {
    if (jsptable) {
      jsptable.refresh();
    }
    initializeJsGrid();
    initializeTooltip();
    // }
  }, [ListReportData, LoadjsGridData]);


  const initializeTooltip = function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    return () => {
      tooltipList.map(t => t.dispose())
    }
  }

  const selectionActive = function (a, startcolindex, stratrowindex, endcolindex, endrowidex) { //a-enire value,b-1stcolumn index, c-start row index, d-last column index
    var data = jsptable.getData(true);
    var data1 = jsptable.getSelectedRows(true);
    setselectedgrid([startcolindex, stratrowindex, endcolindex, endrowidex])
    setdataForGridcopy(dataForGridref.current)
    let cellnames1 = [];
    for (var i = stratrowindex; i <= endrowidex; i++) {
      for (var k = startcolindex; k <= endcolindex; k++) {
        var cellName1 = jspreadsheet.helpers.getColumnNameFromCoords(k, i);
        cellnames1.push(cellName1);
      }
    }
    for (var p = 0; p < cellnames.length; p++) {
      let index = cellnames1.indexOf(cellnames[p]);
      if (index == -1) {
        jsptable.getCell(cellnames[p]).classList.remove('cellhelight');
      }
    }


    cellnames = [];
    for (var i = stratrowindex; i <= endrowidex; i++) {
      for (var k = startcolindex; k <= endcolindex; k++) {
        var cellName = jspreadsheet.helpers.getColumnNameFromCoords(k, i);
        cellnames.push(cellName);
        if (cellName) {
          jsptable.getCell(cellName).classList.add('cellhelight');
        }
      }
    }

    let finalarr = [];
    for (let j = data1[0]; j <= data1[(data1.length - 1)]; j++) {
      finalarr.push(dataForGridref.current[j]);
    }
    let key = Object.keys(finalarr[0]);
    let chart = chartRef.current;
    let chartdata = chart != null ? chart.data : [];
    for (let j = 0; j < SelectedPollutents.length; j++) {
      chartdata.datasets[j].pointRadius = chartdata.datasets[j].pointRadius.map(function (x) { x = 2; return x });
    }
    for (let k = startcolindex; k <= endcolindex; k++) {
      for (var i = 0; i < chartdata.datasets[k - 1].data.length; i++) {
        // const index = finalarr.findIndex(data => data.Date == chartdata.labels[i]);
        const index = finalarr.findIndex(x => x.Date == chartdata.datasets[k - 1].data[i].x);
        if (index > -1) {
          chartdata.datasets[k - 1].pointRadius[i] = 10;
        } else {
          chartdata.datasets[k - 1].pointRadius[i] = 2;
        }
      }
    }
    chart.update();
  }

  const loadtable = function (instance) {
    for (let i = 0; i < SelectedPollutents.length; i++) {
      let Parameterssplit = SelectedPollutents[i].split("@_");
      let filnallist = ReportDataListRef.current.filter(x => x.parameterName.toLowerCase() === Parameterssplit[0].toLowerCase());
      for (let j = 0; j < filnallist.length; j++) {
        let index = dataForGridref.current.findIndex(y => y.Date === filnallist[j].interval);
        if (index > -1) {
          let cell = instance.jexcel.getCellFromCoords(i + 1, index);
          if (filnallist[j].loggerFlags != null) {
            let classname = CommonFunctions.SetFlagColor(filnallist[j].loggerFlags, Flagcodelist);
            if (cell != undefined) {
              cell.style.backgroundColor = classname;
              //cell.classList.add(classname);
            }
          }
        }
      }
    }
  }


  const generateDatabaseDateTime = function (date) {
    return date.replace("T", " ").substring(0, 19);
  }
  const generateDatabaseDateTime16 = function (date) {
    return date.replace("T", " ").substring(0, 16);
  }
  /* reported data start */
  const initializeJsGrid = function () {
    dataForGrid = [];
    // var layout = [];
    // layout.push({ name: "Date", title: "Date", type: "text", readOnly: true });
    // for (var i = 0; i < SelectedPollutents.length; i++) {
    //   layout.push({ name: SelectedPollutents[i], title: SelectedPollutents[i] + " - ppb", type: "numaric" });
    // }
    let Groupid = document.getElementById("groupid").value;
    var layout = [];
    let headers = [];
    if (Groupid != "") {
      headers = Nestedheaders;
    }
    var gridheadertitle;
    layout.push({ name: "Date", title: "Date", type: "text", width: "140px", sorting: true });
    for (var i = 0; i < SelectedPollutents.length; i++) {
      let Parameterssplit = SelectedPollutents[i].split("@_");
      let filter = AllLookpdata.listPollutents.filter(x => x.parameterName == Parameterssplit[0]);
      let unitname = AllLookpdata.listReportedUnits.filter(x => x.id == filter[0].unitID);
      gridheadertitle = Parameterssplit[0] + "-" + unitname[0].unitName
      layout.push({
        name: SelectedPollutents[i], title: gridheadertitle, type: "text", width: "100px", sorting: false, cellRenderer: function (item, value) {
          let flag = AllLookpdata.listFlagCodes.filter(x => x.id == value[Object.keys(value).find(key => value[key] === item) + "flag"]);
          let bgcolor = flag.length > 0 ? flag[0].colorCode : "#FFFFFF";
          return $("<td>").css("background-color", bgcolor).append(item);
        }
      });
    }
    if (SelectedPollutents.length < 10) {
      for (var p = SelectedPollutents.length; p < 10; p++) {
        layout.push({ name: " " + p, title: " ", type: "text", width: "100px", sorting: false, readOnly: true, });
      }
    }
    //  layout.push({ type: "control", width: 100, editButton: false, deleteButton: false });
    dataForGrid = GridData(ListReportData, Groupid);
    dataForGridref.current = dataForGrid;

    jsptable = jspreadsheet(jspreadRef.current, {
      data: dataForGrid,
      rowResize: true,
      tableWidth: '100%',
      tableOverflow: true,
      freezeColumns: 1,
      columnSorting: false,
      columns: layout,
      nestedHeaders: headers,
      onselection: selectionActive,
      onload: loadtable,
    });
    if (jspreadRef.current != null) {
      getchartdata(ListReportData, SelectedPollutents, "line", "Raw");
      //Visiblerecords();
    }
  }

  const Visiblerecords = function (param) {
    const sheetcontainer = document.querySelector(".jexcel_content");
    const rowHeight = 25.6; // Height of a single row in pixels 
    let records = 1;
    if (param != "") {
      records = 2;
    }
    const visibleRowCount = Math.ceil(sheetcontainer.clientHeight / rowHeight) - records;
    const scrollPosition = sheetcontainer.scrollTop;
    const firstVisibleRow = Math.floor(scrollPosition / rowHeight);
    console.log(visibleRowCount, firstVisibleRow);
    const visibleRecords = dataForGridref.current.slice(firstVisibleRow, firstVisibleRow + visibleRowCount); // Perform operations with the visibleRecords data, such as updating the display // or executing any other desired actions
    return visibleRecords;
    /* const targetRowIndex = 15; // Index of the target row
    const scrollOffset = targetRowIndex * rowHeight;
    sheetcontainer.scrollTop = scrollOffset; */

    //const rowElement = document.querySelector(`.jexcel_content tr:nth-child(${rowIndex + 1})`);
    //rowElement.scrollIntoView();
  }

  const Getmaxvalue = function (visibleRecords, Key) {
    let max;
    let excludedKey = 'Date';
    if (Key != "") {
      max = visibleRecords.reduce((a, b) => a[excludedKey] > b[excludedKey] ? a[excludedKey] : b[excludedKey]);
      return generateDatabaseDateTime16(max);
    } else {

      let maxValue = -Infinity;
      for (let i = 0; i < visibleRecords.length; i++) {
        const object = visibleRecords[i];
        for (const key in object) {
          if (key !== excludedKey) {
            const value = object[key];
            //  if (typeof value === 'number') {
            maxValue = Math.max(maxValue, value);
            //}
          }
        }
      }
      return maxValue;

    }
    //return max;

  }
  const Getminvalue = function (visibleRecords, Key) {
    let min;
    let min1 = 0;
    let excludedKey = 'Date';
    if (Key != "") {
      min = visibleRecords.reduce((min, current) => {
        if (current[excludedKey] < min[excludedKey]) {
          return current;
        } else {
          return min;
        }
      })[excludedKey];
      return generateDatabaseDateTime16(min);
    } else {
      let minValue = Infinity;

      for (let i = 0; i < visibleRecords.length; i++) {
        const object = visibleRecords[i];

        for (const key in object) {
          if (key !== excludedKey) {
            const value = object[key];
            // if (typeof value === 'number') {
            minValue = Math.min(minValue, value);
            // }
          }
        }
      }
      return minValue;
    }
    // return min;

  }

  const GridData = function (ReportData, Groupid) {
    for (var k = 0; k < ReportData.length; k++) {
      var obj = {};
      dataForGrid = dataForGridref.current;
      var temp = dataForGrid.findIndex(x => x.Date === ReportData[k].interval);
      let roundedNumber = 0;
      if (window.TruncateorRound == "RoundOff") {

        let num = ReportData[k].parametervalue;
        roundedNumber = num == null ? num : num.toFixed(digit);
      }
      else {
        roundedNumber = ReportData[k].parametervalue == null ? ReportData[k].parametervalue : CommonFunctions.truncateNumber(ReportData[k].parametervalue, digit);
      }
      if (Groupid != "") {
        if (temp >= 0) {
          dataForGrid[temp][ReportData[k].parameterName + "@_" + ReportData[k].stationID] = roundedNumber;
        } else {
          obj["Date"] = ReportData[k].interval;
          obj[ReportData[k].parameterName + "@_" + ReportData[k].stationID] = roundedNumber;
          dataForGrid.push(obj);
        }
      } else {
        if (temp >= 0) {
          dataForGrid[temp][ReportData[k].parameterName] = roundedNumber;
        } else {
          obj["Date"] = ReportData[k].interval;
          obj[ReportData[k].parameterName] = roundedNumber;
          dataForGrid.push(obj);
        }
      }
    }
    return dataForGrid;
  }

  /* Scroll with pageing start */

  // Function to append new data to the jSpreadsheet-CE instance
  const appendDataToSpreadsheet = function (data, GroupId) {
    const spreadsheet = jspreadRef.current.jexcel;
    const currentData = spreadsheet.getData();
    let finaldata = GridData(data, GroupId);
    let newData = ReportDataListRef.current.concat(data);
    setReportDataList(newData);
    ReportDataListRef.current = newData;
    getchartdata(newData, SelectedPollutents, "line", "Raw");
    spreadsheet.setData(finaldata);
    /* let jspcontainer = jspreadRef.current.jexcel;;
    let scrollTop = jspcontainer.scrollTop;

    // Update the data in your spreadsheet

    // Adjust the scroll position to maintain the current view
    jspcontainer.scrollTop = scrollTop; */
    isLoading = false;
  }

  // Function to check if scroll reaches the bottom of the container
  const isScrollAtBottom = function () {
    const scrollTop = spreadsheetcontainer.scrollTop;
    const scrollHeight = spreadsheetcontainer.scrollHeight;
    const containerHeight = spreadsheetcontainer.clientHeight;
    const scrollThreshold = 100; // Adjust the threshold if needed
    //return scrollTop + containerHeight  >= scrollHeight;
    return scrollTop + containerHeight >= (scrollHeight - scrollThreshold);
  }

  const handleScroll = function () {
    getchartdata(ReportDataListRef.current, SelectedPollutents, "line", "Raw");
    if (startindex >= DataCount) {
      return false;
    }
    if (!isLoading && isScrollAtBottom() && !isScrollAtTop()) {
      isLoading = true;
      currentPage++; // Increment the current page
      //fetchDataonscroll(currentPage, pageLimit)
      GetProcessingData(currentPage, false);
    }
  }

  const scrollHandler = function () {
    cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(handleScroll);
  }

  const isScrollAtTop = function () {
    const scrollTop = spreadsheetcontainer.scrollTop;

    return scrollTop === 0;
  }

  useEffect(() => {
    // const jspreadsheetContainer = document.getElementById('my-jspreadsheet');
    if (ListReportData.length > 0 && spreadsheetcontainer) {
      spreadsheetcontainer.addEventListener('scroll', scrollHandler);

      return () => {
        // Clean up the scroll event listener when the component is unmounted
        spreadsheetcontainer.removeEventListener('scroll', scrollHandler);
      };
    }
  }, [ListReportData, spreadsheetcontainer]);

  // Fetch initial data for the first page
  /*Scroll with pageing end  */

  const hexToRgbA = function (hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
    }
    throw new Error('Bad Hex');
  }

  const GetProcessingData = function (currentPage, isInitialized) {
    let Station = "";
    let Pollutent = "";
    let GroupId = $("#groupid").val();
    Station = $("#stationid").val();
    Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    if (GroupId == "") {
      setSelectedPollutents(Pollutent);
    } else {
      Pollutent = SelectedPollutents;
    }
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Station, Pollutent, Fromdate, Todate, Interval, GroupId);
    if (!valid) {
      return false;
    }
    document.getElementById('loader').style.display = "block";
    let type = Interval.split('-');
    let Intervaltype;
    if (type[1] == 'H') {
      Intervaltype = type[0] * 60;
    } else {
      Intervaltype = type[0];
    }
    let isAvgData = false;
    if (Interval == '15-M') {
      isAvgData = false;
    }
    else {
      isAvgData = true;
    }
    startindex = (currentPage - 1) * pageLimit;
    let params = new URLSearchParams({ Group: GroupId, Station: Station, Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate, Interval: Intervaltype, isAvgData: isAvgData, StartIndex: startindex, PageLimit: pageLimit });
    // currentPage++;
    let url = process.env.REACT_APP_WSurl + "api/AirQuality?"
    if (GroupId != "") {
      url = process.env.REACT_APP_WSurl + "api/AirQuality/StationGroupingData?"
    }
    fetch(url + params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          let data1 = data.map((x) => { x.interval = x.interval.replace('T', ' '); return x; });
          if (isInitialized) {
            setListReportData(data1);
            setReportDataList(data1);
            setDataCount(data1.length > 0 ? data1[0].count : 0)
            setLoadjsGridData(true);
            //getchartdata(data1, Pollutent, "line", "Raw");
          }
          else {
            appendDataToSpreadsheet(data1, GroupId);
          }
        }

        document.getElementById('loader').style.display = "none";

      }).catch((error) => console.log(error));

  }

  const getdatareport = function () {
    currentPage = 1;
    setListReportData([]);
    setReportDataList([]);
    setLoadjsGridData(false);
    GetProcessingData(currentPage, true);
  }

  const DownloadExcel = function () {
    document.getElementById('loader').style.display = "block";

    let Station = "";
    let Pollutent = "";
    let GroupId = $("#groupid").val();
    Station = $("#stationid").val();
    Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    if (GroupId == "") {
      setSelectedPollutents(Pollutent);
    } else {
      Pollutent = SelectedPollutents;
    }


    setSelectedPollutents(Pollutent);
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("criteriaid").value;

    let valid = ReportValidations(Station, Pollutent, Fromdate, Todate, Interval, GroupId);
    if (!valid) {
      return false;
    }
    document.getElementById('loader').style.display = "block";
    let Intervaltype;
   let Intervaltypesplit=Interval.split('-');
    if (Intervaltypesplit[1] == 'H') {
      Intervaltype = Intervaltypesplit[0] * 60;
    } else {
      Intervaltype = Intervaltypesplit[0];
    }
    let isAvgData = false;
    if (Interval == '15-M') {
      isAvgData = false;
    }
    else {
      isAvgData = true;
    }
    let paramUnitnames;

    for (var i = 0; i < SelectedPollutents.length; i++) {
      let filter;
      let unitname;
      if (GroupId != "") {
        let Parameterssplit = SelectedPollutents[i].split("@_");
        let stationName = AllLookpdata.listStations.filter(x => x.id == Parameterssplit[1]);
        filter = AllLookpdata.listPollutents.filter(x => x.parameterName == Parameterssplit[0]);
        unitname = AllLookpdata.listReportedUnits.filter(x => x.id == filter[0].unitID);
        if (paramUnitnames == undefined) {
          paramUnitnames = stationName[0].stationName + "-" + filter[0].parameterName + "-" + unitname[0].unitName + ",";
        }
        else {
          paramUnitnames += stationName[0].stationName + "-" + filter[0].parameterName + "-" + unitname[0].unitName + ",";
        }
      }
      else {
        filter = AllLookpdata.listPollutents.filter(x => x.parameterName == SelectedPollutents[i]);
        unitname = AllLookpdata.listReportedUnits.filter(x => x.id == filter[0].unitID);
        if (paramUnitnames == undefined) {
          paramUnitnames = filter[0].parameterName + "-" + unitname[0].unitName + ",";
        }
        else {
          paramUnitnames += filter[0].parameterName + "-" + unitname[0].unitName + ",";
        }
      }
    }
    let validRecord = "";
    if (document.getElementById("ValidCheck").checked == true) {
      validRecord = "Valid";
    }
    else if (document.getElementById("invalidCheck").checked == true) {
      validRecord = "Invalid";
    }

    let params = new URLSearchParams({ Group: GroupId, Station: Station, Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate, Interval: Intervaltype, isAvgData: isAvgData, Units: paramUnitnames, digit: window.decimalDigit, TruncateorRound: window.TruncateorRound, validRecord: validRecord });
    let url = process.env.REACT_APP_WSurl + "api/AirQuality/ExportToExcel?"
    if (GroupId != "") {
      url = process.env.REACT_APP_WSurl + "api/AirQuality/StationGroupingDataExportExcel?"
    }
    window.open(url + params, "_blank");
    document.getElementById('loader').style.display = "none";
    /*  fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  }

  const ReportValidations = function (Station, Pollutent, Fromdate, Todate, Interval, GroupId) {
    let isvalid = true;
    if (GroupId == "" && Station == "") {
      toast.error('Please select group or station', {
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
    } else if (Station != "" && Pollutent == "") {
      toast.error('Please select parameter', {
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
    } else if (Fromdate == "") {
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
  /* reported data end */
  const ChangeGroupName = function (e) {
    let stationParamaters = [];
    let selectedGroup = document.getElementById("groupid").value;
    let headers = [];
    $('.pollutentid')[0].sumo.reload();
    $('.pollutentid')[0].sumo.unSelectAll();
    $('#stationid').val("");
    if (selectedGroup != "") {
      $('#stationid').addClass("disable");
      $('.pollutentid')[0].sumo.disable();
    } else {
      $('#stationid').removeClass("disable");
      $('.pollutentid')[0].sumo.enable();
    }
    setGroupSelected(selectedGroup);
    // setPollutents([]);
    setcriteria([]);
    // setStations([]);

    let filter2 = [];
    let filter1=[];
    let stationID=[];
    if(selectedGroup !=="all"){
      stationID = StationGroups.filter(x => x.groupID == selectedGroup).map(a => a.stationID);
      var finalstationID = stationID.filter(function (item, pos) {
        return stationID.indexOf(item) == pos;
      });
      filter1 = StationGroups.filter(x => x.groupID == selectedGroup && finalstationID.includes(x.stationID)).map(a => a.parameterID);
      for (let i = 0; i < finalstationID.length; i++) {
        let parameters = StationGroups.filter(x => x.stationID == finalstationID[i] && x.groupID == selectedGroup).map(a => a.parameterID);
        let station = Stations.filter(x => x.id == finalstationID[i]);
        let obj = { title: station.length > 0 ? station[0].stationName : "", colspan: parameters.length };
        headers.push(obj);
        for (let j = 0; j < parameters.length; j++) {
          let value1=AllLookpdata.listPollutents.filter(x => x.stationID == finalstationID[i] && x.id == parameters[j]);
          let value = value1.length>0?value1[0].parameterName:"";
          filter2.push(value + "@_" + finalstationID[i]);
        }
      }
    }
    else{
      stationID = Stations.map(a => a.id);
      var finalstationID = stationID.filter(function (item, pos) {
        return stationID.indexOf(item) == pos;
      });
      for (let i = 0; i < finalstationID.length; i++) {
        let parameters = AllLookpdata.listPollutents.filter(x => x.stationID == finalstationID[i]).map(a => a.id);
        let station = Stations.filter(x => x.id == finalstationID[i]);
        let obj = { title: station.length > 0 ? station[0].stationName : "", colspan: parameters.length };
        headers.push(obj);
        for (let j = 0; j < parameters.length; j++) {
          let value1=AllLookpdata.listPollutents.filter(x => x.stationID == finalstationID[i] && x.id == parameters[j]);
          let value = value1.length>0?value1[0].parameterName:"";
          filter2.push(value + "@_" + finalstationID[i]);
        }
      }
    }


    // let stationID = StationGroups.filter(x => x.groupID == selectedGroup).map(a => a.stationID);
    // var finalstationID = stationID.filter(function (item, pos) {
    //   return stationID.indexOf(item) == pos;
    // });
    // let filter1 = StationGroups.filter(x => x.groupID == selectedGroup && finalstationID.includes(x.stationID)).map(a => a.parameterID);
    // let filter2 = [];
    // for (let i = 0; i < finalstationID.length; i++) {
    //   let parameters = StationGroups.filter(x => x.stationID == finalstationID[i] && x.groupID == selectedGroup).map(a => a.parameterID);
    //   let station = Stations.filter(x => x.id == finalstationID[i]);
    //   let obj = { title: station.length > 0 ? station[0].stationName : "", colspan: parameters.length };
    //   headers.push(obj);
    //   for (let j = 0; j < parameters.length; j++) {
    //     let value1 = AllLookpdata.listPollutents.filter(x => x.stationID == finalstationID[i] && x.id == parameters[j]);
    //     let value = value1.length > 0 ? value1[0].parameterName : "";
    //     filter2.push(value + "@_" + finalstationID[i]);
    //   }
    // }
    if (filter2.length < 10) {
      let obj = { title: "", colspan: 10 - filter2.length };
      headers.push(obj);
    }
    //  console.log(filter2);
    setSelectedPollutents(filter2);
    setNestedheaders(headers);
    // let filter2 = AllLookpdata.listPollutents.filter(obj => stationID.includes(obj.stationID) && filter1.includes(obj.parameterID)).map(a => a.parameterName);
    // setSelectedPollutents(filter2);
    // let finaldata = AllLookpdata.listPollutentsConfig.filter(obj => obj.stationID == stationID && obj.parameterName == e.target.value);
    let finaldata = AllLookpdata.listPollutents.filter(obj => stationID.includes(obj.stationID) || filter1.includes(obj.id));
    if (finaldata.length > 0) {
      let finalinterval = [];
      for (let j = 0; j < finaldata.length; j++) {
        let intervalarr = finaldata[j].serverAvgInterval == null ? [] : finaldata[j].serverAvgInterval.split(',');
        for (let i = 0; i < intervalarr.length; i++) {
          if (intervalarr[i] != null) {
            let intervalsplitarr = intervalarr[i].split('-');
            let index = finalinterval.findIndex(x => x.value === intervalsplitarr[0] && x.type === intervalsplitarr[1]);
            if (index == -1) {
              finalinterval.push({ value: intervalsplitarr[0], type: intervalsplitarr[1] })
            }
          }
        }
      }
      setcriteria(finalinterval);
    }
  }
  const ChangeStation = function (e) {
    setPollutents([]);
    setcriteria([]);
    document.getElementById("groupid").value = "";
    if (e.target.value != "") {
      $('#groupid').addClass("disable");
    } else {
      $('#groupid').removeClass("disable");
    }
    let finaldata = AllLookpdata.listPollutents.filter(obj => obj.stationID == e.target.value);
    setPollutents(finaldata);
    setTimeout(function () {
      $('.pollutentid')[0].sumo.reload();
    }, 10);
  }
  $('#stationid').change(function (event) {
    setPollutents([]);
    setcriteria([]);
    let filter = $(this).val();
    setselectedStations(filter);
    let finaldata = AllLookpdata.listPollutents.filter(function (item) {
      for (var i = 0; i < filter.length; i++) {
        if (item['stationID'] == filter[i])
          return true;
      }
    });
    var finaldata1 = [];
    if (filter.length >= 2) {
      finaldata1 = finaldata.reduce((unique, o) => {
        if (!unique.some(obj => obj.stationID != o.stationID && obj.pollutentName === o.pollutentName)) {
          unique.push(o);
        }
        return unique;
      }, []);
    } else {
      finaldata1 = finaldata;
    }
    setPollutents(finaldata1);
    setTimeout(function () {
      // $('.pollutentid')[0].sumo.unSelectAll(); 
      $('.pollutentid')[0].sumo.reload();
    }, 10);
  })
  const Changepollutent = function (e) {
    setcriteria([]);
    console.log(selectedStations);
    let stationID = document.getElementById("stationid").val();
    let finaldata = AllLookpdata.listPollutents.filter(obj => obj.stationID == stationID && obj.parameterName == e.target.value);
    if (finaldata.length > 0) {
      let finalinterval = [];
      let intervalarr = finaldata[0].serverAvgInterval.split(',');
      for (let i = 0; i < intervalarr.length; i++) {
        let intervalsplitarr = intervalarr[i].split('-');
        finalinterval.push({ value: intervalsplitarr[0], type: intervalsplitarr[1] })
      }
      let finalinterval1 = finalinterval.reduce((unique, o) => {
        if (!unique.some(obj => obj.value != o.value && obj.type === o.type)) {
          unique.push(o);
        }
        return unique;
      }, []);
      setcriteria(finalinterval1);
    }
  }
  $('#pollutentid').change(function (e) {
    setcriteria([]);
    let stationID = $("#stationid").val();
    let filter1 = $(this).val();

    // let finaldata = AllLookpdata.listPollutentsConfig.filter(obj => obj.stationID == stationID && obj.parameterName == e.target.value);
    //let finaldata = AllLookpdata.listPollutentsConfig.filter(obj => stationID.includes(obj.stationID) || filter1.includes(obj.parameterName));
    let finaldata = AllLookpdata.listPollutents.filter(obj => stationID.includes(obj.stationID) || filter1.includes(obj.parameterName));
    if (finaldata.length > 0) {

      let finalinterval = [];

      for (let j = 0; j < finaldata.length; j++) {

        let intervalarr = finaldata[j].serverAvgInterval == null ? [] : finaldata[j].serverAvgInterval.split(',');

        for (let i = 0; i < intervalarr.length; i++) {

          let intervalsplitarr = intervalarr[i].split('-');

          let index = finalinterval.findIndex(x => x.value === intervalsplitarr[0] && x.type === intervalsplitarr[1]);

          if (index == -1) {

            finalinterval.push({ value: intervalsplitarr[0], type: intervalsplitarr[1] })

          }

        }

      }

      setcriteria(finalinterval);
    }
  })
  const Resetfilters = function () {
    $('.pollutentid')[0].sumo.reload();
    $('.pollutentid')[0].sumo.unSelectAll();
    // $('.stationid')[0].sumo.reload();
    // $('.stationid')[0].sumo.unSelectAll();
    setcriteria([]);
    setToDate(new Date());
    setFromDate(new Date());
    setListReportData([]);
    setSelectedPollutents([]);
    setLoadjsGridData(false);
  }

  /* Chart Start */
  const getchartdata = function (data, pollutent, charttype, criteria) {
    /* if (chartRef.current != null) {
      chartRef.current.data = {};
    } */

    /*  setChartData({ labels: [], datasets: [] });*/
    setChartOptions({});
    let visibleRecords = Visiblerecords();
    let datasets = [];
    let chartdata = [];
    let tempdata = [];
    let NinetyEightPercentile = [];
    let FiftyPercentile = [];
    let labels = [];
    let NinetyEightPercentileValue = 0;
    let FiftyPercentileValue = 0;
    let MaxVal = 0;
    let pointRadius = [];
    let xAxislabel = [];
    let Scaleslist = {};
    for (let i = 0; i < pollutent.length; i++) {
      chartdata = [];
      pointRadius = [];
      NinetyEightPercentile = [];
      FiftyPercentile = [];
      // let pollutentdata = data[pollutent[i]];
      let Parametersplit = pollutent[i].split("@_")
      let Groupid = document.getElementById("groupid").value;
      let pollutentdata = [];
      let Stationlist = Stations.filter(x => x.id == Parametersplit[1]);
      let Stationname = Stationlist.length > 0 ? Stationlist[0].stationName : "";
      if (Groupid != "") {
        pollutentdata = data.filter(val => val.parameterName.toLowerCase() == Parametersplit[0].toLowerCase() && val.stationID == Parametersplit[1]);
      } else {
        pollutentdata = pollutentdata = data.filter(val => val.parameterName.toLowerCase() == Parametersplit[0].toLowerCase());
      }

      for (let k = 0; k < pollutentdata.length; k++) {
        let index = labels.indexOf(pollutentdata[k].interval);
        if (index == -1) {
          labels.push(pollutentdata[k].interval)
        }
        chartdata.push({ x: pollutentdata[k].interval, y: pollutentdata[k].parametervalue });
        pointRadius.push(2);
      }
      let chartele=chartRef.current?.options?.scales[Parametersplit[1] + "_" + Parametersplit[0]];

      if (charttype == 'line') {
        Scaleslist[Parametersplit[1] + "_" + Parametersplit[0]] = {
          type: 'linear',
          display: chartele?.display==undefined?true:chartele?.display,
          position: chartele?.position?chartele.position:i % 2 === 0 ? 'left' : 'right',
          title: {
            display: true,
            text: Stationname != "" ? Stationname + " - " + Parametersplit[0] : Parametersplit[0]
          }
        }
        datasets.push({ label: Stationname != "" ? Stationname + " - " + Parametersplit[0] : Parametersplit[0], yAxisID: Parametersplit[1] + "_" + Parametersplit[0], data: chartdata, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]), pointRadius: pointRadius, spanGaps: false, })
      }
    }

    Scaleslist["x"] = {
      type: 'time',
      /* time: {
        unit: 'minutes',
        stepSize: 'auto',
        displayFormats: {
          minutes: 'YYYY-MM-DD HH:mm'
        }
      } */
    };
    /*   setChartOptions({
        responsive: true,
        dragData: true,
        onDragStart: function (e) {
          console.log(e)
        },
        onDrag: function (e, datasetIndex, index, value) {
          console.log(datasetIndex, index, value)
        },
      
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
          },
        },
      }); */

    setChartOptions({
      responsive: true,
      scales: Scaleslist,
      // maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          onClick: function (event, legendItem) {
            let chart = chartRef.current;
            const datasetIndex = legendItem.datasetIndex;
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.hidden = !meta.hidden;

            const yAxisID = chart.data.datasets[datasetIndex].yAxisID;
            const allHidden = chart.options.scales[yAxisID].display;

            if (allHidden) {
              chart.options.scales[yAxisID].display = false;
            } else {
              chart.options.scales[yAxisID].display = true;
            }
            // Determine the visible y-axes
            const visibleAxes = Object.keys(chart.options.scales).filter((axis) => {
              if(axis !='x'){
                return chart.options.scales[axis].display;
              }
            });

            // Update the positions of the visible y-axes
           // const numVisibleAxes = visibleAxes.length;
           // const yAxisPositions = ['left', 'right']; // Modify if needed

            visibleAxes.forEach((axis, index) => {
              chart.options.scales[axis].position = index % 2 === 0 ? 'left' : 'right';
            });
            // Update the chart to reflect the visibility changes
            chart.update();
          },
        },
        title: {
          display: true,
        },
        annotation: {
          events: ["click"],
          annotations: [
            {
              type: 'box',
              id: 'dragabbleAnnotation',
              mode: 'vertical',
              drawTime: 'afterDraw',
              xScaleID: 'x',
              yScaleID: '1_SO2',
              /* xMin: '2023-06-01 00:00',
               xMax: '2023-06-01 2:15',
                yMin: 0,
               yMax: 2, */
              xMin: Getminvalue(visibleRecords, "Date"),
              xMax: Getmaxvalue(visibleRecords, "Date"),
              yMin: Getminvalue(visibleRecords, ""),
              yMax: Getmaxvalue(visibleRecords, ""),
              borderWidth: 2,
              borderColor: 'red',
              backgroundColor: 'rgba(255,0,0,0.2)',
            },
          ],
        },
      },
    });

    setTimeout(() => {

      setChartData({
        // labels,
        datasets: datasets
      })
    }, 10);
  }
  /* Chart End */

  return (
    <main id="main" className="main" >
      {/* Same as */}
      {/* <section className="section grid_section h100 w100">
        <div className="h100 w100"> */}
      <div className="modal fade zoom dashboard_dmodal" id="historymodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Parameter History</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table align-middle table-bordered">
                  <thead>
                    <tr className="header_active">
                      <th>Parameter Name</th>
                      <th>Old Value </th>
                      <th>New Value</th>
                      <th>Modified By</th>
                      <th>Modified On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ListHistory && (
                      ListHistory.map((x, y) =>
                        <tr className="body_active">
                          <td>{AllLookpdata.listPollutents.filter(z => z.id == x.parameterID)[0].parameterName}</td>
                          <td>{x.parameterValueOld}</td>
                          <td>{x.parameterValueNew}</td>
                          <td>{x.modifiedBy}</td>
                          <td>{x.modifiedOn != null ? generateDatabaseDateTime(x.modifiedOn) : x.modifiedOn}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div>
          <div>
            <div className="row">
              <div className="col-md-2">
                <label className="form-label">Group Name</label>
                <select className="form-select" id="groupid" onChange={ChangeGroupName}>
                  <option value="" selected>None</option>
                  <option value="all">All Stations</option>
                  {Groups.map((x, y) =>
                    <option value={x.groupID} key={y} >{x.groupName}</option>
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Station Name</label>
                <select className="form-select stationid" id="stationid" onChange={ChangeStation}>
                  <option value="" selected> Select Station</option>
                  {Stations.map((x, y) =>
                    <option value={x.id} key={y} >{x.stationName}</option>
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Parameters</label>
                <select className="form-select pollutentid" id="pollutentid" multiple="multiple" onChange={Changepollutent}>
                  {/* <option selected> Select Pollutents</option> */}
                  {Pollutents.map((x, y) =>
                    <option value={x.parameterName} key={y} >{x.parameterName}</option>
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">From Date</label>
                <DatePicker className="form-control" id="fromdateid" selected={fromDate} onChange={(date) => setFromDate(date)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">To Date</label>
                <DatePicker className="form-control" id="todateid" selected={toDate} onChange={(date) => setToDate(date)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Interval</label>
                <select className="form-select" id="criteriaid">
                  <option value="" selected>Select Interval</option>
                  <option value="15-M" selected>15-M</option>
                  {Criteria.map((x, y) =>
                    <option value={x.value + '-' + x.type} key={y} >{x.value + '-' + x.type}</option>
                  )}
                </select>
              </div>
              <div className="row my-4">
                <div class="col-md-2">
                  <button type="button" className="btn btn-primary" onClick={getdatareport}>GetData</button>
                  <button type="button" className="btn btn-primary mx-1" onClick={Resetfilters}>Reset</button>
                </div>
                {ListReportData != 0 && (
                  <div class="col-md-6">

                    <div class="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="ValidCheck">
                        Valid Records
                      </label>
                      <input className="form-check-input" type="checkbox" id="ValidCheck" />
                    </div>
                    <div class="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="invalidCheck">
                        Invalid Records
                      </label>
                      <input className="form-check-input" type="checkbox" id="invalidCheck" />
                    </div>
                    <button type="button" className="btn btn-primary datashow me-4" onClick={DownloadExcel}>Download Excel</button>
                  </div>
                )}

              </div>
              <div className="col-md-4">
                <div className="row">
                  <div id="loader" className="loader"></div>
                </div>
              </div>

            </div>
            {ListReportData.length > 0 && (
              <div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    {AllLookpdata.listFlagCodes.map((i) =>
                      <button type="button" className="btn btn-primary flag mx-1" style={{ backgroundColor: i.colorCode }} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" data-bs-title={i.name}>{i.code}</button>
                    )}
                  </div>
                </div>


                <div className="jsGrid" ref={jspreadRef} data={ListReportData} />
              </div>
            )}

            {ListReportData.length == 0 && LoadjsGridData && (
              <div class="nodatamessage" id="nodatamessage">No data found</div>
            )}
            {ListReportData.length > 0 && ChartData && (
              <div >
                <Line ref={chartRef} options={ChartOptions} data={ChartData} height={120} />
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
export default HistoricalData;