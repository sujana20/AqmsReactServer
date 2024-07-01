
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";

function AddDevice() { 
  // 
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListStations, setListStations] = useState([]);
  const [ListDevices, setListDevices] = useState([]);
  const [DeviceList, setDeviceList] = useState(true);
  const [ListDeviceModels, setListDeviceModels] = useState([]);
  const [Deviceid, setDeviceid] = useState(0);
  const [Status, setStatus] = useState(true);
  const [ServiceMode, setServiceMode] = useState(true);
  const [Enable, setEnable] = useState(true);
  const [Type, setType] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));

  const Deviceaddvalidation = function (StationID, DeviceName, DeviceModel, IPAddress, Port, Type, Number) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddDeviceform')[0];
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const Deviceadd = function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceName = document.getElementById("devicename").value;
    let DeviceModel = document.getElementById("devicemodel").value;
    let deviceId = document.getElementById("deviceid").value;
    let IPAddress = "";
    let Port = "";
    let CommPort = "";
    let BaudRate = "";
    let Parity = "";
    let StopBits = "";
    let DataBits = "";
    let SerialRtuMode = "";
    let Type = document.getElementById("type").value;
    if (Type == 'Tcp/IP') {
      IPAddress = document.getElementById("ipaddress").value;
      Port = document.getElementById("port").value;
    } else if (Type == 'Serial') {
      CommPort = document.getElementById("commport").value;
      BaudRate = document.getElementById("baudrate").value;
      Parity = document.getElementById("parity").value;
      StopBits = document.getElementById("stopbits").value;
      DataBits = document.getElementById("databits").value;
      SerialRtuMode = document.getElementById("serialrtumode").checked;
    }
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let servicemode=ServiceMode?1:0;
    let enable=Enable?1:0;
    let validation = Deviceaddvalidation(StationID, DeviceName, DeviceModel, IPAddress, Port, Type);
    if (!validation) {
      return false;
    }
    fetch(CommonFunctions.getWebApiUrl() + 'api/Devices', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        StationID: StationID, DeviceName: DeviceName, DeviceModel: DeviceModel, DeviceId: deviceId, IPAddress: IPAddress, Port: Port, Type: Type,
        CommPort: CommPort, BaudRate: BaudRate, Parity: Parity, StopBits: StopBits, DataBits: DataBits,ServiceMode:servicemode,
        SerialRtuMode: SerialRtuMode, Status: status, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy,IsEnable:enable
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Deviceadd") {
          toast.success('Device added successfully');
          GetDevices();
          setDeviceList(true);
        } else if (responseJson == "Deviceexist") {
          toast.error('Device already exist with given Device Name. Please try with another Device Name.');
        } else {
          toast.error('Unable to add the Device. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Device. Please contact adminstrator'));
  }

  

  const UpdateDevice= function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceName = document.getElementById("devicename").value;
    let DeviceModel = document.getElementById("devicemodel").value;
    let deviceId = document.getElementById("deviceid").value;
    let IPAddress = "";
    let Port = "";
    let CommPort = "";
    let BaudRate = "";
    let Parity = "";
    let StopBits = "";
    let DataBits = "";
    let SerialRtuMode = "";
    let Type = document.getElementById("type").value;
    if (Type == 'Tcp/IP') {
      IPAddress = document.getElementById("ipaddress").value;
       Port = document.getElementById("port").value;
    } else if (Type == 'Serial') {
      CommPort = document.getElementById("commport").value;
      BaudRate = document.getElementById("baudrate").value;
      Parity = document.getElementById("parity").value;
      StopBits = document.getElementById("stopbits").value;
      DataBits = document.getElementById("databits").value;
      SerialRtuMode = document.getElementById("serialrtumode").checked;
    }
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let servicemode=ServiceMode?1:0;
    let enable=Enable?1:0;
    let validation = Deviceaddvalidation();
    if (!validation) {
      return false;
    }
    fetch(CommonFunctions.getWebApiUrl()+ 'api/Devices/' + Deviceid, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        StationID: StationID, DeviceName: DeviceName, DeviceModel: DeviceModel, DeviceId: deviceId, IPAddress: IPAddress, Port: Port,
        Type: Type, ID: Deviceid, Status: status, CommPort: CommPort, BaudRate: BaudRate, Parity: Parity, StopBits: StopBits, DataBits: DataBits,
        ServiceMode:servicemode,SerialRtuMode: SerialRtuMode, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy,IsEnable:enable
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Device Updated successfully');
          GetDevices();
          setDeviceList(true);
        } else if (responseJson == 2) {
          toast.error('Device already exist with given Device Name. Please try with another Device Name.');
        } else {
          toast.error('Unable to update the Device. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Device. Please contact adminstrator'));
  }

  
  const GetLookupdata = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/Deviceslookup", {
      method: 'GET',
      headers: authHeader ,
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListStations(data.listStations);
          setListDevices(data.listDevices);
          setListDeviceModels(data.listDeviceModels);
        }
      }).catch((error) => toast.error('Unable to get the Devices lookup list. Please contact adminstrator'));
  }
  const GetDevices = function () {
    fetch(CommonFunctions.getWebApiUrl()+ "api/Devices", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDevices(data);
        }
      }).catch((error) => toast.error('Unable to get the devices list. Please contact adminstrator'));
  }
  useEffect(() => {
    initializeJsGrid();
  });
  useEffect(() => {
    GetLookupdata();
  }, [])
  const initializeJsGrid = function () {
    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: true,
      editing: false,
      inserting: false,
      sorting: true,
      paging: true,
      autoload: true,
      pageSize: 100,
      pageButtonCount: 5,
      controller: {
        data: ListDevices,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-lg border-50 ps-3");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm device-select-control");
          return $.grep(this.data, function (item) {
            return ((!filter.stationName || item.stationName.toUpperCase().indexOf(filter.stationName.toUpperCase()) >= 0)
              && (!filter.stationID || item.stationID === filter.stationID)
              && (!filter.deviceModel || item.deviceModel === filter.deviceModel)
              && (!filter.deviceName || item.deviceName.toUpperCase().indexOf(filter.deviceName.toUpperCase()) >= 0)
              && (!filter.ipAddress || item.ipAddress.toUpperCase().indexOf(filter.ipAddress.toUpperCase()) >= 0)
              && (!filter.port || item.port == filter.port)
              //&& (!filter.port || item.port.toUpperCase().indexOf(filter.port.toUpperCase()) >= 0)
              && (!filter.type || item.type.toUpperCase().indexOf(filter.type.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "serialNumber", title: "S. No.", width: 50, align: "center", sorting: false, 
        itemTemplate: function(_, item, index) { 
          var index = ListDevices.indexOf(item);
          return index + 1; 
        } 
        },
        { name: "stationID", title: "Station Name", type: "select", items: ListStations, valueField: "id", textField: "stationName", width: 200 },
        { name: "deviceName", title: "Device Name", type: "text", align: "center" },
        { name: "deviceModel", title: "Device Model", type: "select", items: ListDeviceModels, valueField: "id", textField: "deviceModelName", width: 200 },
        { name: "ipAddress", title: "IP Address", type: "text", align: "center" },
        { name: "port", title: "Port", type: "text", align: "center" },
        { name: "type", title: "Type", type: "text", align: "center" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
         /*  itemTemplate: function (value, item) {
            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditDevice(item);
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteDevice(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
          } */
        },
      ]
    });
  }
  const AddStationchange = function (param) {
    if (param) {
      setDeviceList(true);
    } else {
      setDeviceList(false);
      setDeviceid(0);
    }
  }
  const DownloadExcel = async function (filetype) {          {/*edited*/}
    
   
  let params = new URLSearchParams({ filetype : filetype });
  let authHeader = await CommonFunctions.getAuthHeader();
  await fetch(CommonFunctions.getWebApiUrl()+ "api/AirQuality/DeviceListExportToExcel?" + params,{
    method: 'GET',
    headers: authHeader ,
  }).then(response => response.blob())
    .then(blob => {
      // Create a link element and trigger a click on it to download the file
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      if(filetype=='excel'){
     link.download = Date.now()+".xlsx";
      }else{
        link.download = Date.now()+".csv";
      }
      link.click();
    })
    .catch(error => console.error('Error:', error));
  document.getElementById('loader').style.display = "none";
   /* fetch(url + params, {
     method: 'GET',
   }).then((response) => response.json())
     .then((data) => {
     }).catch((error) => console.log(error)); */
}
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {DeviceList && (
            <h1>Devices List1</h1>
          )}
        </div>
        <section className="section">
          <div className="container common-table-pd stationList-filter-bg">
            {!DeviceList && (
              <form id="AddDeviceform" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="StationName" className="form-label">Station Name:</label>
                  <select className="form-select" id="stationname" required>
                    <option selected value="">Select station name</option>
                    {ListStations.map((x, y) =>
                      <option value={x.id} key={y} >{x.stationName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select station name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicename" className="form-label">Device Name:</label>
                  <input type="text" className="form-control" id="devicename" placeholder="Enter device name" required />
                  <div class="invalid-feedback">Please enter device name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="deviceid" className="form-label">Device ID:</label>
                  <input type="number" className="form-control" id="deviceid" placeholder="Enter device id" required />
                  <div class="invalid-feedback">Please enter id</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicemodel" className="form-label">Device Model:</label>
                  <select className="form-select" id="devicemodel" required>
                    <option selected value="">Select device model</option>
                    {ListDeviceModels.map((x, y) =>
                      <option value={x.id} key={y} >{x.deviceModelName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select device model</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="type" className="form-label">Type:</label>
                  <select className="form-select" id="type" onChange={(e) => setType(e.target.value)} required>
                    <option selected value="">Select type</option>
                    <option value="Serial"  >Serial</option>
                    <option value="Tcp/IP"  >Tcp/IP</option>
                    <option value="Analog"  >Analog</option>
                    {/*  <option value="modbus"  >Modbus</option> */}
                  </select>
                  <div class="invalid-feedback">Please select type</div>
                </div>
                {Type == 'Serial' && (
                  <div className="row mx-0 px-0">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="commport" className="form-label">Comm Port:</label>
                      <select className="form-select" id="commport" required>
                        {window.CommPort.map((x, y) =>
                          <option value={x}  >{x}</option>
                        )}
                      </select>
                      <div class="invalid-feedback">Please select comm port</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="baudrate" className="form-label">Baud Rate:</label>
                      <select className="form-select" id="baudrate" required>
                        {window.BaudRate.map((x, y) =>
                          <option value={x}  >{x}</option>
                        )}
                      </select>
                      <div class="invalid-feedback">Please select Baud Rate</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="parity" className="form-label">Parity:</label>
                      <select className="form-select" id="parity" required>
                        {window.Parity.map((x, y) =>
                          <option value={x}  >{x}</option>
                        )}
                      </select>
                      <div class="invalid-feedback">Please select parity</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="stopbits" className="form-label">Stop Bits:</label>
                      <select className="form-select" id="stopbits" required>
                        {window.StopBits.map((x, y) =>
                          <option value={x}  >{x}</option>
                        )}
                      </select>
                      <div class="invalid-feedback">Please select stop bits</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="databits" className="form-label">Data Bits:</label>
                      <input type="number" className="form-control" id="databits" placeholder="Enter IP Data Bits" required />
                      <div class="invalid-feedback">Please enter data bits</div>
                    </div>
                    <div className="col-md-6 serialrtumode mb-3 form-check">
                      <input className="form-check-input" type="checkbox" id="serialrtumode" defaultChecked={false} />
                      <label className="form-check-label" htmlFor="serialrtumode">
                        Serial RTU Mode
                      </label>
                    </div>
                  </div>
                )}
                {Type == 'Tcp/IP' && (
                  <div>
                    <div className="col-md-12 mb-3">
                      <label for="ipaddress" className="form-label">IP Address:</label>
                      <input type="text" className="form-control" id="ipaddress" placeholder="Enter IP address" required />
                      <div class="invalid-feedback">Please enter IP address</div>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label for="port" className="form-label">Port:</label>
                      <input type="text" className="form-control" id="port" placeholder="Enter port" required />
                      <div class="invalid-feedback">Please enter port</div>
                    </div>
                  </div>
                )}
                 <div className="col-md-4 mb-3">
                  <label for="Status" className="form-label">Service Mode: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="servicemode" onChange={(e) => setServiceMode(e.target.checked)} defaultChecked={ServiceMode} />
                    {ServiceMode && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">On</label>
                    )}
                    {!ServiceMode && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Off</label>
                    )}
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label for="Status" className="form-label">Enabled: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="enabled" onChange={(e) => setEnable(e.target.checked)} defaultChecked={Enable} />
                    {Enable && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Yes</label>
                    )}
                    {!Enable && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">No</label>
                    )}
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label for="Status" className="form-label">Status: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="Status" onChange={(e) => setStatus(e.target.checked)} defaultChecked={Status} />
                    {Status && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Active</label>
                    )}
                    {!Status && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Inactive</label>
                    )}
                  </div>
                </div>
                <div className="col-md-12 text-center">
                  {!DeviceList && Deviceid == 0 && (
                    <button className="btn btn-primary" onClick={Deviceadd} type="button">Add Device</button>
                  )}
                  {!DeviceList && Deviceid != 0 && (
                    <button className="btn btn-primary" onClick={UpdateDevice} type="button">Update Device</button>
                  )}
                </div>
              </form>
            )}
            {DeviceList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>
        <br></br>
        <div align="center"> {/*edited*/}
        <button type="button" className="btn btn-primary datashow me-0 download-btn" onClick={() => DownloadExcel('excel')} >Download Excel</button>&nbsp; {/*edited*/}
        <button type="button" className="btn btn-primary datashow me-0 download-btn" onClick={() => DownloadExcel('csv')} >Download Csv</button>
        </div>
      </div>
    </main>
  );
}
export default AddDevice;