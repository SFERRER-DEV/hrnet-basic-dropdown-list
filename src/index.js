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
					value={"Reactjs"}
					options={["Angular", "Javascript", "Reactjs"]}
				/>
			</div>
			<div>
				<DropdownList
					labelText={"State"}
					value={"Reactjs"}
					options={["Angular", "Javascript", "Reactjs"]}
				/>
			</div>
		</main>
	</React.StrictMode>
);
