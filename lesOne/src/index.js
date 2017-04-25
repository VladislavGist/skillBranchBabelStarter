import express from "express";
import fetch from "isomorphic-fetch";
import canonize from "./canonize.js";
import Promise from "bluebird";
import _ from "lodash";

const app = express();
app.get("/canonize", (req, res) => {
	res.json({
		url: req.query.url,
		username: canonize(req.query.url)
	});
});

const __DEV__ = true;
const baseUrl = "https://pokeapi.co/api/v2";
const pokemonFields = ["name", "weight", "height", "id", "base_experience", "order"];

//все покимоны
async function getPokemons(url, i = 0) {
	console.log("getPokemons", url, i);
	const response = await fetch(url);
	const page = await response.json();
	const pokemons = page.results;
	if(__DEV__ && i > 1) {
		return pokemons;
	}
	if(page.next) {
		const pokemins2 = await getPokemons(page.next, i + 1);
		return [
			...pokemons,
			...pokemins2
		]
	}
	return pokemons;
}

//покемон
async function getPokemon(url) {
	console.log("getPokemon", url);
	const response = await fetch(url);
	const pokemon = await response.json();
	return pokemon;
}

app.get("/", async (req, res) => {
	try {
		const pokemonsUrl = `${baseUrl}/pokemon/`
		const pokemonInfo = await getPokemons(pokemonsUrl);
		const pokemonsPromieses = pokemonInfo.map(info => {
			return getPokemon(info.url);
		});

		const pokemonsFull = await Promise.all(pokemonsPromieses);
		const pokemons = pokemonsFull.map(pokemon => {
			return _.pick(pokemon, pokemonFields);
		});

		const sortPokemons = _.sortBy(pokemons, pokemon => pokemon.weight);

		return res.json(sortPokemons)
	} catch(err) {
		console.log(err);
		return res.json({
			error: err
		});
	}
});

app.listen(3000, () => {
	console.log("Example app");
});

//дз 1
// import express from "express";
// const app = express();
// app.listen(3000, () => {
// 	console.log("Server started");
// });
// import fetch from "isomorphic-fetch";
// import Promise from "bluebird";

// app.get("/task2A", async (req, res) => {
// 	const response = (+req.query.a || 0) + (+req.query.b || 0);
// 	res.send(`<p>${response}</p>`)
// });
