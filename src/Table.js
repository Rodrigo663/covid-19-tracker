import React from 'react';
import { numberWithCommas } from "./util";
import { sortData} from "./util";

import './Table.css';
function Table( { casesType='cases', countries }) {
    
    let newCountries = countries.map(country => {
        return { country: country.state ? country.state : country.country ? country.country : country.continent,
          cases: casesType ==='recovered' ? country.state ? country.active : country[casesType] : country[casesType]
        }
    })
    newCountries = sortData(newCountries);
    return (
        <div className="table">
            {newCountries.map(({country, cases}) => (
                <tr> 
                    <td>{country}</td>
                    <td><strong>{numberWithCommas(cases)}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table;
