import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    // The size of the circle
    multiplier: 800,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
};
export const sortData = (data) => {
  const sortData = [...data];
  return sortData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};
export const sortAlpha = (data) => {
  return data.sort(function (a, b) {
    var textA = a.name.toUpperCase();
    var textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
};
export const prettier = (number) => {
  if (number > 1000) {
    return number ? `+${numeral(number).format("0.0a")} ` : "+0";
  } else {
    return `+${number}`;
  }
};

export const numberWithCommas = function (x = " ") {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Draw circles on the map with interactive tooltip
export const showDataMap = (data, casesType = "cases") =>
  data.map((country) => (
    // 5 attributes for the circle
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          {/* Background image */} `
          <div
            className="info-flag"
            id={country.countries && 'continent-flag'}
            style={
              country.countries
                ? {
                    backgroundImage: `url(./img/continents/${
                     country.continent==='Australia/Oceania' ? country.continent.toLowerCase().split("/")[1] : country.continent.toLowerCase().split(" ")[0]
                    }.png)` 
                  


                  }
                : { backgroundImage: `url(${country.countryInfo.flag})` }
            }
          />
          <div className="info-name">
            {country.country ? country.country : country.continent}
          </div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

//
