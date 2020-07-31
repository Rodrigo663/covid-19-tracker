import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import Table from "./Table";
import InfoBox from "./InfoBox";
import MyFormControl from "./FormControl";
import Map from "./Map";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { sortData, numberWithCommas, prettier, sortAlpha } from "./util";

import "./App.css";

// 1) Create a variable wheter it is on countries or states
// 2) Appy this variable to the use effect
// 3) Add the conditions whteter they are different

// 4) Do the changes on the code

function App() {
  const [continent, setContinent] = useState("Africa");
  const [continentInfo, setContinentInfo] = useState({});
  const [continents, setContinents] = useState([]);
  const [main, setMain] = useState("country");
  const [state, setState] = useState("all");
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [myUrl, setUrl] = useState(
    "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
  );
  const [countryName, setCountryName] = useState();
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 40.097997,
    lng: -98.199698,
  });
  const [mapZoom, setZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      if (main === "country") {
        await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2, // UK
            }));
            const sortedData = sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
          });
      } else if (main === "states") {
        await fetch("https://disease.sh/v3/covid-19/states")
          .then((response) => response.json())
          .then((data) => {
            const states = data.map((state) => ({
              name: state.state,
              value: state.state, // UK
            }));
            const sortedData = sortData(data);
            setTableData(data);
            setStates(sortAlpha(states));
            // setMapCountries(data);
          });
      } else if (main === "continents") {
        await fetch("https://disease.sh/v3/covid-19/continents")
          .then((response) => response.json())
          .then((data) => {
            const continents = data.map((continent) => ({
              name: continent.continent,
              value: continent.continent, // UK
            }));
            const sortedData = sortData(data);
            setTableData(data);
            setContinents(sortAlpha(continents));
            data.forEach((el) => {
              el.countryInfo = el.continentInfo;
              delete el.continentInfo;
            });
            setMapCountries(data);
            onContinentChange({ target: { value: "Africa" } });
          });
      }
    };

    getCountriesData();
  }, [main]);
  const getStatesData = async () => {
    let myData;
    await fetch("https://disease.sh/v3/covid-19/states")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        myData = data;
      });
    return myData;
  };
  const onStateChange = async (event) => {
    setState(event.target.value);
    const url =
      event.target.value === "all"
        ? "https://disease.sh/v3/covid-19/countries/USA"
        : `https://disease.sh/v3/covid-19/states/${event.target.value}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.recovered = data.cases - (data.active + data.deaths);
        setCountryInfo(data);
        //setCountryName(data.state);
      });
  };
  const onContinentChange = async (event) => {
    const continent = event.target.value;
    setContinent(continent);

    await fetch(
      `https://disease.sh/v3/covid-19/continents/${
        continent === "Australia/Oceania"
          ? continent.replace("/", "%2F")
          : continent
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setMapCenter([data.continentInfo.lat, data.continentInfo.long]);
      });
  };
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    if (event.target.value === "continent") {
      setMain("continents");
    }
    if (event.target.value === "US") {
      setMain("states");
    }
    if (event.target.value !== "continent" && event.target.value !== "US") {
      setMain("country");
    }

    setUrl(
      `${
        countryCode === "worldwide" || countryCode === "continent"
          ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
          : `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=120`
      }`
    );
    let array = ["cases", "deaths"];
    var index = array.indexOf(casesType);
    array.splice(index, 1);
    setCasesType(array[0]);

    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setCountryName(data.country);
        if (countryCode === "worldwide" || countryCode === "continent") {
          setMapCenter([34.80746, -40.976]);
          setZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }

        //setCasesType('cases');
      });
  };
  return (
    // BEM NAMING CONVENTION
    <div className="app">
      <div className="app__left">
        {/* Header */}

        {/* Title + Selct input dropdown field */}

        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          {tableData.length === 6 && (
            <MyFormControl
              onChange={onContinentChange}
              value={continent}
              set={continents}
            />
          )}
          {tableData.length === 62 && (
            <MyFormControl
              onChange={onStateChange}
              value={state}
              mainValue="all"
              main="All"
              set={states}
            />
          )}
          <MyFormControl
            onChange={onCountryChange}
            value={country}
            mainValue="worldwide"
            main="Worldwide"
            set={countries}
          />
        </div>

        <div className="app__stats">
          {/* Infoboxes title=coronavirus cases*/}
          <InfoBox
            red
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettier(countryInfo.todayCases)}
            total={numberWithCommas(countryInfo.cases)}
          >
            {" "}
          </InfoBox>
          {/* InfoBox title=coronavirus recoveries */}
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={
              countryInfo.todayRecovered
                ? prettier(countryInfo.todayRecovered)
                : "No Data"
            }
            total={numberWithCommas(countryInfo.recovered)}
          >
            {" "}
          </InfoBox>

          {/* InfoBox */}
          <InfoBox
            red
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettier(countryInfo.todayDeaths)}
            total={numberWithCommas(countryInfo.deaths)}
          >
            {" "}
          </InfoBox>
        </div>

        {/* Map Underneath */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        ></Map>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>
            {" "}
            Live{" "}
            {casesType === "recovered"
              ? tableData.length === 62
                ? "active"
                : "recovered"
              : casesType}{" "}
            by{" "}
            {tableData.length === 62
              ? "State"
              : tableData.length === 6
              ? "Continent"
              : "Country"}{" "}
          </h3>

          <Table casesType={casesType} countries={tableData} />
          <h3 className="app__graphTitle">
            {`${countryName ? countryName : "Worldwide"}`} new {casesType}{" "}
          </h3>

          <LineGraph className="app__graph" url={myUrl} casesType={casesType} />
        </CardContent>
      </Card>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;
