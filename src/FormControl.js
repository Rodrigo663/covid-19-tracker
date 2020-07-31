import React from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";

function MyFormControl(props) {
  return (
    <div>
      <FormControl className="app__dropdown">
        <Select
          onChange={props.onChange}
          variant="outlined"
          value={props.value}
        >
          {/* Loop through all the countries and show a dropdown for each one */}

          {props.main && (
            <MenuItem value={props.mainValue}> {props.main} </MenuItem>
          )}
          {props.main === "Worldwide" && (
            <MenuItem value="continent"> By Continent </MenuItem>
          )}

          {props.set.map((state) => (
            <MenuItem value={state.value}>{state.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MyFormControl;
