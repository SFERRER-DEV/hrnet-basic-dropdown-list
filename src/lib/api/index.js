/**
 * Alias pour le type de la fonction qui met à jour l'état avec une nouvelle valeur.
 * Utilisé pour les paramètres et les variables.
 * @typedef {React.Dispatch<React.SetStateAction<T>>} SetState<T>
 */
/**
 * Fonction qui récupère des données JSON à partir d'une URL et met à jour l'état en conséquence.
 * @param {string} jsonUrl - L'URL à partir de laquelle récupérer les données JSON.
 * @param {SetState<boolean>} setDataLoading - La fonction qui met à jour l'état pour indiquer si les données sont en cours de chargement.
 * @param {SetState<boolean>} setError - La fonction qui met à jour l'état pour indiquer si une erreur s'est produite lors de la récupération des données.
 * @param {SetState<Object[]>} setJsonData - La fonction qui met à jour l'état pour stocker les données JSON récupérées.
 */
export async function fetchJsonData(
	jsonUrl,
	setDataLoading,
	setError,
	setJsonData
) {
	setDataLoading(true); // Indiquer que les données sont en cours de chargement
	try {
		const response = await fetch(jsonUrl);
		const data = await response.json();
		setJsonData(data); // ✅ Mettre à jour les données JSON dans l'état
	} catch (err) {
		console.log(err);
		setError(true); // ⛔ Indiquer qu'une erreur s'est produite lors de la récupération des données
	} finally {
		setDataLoading(false); // 👍 Indiquer que les données ne sont plus en cours de chargement
	}
}
