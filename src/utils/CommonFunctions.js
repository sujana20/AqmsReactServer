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

     
}


export default CommonFunctions;
