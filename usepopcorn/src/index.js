import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app-v1";
// import StarRating from "./starRating";

// function Test({rating}){
//   const [testRate,setTestRate] = useState(0)
//   return <div>
//       <StarRating maxRating={7} onSetTestRate={setTestRate}/>
//       <p>The movie is {testRate} rated</p>
//     </div>
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <StarRating maxRating={5}/>
    <StarRating maxRating={10}/>
    <StarRating maxRating={5} messages={['Terrible','Bad','Okay','Good','Amazing']}/>
    <Test /> */}
    <App />
  </React.StrictMode>
);