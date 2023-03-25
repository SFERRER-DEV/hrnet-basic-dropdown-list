import React from "react";
import ReactDOM from "react-dom/client";
import DropdownList from "./lib/components/DropdownList";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<main>
			<p>HR net</p>
			<div>
				<DropdownList
					labelText={"Departement"}
					onChange={(e) => {
						console.log("onChange");
					}}
					jsonUrl={"/data/departements.json"}
					timing={1}
				/>
			</div>

			<div>
				<DropdownList
					labelText={"State"}
					value={"HI" /** Hawaii */}
					onChange={(e) => {
						console.log("onChange");
					}}
					jsonUrl={"/data/states.json"}
					namedKey={"abbreviation"}
				/>
			</div>
		</main>
	</React.StrictMode>
);
