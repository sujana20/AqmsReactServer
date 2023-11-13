import { React } from "react";

const CommonFunctions = {
  
  getWebApiUrl()
  {
      const baseUrl=window.location.origin;
      if(baseUrl.indexOf(":")!==-1)
        return process.env.REACT_APP_WSurl;
      else
        return baseUrl+process.env.REACT_APP_WSurl;
  },
   
  truncateNumber(number,digits) {
        
   /*  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = number.toString().match(re);
    return m ? parseFloat(m[1]) : number.valueOf(); */

    return Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits)
    //return with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
 
     },

    SetFlagColor(flagcode,flaglist){  
      for(var i=0; i<flaglist.length;i++){      
        if(flaglist[i].id ==flagcode){   
          //var msgname = flaglist[i].message.toLocaleLowerCase().replaceAll(' ','');
          //return flaglist[i].message.toLocaleLowerCase().replaceAll(' ','');
          return flaglist[i].colorCode
        }      
      }
      
    },
    async  getAuthHeader()
    {
      const token = sessionStorage.getItem('Token');
     // const LoggedInTime = sessionStorage.getItem('LoggedInTime');
      const tokenExpTime=sessionStorage.getItem('TokenExpTime');
      var newdate=new Date(tokenExpTime);
      newdate.setMinutes(newdate.getMinutes() - 1);
     // var expTime=LoggedInTime.set
      var currentDate=new Date();
      console.log("currentDate",currentDate);
      console.log("exp date",tokenExpTime);
      if(currentDate >= newdate)
      {
        try {
          const response = await fetch(CommonFunctions.getWebApiUrl() + "Token", {
            method: 'POST',
           // headers:{ Authorization: 'Bearer ' + token, 'app-origin': 'http://localhost:3000' },
          });
    
          if (response.ok) {
            const responseJson = await response.json();
            if (responseJson.token) {
              console.log(responseJson);
              sessionStorage.setItem('Token', responseJson.token);
    
              const expirationTime = new Date();
              expirationTime.setMinutes(expirationTime.getMinutes() + responseJson.tokenExpirationTime);
              sessionStorage.setItem('TokenExpTime', expirationTime);
    
              return { Authorization: 'Bearer ' + responseJson.token, 'app-origin': 'http://localhost:3000' };
            }
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      
      }
      else{
        if (token) {
          return { Authorization: 'Bearer ' +token ,'app-origin': 'http://localhost:3000'};
        } else {
          return {};
        }
      }
    }
}


export default CommonFunctions;
