
import React, { Component, useEffect, useState, useRef } from "react";
<<<<<<< HEAD
// import styled from "styled-components";
// import { calculateWindRose, Chart } from "react-windrose-chart";
=======
/* import styled from "styled-components";
import { calculateWindRose, Chart } from "react-windrose-chart"; */
>>>>>>> 9196d92d40b0539b569fb165800ea8005f682a9d



function WindRosecomp() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const data = {
    direction: [270, 256, 240],
    speed: [1.02, 0.85, 0.98]
  }
 
  //const windRoseData = calculateWindRose(data);
 /*  const windRoseData=[
    {
        "angle": "N",
        "0-1": 0,
        "1-2": 0,
        "2-3": 0,
        "3-4": 0,
        "4-5": 0,
        "5-6": 0,
        "6-7": 0,
        "7+": 0,
        "total": 0
    },
    {
        "angle": "E",
        "0-1": 0,
        "1-2": 0,
        "2-3": 0,
        "3-4": 0,
        "4-5": 0,
        "5-6": 0,
        "6-7": 0,
        "7+": 0,
        "total": 0
    },
    {
        "angle": "S",
        "0-1": 0,
        "1-2": 0,
        "2-3": 0,
        "3-4": 0,
        "4-5": 0,
        "5-6": 0,
        "6-7": 0,
        "7+": 0,
        "total": 0
    },
    {
        "angle": "W",
        "0-1": 0,
        "1-2": 0.3333333333333333,
        "2-3": 0,
        "3-4": 0,
        "4-5": 0,
        "5-6": 0,
        "6-7": 0,
        "7+": 0,
        "total": 0.3333333333333333
    }
]; */

const windRoseData={
  data: [
    {
     // angle: "N",
      "0-1": 2,
      "1-2": 1.6,
      "2-3": 0.9,
      "3-4": 0.9,
      "4-5": 0.4,
      "5-6": 0.3,
      "6-7": 0.2,
      "7+": 0.1,
      total: 4.8999999999999995,
    },
    {
     // angle: "NNE",
      "0-1": 0.6,
      "1-2": 1.8,
      "2-3": 1.3,
      "3-4": 0.8,
      "4-5": 0.5,
      "5-6": 0.3,
      "6-7": 0.1,
      "7+": 0.1,
      total: 5.499999999999999,
    },
    {
     // angle: "NE",
      "0-1": 0.5,
      "1-2": 1.5,
      "2-3": 1.6,
      "3-4": 1.2,
      "4-5": 1.2,
      "5-6": 0.6,
      "6-7": 0.1,
      "7+": 0.1,
      total: 6.799999999999999,
    },
   /*  {
      angle: "ENE",
      "0-1": 0.4,
      "1-2": 1.6,
      "2-3": 0.9,
      "3-4": 1,
      "4-5": 0.5,
      "5-6": 0.2,
      "6-7": 0.1,
      "7+": 0.1,
      total: 4.8,
    }, */
    {
      //angle: "E",
      "0-1": 0.4,
      "1-2": 1.6,
      "2-3": 1,
      "3-4": 0.8,
      "4-5": 0.4,
      "5-6": 0.1,
      "6-7": 0.1,
      "7+": 0.1,
      total: 4.499999999999999,
    },
  ],
  columns: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7+"],
  angles:["N","W","E","S"],
  width: 600,
  height: 600,
  responsive: false,
  legendGap: 10,
};
  console.log(windRoseData.data,windRoseData.columns);
 
  return (
    <main id="main" className="main" >

        <section className="section">
          <div className="container">
   {/*  <Chart data={windRoseData.data} columns={windRoseData.columns} angles={windRoseData.angles}/> */}
          </div>

        </section>
    </main>
  );
}
export default WindRosecomp;