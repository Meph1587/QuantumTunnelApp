
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";



// export function useFetch(url:string) {
//   const [data, setData] = useState(null);

//   async function fetchData() {
//     const response = await fetch(url);
//     const json = await response.json();
//     setData(json);
//   }

//   useEffect(() => {fetchData()},[url]);

//   return data;
// };