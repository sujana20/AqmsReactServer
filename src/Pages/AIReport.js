import React, { useCallback, useEffect, useState, useRef } from "react";
import './../chart.css';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  defaults
} from 'chart.js';
import { Chart, Bar, Line, Scatter } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const generateDatabaseDateTime = function (date) {
  return date.replace("T", " ").substring(0, 19);
};

const generateDatabaseDateTime16 = function (date) {
  return date.replace("T", " ").substring(0, 16);
};

const formatCellValue = function (value) {
  if (typeof value === 'string') {
    const dateObject = new Date(value);

    if (!isNaN(dateObject.getTime())) {
      // It's a valid date, format it
      return generateDatabaseDateTime(value);
    }
  }

  // For other types or unhandled cases, return the original value
  return value;
};
const DynamicTable = ({ jsonData }) => {
  const headers = jsonData.length>0?Object.keys(jsonData[0]):[];
  const isArrayOfObjects = (obj) => {
    return Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null;
  };
  const isArrayOfObjectsRes=isArrayOfObjects(jsonData);
  return (
    <div>
      {isArrayOfObjectsRes && (
      jsonData.length>0 && (
    <table className="table table-bordered">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {jsonData.map((dataItem, rowIndex) => (
          <tr key={rowIndex}>
             {headers.map((header, colIndex) => (
                  <td key={colIndex}>{formatCellValue(dataItem[header])}</td>
                ))}
          </tr>
        ))}
      </tbody>
    </table>
    ))}
    {isArrayOfObjectsRes && (
    jsonData.length==0 && (
    <div>No Data found</div>
    )
    )}
    {!isArrayOfObjectsRes && (
      <div>{jsonData?.error}</div>
    )}
    </div> 
  );
};
function AIReport() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [processingMessages, setProcessingMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputText.trim() !== '') {
      const isQuestion = true;
      const newMessage = { text: inputText, isQuestion };

      setChatHistory((prevHistory) => [...prevHistory, newMessage]);

      if (isQuestion) {
        setProcessingMessages((prevMessages) => [...prevMessages, inputText]);
        handleNewMessage(inputText);
      }

      setInputText('');
    }
  };

  const getJsondata = async function (question) {
    let params = new URLSearchParams({ userMessage: question });
    try {
      const response = await fetch("http://127.0.0.1:5000/conversation1?" + params, {
        method: 'GET',
      });
      const data = await response.json();
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { jsonData: data, isQuestion: false },
      ]);
    } catch (error) {
      console.log("error: ", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { jsonData: [], isQuestion: false },
      ]);
    } finally {
      setProcessingMessages((prevMessages) => prevMessages.filter((msg) => msg !== question));
    }
  };

  const handleNewMessage = (question) => {
    let jsonData = getJsondata(question);
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };


  return (
    <main id="main" className="main">
      <section className="chat-section">
        
        <div className="chatbox_main">
          <div ref={chatContainerRef} className="chat_messages_main">
        <div className="chat-messages">
        {chatHistory.map((item, index) => (
                <div key={index} className={item.isQuestion ? 'question' : 'answer'}>
                  <b>{item.text}</b>
                  {item.isQuestion && processingMessages.includes(item.text) && (
                    <span> Loading...</span>
                  )}
                  {!item.isQuestion && item.jsonData && (
                    <DynamicTable key={`table_${index}`} jsonData={item.jsonData} />
                  )}
                </div>
              ))}
        </div>
        </div>
          <div className="questionInputContainer">
            <form className="row questionInputrow" onSubmit={handleSendMessage}>
              <div className="form-group questionInputTextArea col-md-10">
                <input
                  type="text"
                  className="form-control"
                  id="inputchat"
                  placeholder="Type a message"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <div className="questionInputSendButtonContainer col-md-2">
                <button type="submit" className="btn btn-primary mb-2 questionInputSendButton">Send</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AIReport;