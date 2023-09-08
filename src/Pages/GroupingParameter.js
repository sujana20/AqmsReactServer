import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import CommonFunctions from "../utils/CommonFunctions";
function Grouping() {
    const $ = window.jQuery;
    const gridRefjsgridreport = useRef();
    const [ListGrouping, setListGrouping] = useState([]);
    const [Listparameters, setListparameters] = useState([]);
    const [ListStationGroups, setListStationGroups] = useState([]);
    const [GroupList, setGroupList] = useState(true);
    const [parentvalues,setparentvalues]=useState([]);   
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]); 
    const [Status,setStatus]=useState(true);
    const [GroupId, setGroupId] = useState(0);
    const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
    const [checkedStationValues, setcheckedStationValues] = useState([]);

    var dataForGrid = [];
    let station = null;
    const jspreadRef = useRef(null);


    const GetparametersLookup = function () {
        fetch(CommonFunctions.getWebApiUrl()+ "api/AirQuality/GetAllLookupData", {
          method: 'GET',
        }).then((response) => response.json())
          .then((data) => {
            if (data) { 
              setListparameters(data.listPollutents);
              setListStationGroups(data.listStationGroups);
              getrequiredValues(data.listStations,data.listPollutents);       
            }
          }).catch((error) => toast.error('Unable to get the parameters list. Please contact adminstrator'));
    }
    useEffect(() => {
        initializeJsGrid();
    });
    // useEffect(() => {
    //     getrequiredValues();
    // }, [ListStations,Listparameters])
    useEffect(() => {
        GetparametersLookup();
    }, [])
    const initializeJsGrid = function () {
      dataForGrid = [];
      ListStationGroups.filter(function(item){
        var i = dataForGrid.findIndex(x => (x.groupID == item.groupID ));
        if(i <= -1){
          dataForGrid.push(item);
        }
        return null;
      });
      //console.log(resArr)



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
            //data: ListStationGroups,
            data: dataForGrid,
            loadData: function (filter) {              
              
              $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
              $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
              return $.grep(this.data, function (item) {                
                
                
                return ((!filter.groupID || item.groupID.toString() === filter.groupID)
                  && (!filter.groupName || item.groupName.toUpperCase().indexOf(filter.groupName.toUpperCase()) >= 0)
                );
              });
            }
          },
          fields: [
            { name: "groupID", title: "ID", type: "text" },
            { name: "groupName", title: "Group Name", type: "text" },
            {
              type: "control", width: 100, editButton: false, deleteButton: false,
              itemTemplate: function (value, item) {
                var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
                  .click(function (e) {
                    EditGroup(item);
                    e.stopPropagation();
                  });
    
                var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
                  .click(function (e) {
                    DeleteGroup(item);
                    e.stopPropagation();
                  });
    
                return $("<div>").append($customEditButton).append($customDeleteButton);
              } 
            },
          ]
        });
    }

    const getrequiredValues=function(ListStations,Listparameters){
      var parent=[];
      var children=[];
      for(var i=0;i<ListStations.length;i ++){
        children=[];
        for(var j=0;j<Listparameters.length;j++){               
          if(ListStations[i].id==Listparameters[j].stationID){
            children.push({ value: ListStations[i].id +"-"+ Listparameters[j].id, label: Listparameters[j].parameterName});
          }                
        }
        parent.push({ value: ListStations[i].id, label: ListStations[i].stationName, children: children });
      }
      console.log(parent);
      setparentvalues(parent);
    }

    const Groupingaddvalidation = function (groupname,checked) {
      let isvalid = true;
      let form = document.querySelectorAll('#Groupingform')[0];
      if (groupname == "") {
        //toast.warning('Please enter Station Name');
        form.classList.add('was-validated');
        isvalid = false;
      } 
      else if (checked.length == 0) {
        //toast.warning('Please enter Descriptin');
        toast.error('Please Select at least one Parameter');
        form.classList.add('was-validated');
        isvalid = false;
      }
      return isvalid;
    }

    const Groupadd = function(){
      setcheckedStationValues([]);
      setChecked([]);
      var groupname=document.getElementById("groupnamevalue").value;      
      var parameterArray=[];
      for(var u=0;u<checkedStationValues.length;u++){
        var parameter= checkedStationValues[u].split("-");
        parameterArray.push({GroupName: groupname, StationID :parameter[0], ParameterID: parameter[1], CreatedBy:currentUser.id, ModifiedBy:currentUser.id});
      }
      console.log(parameterArray);      
      let validation = Groupingaddvalidation(groupname,checked);
      if (!validation) {
        return false;
      }
      fetch(CommonFunctions.getWebApiUrl()+ 'api/GroupingAdd', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameterArray),
        //body: JSON.stringify({ GroupID:groupid, GroupName: groupname, StationID: stationvalue, ParameterID:parametervalues, Status:status, CreatedBy:CreatedBy, ModifiedBy:ModifiedBy }),
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson == "Groupadd") {
            toast.success('Group added successfully');
            GetparametersLookup();
            setGroupList(true);
          } else if (responseJson == "Groupexists") {
            toast.error('Group already exist with given Station Name. Please try with another Station Name.');
          } else {
            toast.error('Unable to add the Group. Please contact adminstrator');
          }
        }).catch((error) => toast.error('Unable to add the Group. Please contact adminstrator'));
    }

    const EditGroup = function (param) {
      setGroupList(false);
      setGroupId(param.groupID);
      setTimeout(() => {
        document.getElementById("groupnamevalue").value = param.groupName;

         var parameterArray=[];
        for(var u=0;u<ListStationGroups.length;u++){
          if(ListStationGroups[u].groupID == param.groupID){
            var parameter= ListStationGroups[u].parameterID;
            var station=  ListStationGroups[u].stationID;
            parameterArray.push([station + "-" + parameter]); 
          }
                  
        }
       
        setChecked(parameterArray);
        //setcheckedStationValues([{value: param.stationID+"-"+param.parameterID, isChecked:true }], );
        //document.getElementById("Description").value = param.description;
      }, 100);  
    }

    const UpdateGroup=function(){
      var groupname=document.getElementById("groupnamevalue").value;
           
      var parameterArray=[];
      for(var u=0;u<checked.length;u++){
        var parameter= checked[u].split("-");
        parameterArray.push({GroupID:GroupId, GroupName: groupname, StationID :parameter[0], ParameterID: parameter[1], CreatedBy:currentUser.id, ModifiedBy:currentUser.id});
      }
      let validation = Groupingaddvalidation(groupname,checked);
      if (!validation) {
        return false;
      }
      fetch(CommonFunctions.getWebApiUrl()+ 'api/GroupingUpdate/' + GroupId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },    
        body: JSON.stringify(parameterArray),   
        //body: JSON.stringify({ GroupID:groupid, GroupName: groupname, StationID: stationvalue, ParameterID:parametervalues, Status:status, CreatedBy:CreatedBy, ModifiedBy:ModifiedBy }),
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson == 1) {
            toast.success('Group updated successfully');
            GetparametersLookup();
            setGroupList(true);
            setcheckedStationValues([]);
            setChecked([]);
          } else if (responseJson == 2) {
            toast.error('Group already exist with given Group Name. Please try with another Group Name.');
          } else {
            toast.error('Unable to update the Group. Please contact adminstrator');
          }
        }).catch((error) => toast.error('Unable to update the Group. Please contact adminstrator'));
    }

    const DeleteGroup = function (item) {
      Swal.fire({
        title: "Are you sure?",
        text: ("You want to delete this parameter !"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5cb85c",
        confirmButtonText: "Yes",
        closeOnConfirm: false
      })
        .then(function (isConfirm) {
          if (isConfirm.isConfirmed) {
            let id = item.groupID;
            fetch(CommonFunctions.getWebApiUrl()+ 'api/DeleteGrouping/' + id, {
              method: 'DELETE'
            }).then((response) => response.json())
              .then((responseJson) => {
                if (responseJson == 1) {
                  toast.success('Group deleted successfully')
                  GetparametersLookup();
                } else {
                  toast.error('Unable to delete Group. Please contact adminstrator');
                }
              }).catch((error) => toast.error('Unable to delete Group. Please contact adminstrator'));
          }
        });
    }

    const handleCheck = (checked) => {
      setcheckedStationValues(checked);
      setChecked(checked);
    };
    
    const handleExpand = (expanded) => {
        setExpanded(expanded);
    };
    

    const AddGroupchange = function (param) {
        if (param) {
            setGroupList(true);
        } else {
            setChecked([]);
            setGroupList(false);
            setGroupId(0);
        }
    }

    return (
        <main id="main" className="main" >
          <div className="container">
            <div className="pagetitle">
                {!GroupList && GroupId==0 && (
                    <h1>Add Group</h1>
                )}
                {!GroupList && GroupId!=0 && (
                    <h1>Update Group</h1>
                )}
                {GroupList && (
                    <h1>Group List</h1>
                )}
            </div>
            <section className="section">
              <div className="container mt-3">
                <div className="me-2 mb-2 float-end">
                    {GroupList && (
                        <span className="operation_class mx-2" onClick={() => AddGroupchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                    )}
                    {!GroupList && (
                        <span className="operation_class mx-2" onClick={() => AddGroupchange('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
                    )}
                </div>
                {!GroupList && (
                  <form id="Groupingform" className="row">
                    <div className="col-md-12 mb-3">
                      <label for="groupname" className="form-label">Group Name:</label>
                      <input type="text" className="form-control" id="groupnamevalue" placeholder="Enter Group name" required />
                      <div class="invalid-feedback">Please enter Group name</div>
                    </div> 
                    <div>                        
                        <label for="stationparameterlist" className="form-label">Station Parameter List :</label>
                            <CheckboxTree 
                                nodes={parentvalues}
                                //nodes={nodes}
                                checked={checked}
                                expanded={expanded}
                                onCheck={handleCheck}
                                onExpand={handleExpand}
                            />    
                    </div>
                    {/* {parentvalues.length > 0 &&(
                        <div>                        
                            <label for="stationparameterlist" className="form-label">Station Parameter List :</label>
                            <CheckboxTree
                                //nodes={parentvalues}
                                nodes={nodes}
                                checked={checked}
                                expanded={expanded}
                                onCheck={handleCheck}
                                onExpand={handleExpand}
                            />    
                        </div>
                    )} */}
                    <div className="col-md-12 text-center">
                        {!GroupList && GroupId==0 && (
                            <button className="btn btn-primary" onClick={Groupadd} type="button">Add Group</button>
                        )}
                        {!GroupList && GroupId!=0 && (
                           <button className="btn btn-primary" onClick={UpdateGroup}  type="button">Update Group</button>
                        )}
                    </div>                  
                  </form>               
                )}
                {GroupList && (
                  <div className="jsGrid" ref={gridRefjsgridreport} />
                )}
              </div>
    
            </section>
    
          </div>
        </main>
    );
}
export default Grouping;