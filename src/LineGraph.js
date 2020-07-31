import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";


import numeral from "numeral";
const options = {
  
    maintainAspectRatio: false,

  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: 'll',
        },
      },
    ],
    yAxes: [
      {
        // Don´t show Y axes grid lines:
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
           
            return numeral(value).format("0a");
          },

          
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  // Maintain the same canvas ratio (width and height when reseizing)
  mainAspectRatio: false,
  tooltips: {
    mode: "index",
    // With this property see just need to touch on the graph and you will get a value
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
};
const buildChartData = (myData, casesType = "cases") => {
  let lastDataPoint;
  let newDataPoint;
  const chartData = [];
  for (let date in myData[casesType]) {
    if (lastDataPoint) {
      newDataPoint = {
        x: date,
        y: myData[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }

    lastDataPoint = myData[casesType][date];
  }
  return chartData;
};

function LineGraph({casesType = 'cases', url, ...props}) {
  const [data, setData] = useState({});
  // https://disease.sh/v3/covid-19/historical?lastdays=120

  useEffect(() => {
    const fetchData = async () => {
    
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // clever stuff here...
          if(data.timeline) {
            data= data.timeline;
          }
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);
  return (
    <div className={props.className}>

      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: `${casesType==='recovered' ? 'rgba(0, 255, 0, 0.3)' : casesType==='deaths' ? 'rgba(204,24,  52, 1)' : 'rgba(255, 92, 92)'}`,
                borderColor:  `${casesType==='recovered' ? 'rgba(0, 145, 44, 0.3)' : '#CC1034'}`,
              
                data,
              },
            ],
          }}
        >
          {" "}
        </Line>
      )}
    </div>
  );
}

export default LineGraph;
