import mysql from "mysql";
import {AsyncRouter} from "express-async-router";

let pool = mysql.createPool({
	connectionLimit: 2000,
	host: "localhost",
	user: "root",
	password: "root",
	database: "animals_db"
});

export default ctx => {
	const api = AsyncRouter();
	pool.getConnection((err, connection) => {
		api.all("/", () => ({ok: true, version: "1.0.1"}));
		api.all("/test", () => ({test: 12312}));
	});
	return api;
};