import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import DropdownList from "./lib/components/DropdownList";

const Container = styled.div`
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	padding: 1em;
	margin: 2em;
`;

const Tag = styled.span`
	display: inline-block;
	padding: 0.5em 1em;
	margin-right: 1em;
	margin-bottom: 1em;
	background-color: #d2e8f5;
	border-radius: 0.5em;
	font-size: 0.85em;
	color: #1a2933;
`;

const root = ReactDOM.createRoot(document.getElementById("root"));

function DepartementList() {
	/**
	 * Déclare une variable d'état 'list' et une fonction de mise à jour 'setList'
	 * qui initialise la valeur initiale de 'list' à un tableau avec un objet vide.
	 */
	const [list, setList] = useState([{}]);

	return (
		<Container>
			<DropdownList
				labelText={"Departement"}
				jsonUrl={"/data/departements.json"}
				list={list}
				setList={setList}
				onChange={(e) => console.log(e.target.value)}
				value={1}
				timing={1}
			/>
			<Tags listTags={list} start={1000} />
		</Container>
	);
}

function Tags({ listTags, start }) {
	return (
		<div>
			{listTags.map((element, index) => (
				<Tag key={start + index}>{`${element.id} - ${element.name}`}</Tag>
			))}
		</div>
	);
}

root.render(
	<React.StrictMode>
		<main>
			<h1>HRnet - dropdown component </h1>
			<DepartementList />
			<Container>
				<DropdownList
					labelText={"State"}
					jsonUrl={"/data/states.json"}
					namedKey="abbreviation"
					onChange={(e) => console.log(e.target.value)}
					value={"HI"}
				/>
			</Container>
			<Container>
				<DropdownList
					labelText={"Licences Github"}
					jsonUrl={"https://api.github.com/licenses"}
					namedKey="key"
					onChange={(e) => console.log(e.target.value)}
					value={"mit"}
				/>
			</Container>
		</main>
	</React.StrictMode>
);
