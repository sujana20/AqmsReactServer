
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import * as echarts from 'echarts';
import DatePicker from "react-datepicker";
import CommonFunctions from "../utils/CommonFunctions";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

function WindRosecomp() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [Stations, setListStations] = useState([]);
  const chartRef = useRef();
  const [Isdownlaod, setIsdownlaod] = useState(false);
  //const $ = window.jQuery;
  useEffect(() => {
    GetStation();
   
  }, []); // Empty dependency array ensures this effect runs once when the component mounts
  const GetStation = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/Stations", {
      method: 'GET',
      headers: authHeader ,
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListStations(data);
        }
      }).catch((error) => toast.error('Unable to get the Stations list. Please contact adminstrator'));
  }
  const ReportValidations = function (Station, Fromdate, Todate) {
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
    }
    return isvalid;
  }
  const GenarateReport= async function(){
    setIsdownlaod(false);
    let StationID = document.getElementById("stationid").value;
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let valid = ReportValidations(StationID,Fromdate, Todate);
    if (!valid) {
      return false;
    }
    document.getElementById('loader').style.display = "block";
    let params = new URLSearchParams({StationID: StationID, FromDate: Fromdate, ToDate: Todate});
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/AirQuality/getWindRose?"+params, {
      method: 'GET',
      headers: authHeader ,
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          let count = 0;
          let counter = 0;
          let counter1 = 10;
          let finalrange1=[];
          let finalrange2=[];
          let finalrange3=[];
          let finalrange4=[];
          while (counter1 <= 360) {

             let filteredData =  data?.filter(obj => obj.wd > counter && obj.wd <=counter1);
             let filteredData1,filteredData2,  filteredData3,  filteredData4;
             let Percentage1, Percentage2, Percentage3, Percentage4;
                if(filteredData?.length > 0){
                  filteredData1 =  filteredData?.filter(obj => obj.ws > 0 && obj.ws <= 2.0);  
                  filteredData2 =  filteredData?.filter(obj => obj.ws > 2.1 && obj.ws <= 4.0);
                  filteredData3 =  filteredData?.filter(obj => obj.ws > 4.1 && obj.ws <= 6.0);
                  filteredData4 =  filteredData?.filter(obj => obj.ws > 6.1 && obj.ws <= 30);
                  Percentage1=filteredData1?.length>0?((filteredData1.length / data.length) * 100).toFixed(2):0;
                  Percentage2=filteredData2?.length>0?((filteredData2.length / data.length) * 100).toFixed(2):0;
                  Percentage3=filteredData3?.length>0?((filteredData3.length / data.length) * 100).toFixed(2):0;
                  Percentage4=filteredData4?.length>0?((filteredData4.length / data.length) * 100).toFixed(2):0;
                }else{
                  Percentage1=0;
                  Percentage2=0;
                  Percentage3=0;
                  Percentage4=0;
                }
                finalrange1.push(Percentage1);
                finalrange2.push(Percentage2);
                finalrange3.push(Percentage3);
                finalrange4.push(Percentage4);
             
              counter += 10;
              counter1 += 10;
             // console.log(filteredData);
          }
         // setrange1(finalrange1);
         // setrange2(finalrange2);
         // setrange3(finalrange3);
         // setrange4(finalrange4);
          showwindrose(finalrange1,finalrange2,finalrange3,finalrange4);
          document.getElementById('loader').style.display = "none";
        }
      }).catch((error) => {
        document.getElementById('loader').style.display = "none";
        console.log("error: ", error);
      });
  }
 const showwindrose = function(finalrange1,finalrange2,finalrange3,finalrange4){
  const chartDom = document.getElementById('radar');
  const myChart = echarts.init(chartDom);

  const option = {
    angleAxis: {
      type: 'category',
      data: ["N", "", "", "NNE", "", "", "NEE", "", "", "E", "", "", "SEE", "", "", "SSE", "", "", "S", "", "", "SSW", "", "", "SWW", "", "", "W", "", "", "NWW", "", "", "NNW", "", ""],
      splitLine: {
        show: true, // Show radar lines for angle axis labels
        lineStyle: {
          type: 'dashed', // You can also use 'solid' or other line types
          color: '#aaa', // Customize the color of the radar lines
        },
      },
      axisLabel: {
        show: true, // Show axis labels
        fontSize: 12, // Adjust font size as needed
        interval: 2,
      },
      
    },
    radiusAxis: {
      splitLine: {
      lineStyle: {
        color: '#aaa', // Customize the color of the radar lines
        type: 'solid', // You can also use 'solid' or other line types
      },
    },
    axisLine: {
      show: false, // Set to true if you want the axis line to be visible
    },
  },
  polar: {
    startAngle: 0, // Set the start angle to 0 degrees
  },
    /*tooltip: {
      show: true,
      formatter: 'wind speed {a}: {c}',
    },*/
    tooltip: {
      show: true,
      formatter: function(params) {
        // Use {a} to display the legend name, and {b} to display the axis label
        return params.name + '<br> wind speed ' + params.seriesName + "<br> percentage : " +params.value;
      },
    },
    series: [
      {
        type: 'bar',
        data: finalrange1,
        coordinateSystem: 'polar',
        name: '0-2.0 m/s',
        stack: 'a',
        emphasis: {
          focus: 'series',
        },
      },
      {
        type: 'bar',
        data: finalrange2,
        coordinateSystem: 'polar',
        name: '2.1-4 m/s',
        stack: 'a',
        emphasis: {
          focus: 'series',
        },
      },
      {
        type: 'bar',
        data: finalrange3,
        coordinateSystem: 'polar',
        name: '4.1-6 m/s',
        stack: 'a',
        emphasis: {
          focus: 'series',
        },
      },
      {
        type: 'bar',
        data: finalrange4,
        coordinateSystem: 'polar',
        name: '6.1-30 m/s',
        stack: 'a',
        emphasis: {
          focus: 'series',
        },
      },
    ],
    legend: {
      show: true,
      /*right: 10, // Adjust the right property to move the legend closer or further from the right edge
      top: 'middle', // Vertically center the legend
      orient: 'vertical', // Display legend items vertically
      itemStyle: {
        borderRadius: 0,
      },*/
      data: ['0-2.0 m/s', '2.1-4 m/s', '4.1-6 m/s','6.1-30 m/s'],
    },
  };

  option && myChart.setOption(option);
  setIsdownlaod(true);
  // Clean up the chart when the component unmounts
  return () => {
    myChart.dispose();
  };
 }

 const DownloadPng=function() {
  const chartElement = chartRef.current;
  html2canvas(chartElement, {
    backgroundColor: 'white', // Set null to preserve the original chart background color
  }).then((canvas) => {
    const image = canvas.toDataURL('image/png');

    // Create a download link and trigger click event
    const downloadLink = document.createElement('a');
    downloadLink.href = image;
    downloadLink.download = 'windrosechart.png';
    downloadLink.click();
  });
  /* var a = document.createElement('a');
  a.href = chartRef.current.toBase64Image();
  a.download = 'chart.png';
  a.click(); */
  return;
}

const DownloadPdf = () => {
const chartElement = chartRef.current;
  html2canvas(chartElement, {
    backgroundColor: 'white', // Set null to preserve the original chart background color
  }).then((canvas) => {
  const chartImage = canvas.toDataURL('image/png');

  // Create a PDF using jsPDF
  const pdf = new jsPDF();
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(chartImage, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('windrosechart.pdf');
});
};
 
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
                    <option value="" selected> Select Station Name</option>
                      {Stations.map((x, y) =>
                        <option value={x.id} key={y}>{x.stationName}</option>
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

                  <div className="col  mt-4">
                    <button type="button" className="btn btn-primary" onClick={GenarateReport}>Generate Report</button>

                  
                  </div>
                 
                </div>
              </div>
            </div>
            <div className="mt-5"> 
              <div className="col-md-4">
                    <div className="row">
                      <div id="loader" className="loader"></div>
                    </div>
                  </div>
          <div ref={chartRef} id="radar" style={{ width: '100%', height: '400px' }}>
            </div>;
            {Isdownlaod &&(
            <div className="text-center">
                <button type="button" className="btn btn-primary mx-1"  onClick={DownloadPng}>Download as Image</button>
                <button type="button" className="btn btn-primary mx-1"  onClick={DownloadPdf}>Download as Pdf</button>
                </div>
                )}
            </div>
          </div>

        </section>
    </main>
  );
}
export default WindRosecomp;