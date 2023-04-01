import { useState, useEffect } from "react";

/**
 * Hook personnalisé qui récupère une liste de données depuis une URL d'API JSON et renvoie les paires clé-valeur spécifiées sous forme d'objet.
 * @param {string} jsonUrl - L'URL de l'API JSON à partir de laquelle récupérer les données.
 * @param {string} namedKey - Le nom de la clé dans les données JSON à utiliser comme clé de propriété de l'objet.
 * @param {string} namedValue - Le nom de la valeur dans les données JSON à utiliser comme valeur de propriété de l'objet.
 * @param {string} message - Message de validation & message affiché par la première option inactive
 * @param {string} defaultValue - mai
 * @returns {object} Un objet contenant les variables suivantes :
 * - jsonData : les données JSON récupérées depuis une API.
 * - setJsonData : une fonction pour mettre à jour les données JSON.
 * - data : les données traitées à partir des données JSON.
 * - setData : une fonction pour mettre à jour les données.
 * - isDataLoading : un indicateur booléen pour indiquer si les données sont en cours de chargement.
 * - setDataLoading : une fonction pour mettre à jour l'indicateur de chargement des données.
 * - error : une erreur éventuelle survenue lors du chargement des données.
 * - setError : une fonction pour mettre à jour l'erreur éventuelle.
 */
export function useFetchList(jsonUrl, namedKey, namedValue, message) {
	/**
	 * Etat des données chargées à partir du fichier json
	 * @typedef jsonData - Tableau d'objets json contenant les éléments pour la liste
	 * @typedef setJsonData - Fonction qui permet de mettre à jour le tableau de données.
	 */
	const [jsonData, setJsonData] = useState(null);

	/**
	 * Etat pour mémoriser les données avec des propriétés json normalisées en id et name
	 * @typedef data - Tableau d'objets json contenant les éléments pour la liste
	 * @typedef setData - Fonction qui permet de mettre à jour le tableau de données.
	 */
	const [data, setData] = useState([]);

	/**
	 * État de chargement indiquant si les données sont en cours de chargement ou non.
	 * @typedef isDataLoading - Indique si les données sont en cours de chargement ou non.
	 * @typedef setDataLoading - Fonction qui permet de mettre à jour l'état de chargement de données.
	 */
	const [isDataLoading, setDataLoading] = useState(false);

	/**
	 * État d'erreur.
	 * @typedef error - Indique s'il y a une erreur ou non.
	 * @typedef setError - Fonction qui permet de mettre à jour l'état d'erreur.
	 */
	const [error, setError] = useState(false);

	useEffect(() => {
		async function fetchData(jsonUrl) {
			setDataLoading(true); // Indiquer que les données sont en cours de chargement
			try {
				const response = await fetch(jsonUrl);
				const data = await response.json();
				if (!Array.isArray(data)) {
					throw new Error("Le tableau d'éléments n'a pas été trouvé.");
				}
				setJsonData(data); // ✅ Mettre à jour les données JSON dans l'état
			} catch (err) {
				console.log(err);
				setError(true); // ⛔ Indiquer qu'une erreur s'est produite lors de la récupération des données
			} finally {
				setDataLoading(false); // 👍 Indiquer que les données ne sont plus en cours de chargement
			}
		}
		//
		fetchData(jsonUrl);
	}, [jsonUrl]);

	// 2️⃣ Transformer le tableau des éléments avec des propriétés normalisées (id & name)
	useEffect(() => {
		if (isDataLoading === false && jsonData !== null && data.length === 0) {
			// Ajouter un premier élément au tableau
			data.push(
				Object.assign({
					id: "",
					name: message, // = 1ere option inactive de la liste
				})
			);
			jsonData.forEach((element) => {
				data.push(
					Object.assign({
						id: element[namedKey],
						name: element[namedValue],
					})
				);
			});
		}
	}, [isDataLoading, jsonData, data, namedKey, namedValue, message]);

	return {
		jsonData,
		setJsonData,
		data,
		setData,
		isDataLoading,
		setDataLoading,
		error,
		setError,
	};
}
