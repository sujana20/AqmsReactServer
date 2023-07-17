import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

function PagenotFound(){

    return(
        <main id="main" className="main">
            <div className="container">
                <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="justify-content-center">
                    <h1 style={{textAlign:"center"}}>You Don't have permission to access this Page </h1>          
                </div> 
                </section>
                               
            </div>
        </main>
    )
}
export default PagenotFound;