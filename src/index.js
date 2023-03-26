import React from "react";
import ReactDOM from "react-dom/client";
import DropdownList from "./lib/components/DropdownList";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<main>
			<p>HR net</p>
			<DropdownList
				labelText={"Departement"}
				jsonUrl={"/data/departements.json"}
				onChange={(e) => {
					console.log("onChange");
				}}
				value={1}
				timing={1}
			/>
			<DropdownList
				labelText={"State"}
				jsonUrl={"/data/states.json"}
				onChange={(e) => {
					console.log("onChange");
				}}
				namedKey="abbreviation"
				value={"HI"}
			/>
		</main>
	</React.StrictMode>
);
