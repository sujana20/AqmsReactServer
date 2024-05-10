import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import CommonFunctions from "../utils/CommonFunctions";

function UserGroups(){
    const $ = window.jQuery;
    const gridRefjsgridreport = useRef();
    const [GroupList, setGroupList] = useState(true);
    const [GroupId, setGroupId] = useState(0); 
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]); 
    const [ListUserGroup, setListUserGroup] = useState([]);

    


    useEffect(() => {
        initializeJsGrid();
    });
    useEffect(() => {
        GetGroupDetails();
    }, []);

    const GetGroupDetails = async function () {
      let authHeader = await CommonFunctions.getAuthHeader();
        fetch(CommonFunctions.getWebApiUrl()+ "api/UsersGroup", {
          method: 'GET',
          headers: authHeader,
        }).then((response) => response.json())
          .then((data) => {
            if (data) {
                setListUserGroup(data);
            }
          }).catch((error) => toast.error('Unable to get the users list. Please contact adminstrator'));
    }

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
            data: ListUserGroup,
            loadData: function (filter) {
              $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-lg station-width-control");
              $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
              return $.grep(this.data, function (item) {  
                return ((!filter.groupName || item.groupName.toString() === filter.groupName)
                    && (!filter.permissions || item.permissions.toUpperCase() === filter.permissions.toUpperCase())
                  //&& (!filter.permission || item.permissions.toUpperCase().indexOf(filter.permissions.toUpperCase()) >= 0)
                );
              });
            }
          },
          fields: [
            { name: "serialNumber", title: "S. No.", width: 30, align: "center", sorting: false, 
              itemTemplate: function(_, item, index) { 
                var index = ListUserGroup.indexOf(item);
                return index + 1; 
              } 
            },
            { name: "groupName", title: "User Name", type: "text"},
            { name: "permissions", title: "Permission", type: "text",
            itemTemplate: function(value) {
              // Split values by comma and join with line breaks
              var valuesArray = value.split(",");
              var formattedValues = valuesArray.join("<br>");
              return formattedValues;
              }
            },            
            {
              type: "control", width: 100, editButton: false, deleteButton: false,
              itemTemplate: function (value, item) {
                var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
                  .click(function (e) {
                    EditGroup(item);
                    /* alert("ID: " + item.id); */
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

    const Groupingaddvalidation = function (GroupName,checked) {
        let isvalid = true;
        let form = document.querySelectorAll('#UserGroupform')[0];
        if (GroupName == "") {
          //toast.warning('Please enter Station Name');
          form.classList.add('was-validated');
          isvalid = false;
        } 
        else if (checked.length == 0) {
          //toast.warning('Please enter Descriptin');
          toast.error('Please Select at least one Permission');
          form.classList.add('was-validated');
          isvalid = false;
        }
        return isvalid;
    }

    const addusergroup = async function(){
        setChecked([]);
        let GroupName = document.getElementById("usergroupname").value;
        var paramvalues='';
        for(var u=0;u<checked.length;u++){
            if(u==0){
                paramvalues=checked[u];
            }
            else{
                paramvalues += ","+checked[u];
            }            
        }
        let validation = Groupingaddvalidation(GroupName,checked);
        if (!validation) {
            return false;
        }
        let authHeader = await CommonFunctions.getAuthHeader();
        authHeader.Accept='application/json';
        authHeader["Content-Type"]='application/json';
        await fetch(CommonFunctions.getWebApiUrl()+ 'api/AddUsersGroup', {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({ GroupName: GroupName, Permissions: paramvalues }),
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == "Groupadd") {
                toast.success('Group added successfully');
                GetGroupDetails();
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
        setGroupId(param.id);
        setTimeout(() => {
          document.getElementById("usergroupname").value = param.groupName;
  
            var PermissionArray=[];
          for(var u=0;u<ListUserGroup.length;u++){
            if(ListUserGroup[u].id == param.id){
              var paramvales= ListUserGroup[u].permissions;
              var previousvalues=paramvales.split(",");
              
              for(var j=0;j<previousvalues.length;j++){
                PermissionArray.push(previousvalues[j]);
              } 
            }                    
          }  
          var parentnodes=getNodeIds(nodes);
          setExpanded(parentnodes);       
          setChecked(PermissionArray);
        }, 100);  
    }

    const UpdateGroup = async function(){
        var GroupName=document.getElementById("usergroupname").value;             
        var paramvalues='';
        for(var u=0;u<checked.length;u++){
            if(u==0){
                paramvalues=checked[u];
            }
            else{
                paramvalues += ","+checked[u];
            }            
        }
        let validation = Groupingaddvalidation(GroupName,checked);
        if (!validation) {
          return false;
        }
        let authHeader = await CommonFunctions.getAuthHeader();
        authHeader.Accept='application/json';
        authHeader["Content-Type"]='application/json';
        await  fetch(CommonFunctions.getWebApiUrl()+ 'api/UpdateUsersGroup/' + GroupId, {
          method: 'PUT',
          headers: authHeader,  
          body: JSON.stringify({ GroupName: GroupName, Permissions: paramvalues }), 
          //body: JSON.stringify({ GroupID:groupid, GroupName: groupname, StationID: stationvalue, ParameterID:parametervalues, Status:status, CreatedBy:CreatedBy, ModifiedBy:ModifiedBy }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success('Group updated successfully');
              GetGroupDetails();
              setGroupList(true);
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
          text: ("You want to delete this User's Group !"),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#5cb85c",
          confirmButtonText: "Yes",
          closeOnConfirm: false
        })
          .then(async function (isConfirm) {
            if (isConfirm.isConfirmed) {
              let id = item.id;
              let authHeader = await CommonFunctions.getAuthHeader();
              fetch(CommonFunctions.getWebApiUrl()+ 'api/DeleteUsersGroup/' + id, {
                method: 'DELETE',
                headers: authHeader,
              }).then((response) => response.json())
                .then((responseJson) => {
                  if (responseJson == 1) {
                    toast.success('Group deleted successfully')
                    GetGroupDetails();
                  } else {
                    toast.error('Unable to delete Group. Please contact adminstrator');
                  }
                }).catch((error) => toast.error('Unable to delete Group. Please contact adminstrator'));
            }
          });
    }
  
    const nodes=window.nodes;

    
    const handleCheck = (checked) => {
        setChecked(checked);
    };
      
    const handleExpand = (expanded) => {
        setExpanded(expanded);
    };
    function getNodeIds(nodes) {
      let ids = [];    
      nodes.forEach(function({ value, children }) {
        ids = [...ids, value];
      });
      return ids;
    }

    const Addusergroupchange = function (param) {
        if (param) {
            setGroupList(true);
        } else {
          setChecked([]);
          var parentnodes=getNodeIds(nodes);
          setExpanded(parentnodes);
          setGroupList(false);
          setGroupId(0);
        }
    }

    return(
        <main id="main" className="main" >
            <div className="container">
                <div className="pagetitle">
                    {!GroupList && GroupId==0 && (
                        <h1>User Group</h1>
                    )}
                    {!GroupList && GroupId!=0 && (
                        <h1>Update Group</h1>
                    )}
                    {GroupList && (
                        <h1>User's Group List</h1>
                    )}
                </div>
                <section className="section">
                    <div className="container common-table-pd stationList-filter-bg ">
                        <div className="me-2 mb-2 col-sm-12 text-right">
                            {GroupList && (
                                <span className="operation_class mx-2" onClick={() => Addusergroupchange()}><img src="images/full-plusicon.png" width="25" height="25" /> <span>Create New Group</span></span>
                            )}
                            {!GroupList && (
                                <span className="operation_class mx-2" onClick={() => Addusergroupchange('gridlist')}><img src="images/listingicon.png" width="25" height="25" /> <span>View All Groups</span></span>
                            )}
                        </div>
                        {!GroupList && (
                            <form id="UserGroupform" className="row field-props">
                                <div className="col-md-12 mb-3">
                                    <label for="usergroupname" className="form-label">User Group Name:</label>
                                    <input type="text" className="form-control" id="usergroupname" placeholder="Enter user group name" required />
                                    <div class="invalid-feedback">Please enter user group name.</div>
                                </div>
                                <div>                        
                                    <label for="stationparameterlist" className="form-label">Permissions List :</label>
                                      <CheckboxTree 
                                        nodes={nodes}
                                        checked={checked}
                                        //expanded={getNodeIds(nodes)}
                                        expanded={expanded}
                                        onCheck={handleCheck}
                                        onExpand={handleExpand}
                                      /> 
                                    
                                      
                                </div>
                                <div className="col-md-12 text-center">
                                    {!GroupList && GroupId==0 && (
                                        <button className="btn btn-primary download-btn" onClick={addusergroup} type="button">Add User Group</button>
                                    )}
                                    {!GroupList && GroupId!=0 && (
                                        <button className="btn btn-primary download-btn" onClick={UpdateGroup} type="button">Update User Group</button>
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
    )
}
export default UserGroups;