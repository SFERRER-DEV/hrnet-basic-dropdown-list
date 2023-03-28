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

function Tags({ listTags, start }) {
	return (
		<div>
			{listTags.map((element, index) => (
				<Tag key={start + index}>{`${element.id} - ${element.name}`}</Tag>
			))}
		</div>
	);
}

function DepartementList() {
	/**
	 * Déclare une variable d'état 'list' et une fonction de mise à jour 'setList'
	 * qui initialise la valeur initiale de 'list' à un tableau avec un objet vide.
	 */
	const [list, setList] = useState([{}]);
	const [selectedValue, setSelectedValue] = useState("");

	return (
		<Container>
			<DropdownList
				labelText={"Departement"}
				jsonUrl={"/data/departements.json"}
				message={"You must choose your department"}
				onListChange={(newState) => setList(newState)}
				onSelectedChange={(newState) => setSelectedValue(newState)}
				selectedValue={selectedValue}
			/>
			<Tags listTags={list} start={1000} />
		</Container>
	);
}

function StateList() {
	/**
	 * Déclare une variable d'état 'list' et une fonction de mise à jour 'setList'
	 * qui initialise la valeur initiale de 'list' à un tableau avec un objet vide.
	 */
	const [list, setList] = useState([{}]);
	const [selectedValue, setSelectedValue] = useState("");

	return (
		<Container>
			<DropdownList
				labelText={"State"}
				jsonUrl={"/data/states.json"}
				namedKey="abbreviation"
				message="Please select a state"
				onListChange={(newState) => setList(newState)}
				onSelectedChange={(newState) => setSelectedValue(newState)}
				selectedValue={selectedValue}
			/>
			<Tags listTags={list} start={2000} />
		</Container>
	);
}

function LisensesList() {
	/**
	 * Déclare une variable d'état 'list' et une fonction de mise à jour 'setList'
	 * qui initialise la valeur initiale de 'list' à un tableau avec un objet vide.
	 */
	const [list, setList] = useState([{}]);
	const [selectedValue, setSelectedValue] = useState("");

	return (
		<Container>
			<DropdownList
				labelText={"Licenses Github"}
				jsonUrl={"https://api.github.com/licenses"}
				namedKey="key"
				message="Please choose a license"
				onListChange={(newState) => setList(newState)}
				onSelectedChange={(newState) => setSelectedValue(newState)}
				selectedValue={selectedValue}
			/>
			<Tags listTags={list} start={3000} />
		</Container>
	);
}

root.render(
	<React.StrictMode>
		<main>
			<h1>HRnet - dropdown component </h1>
			<form onSubmit={(event) => event.preventDefault()}>
				<DepartementList />
				<StateList />
				<LisensesList />
				<button type="submit">Envoyer</button>
			</form>
		</main>
	</React.StrictMode>
);
