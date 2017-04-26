global.__DEV__ = true;
global.__PROD__ = false;

export default {
	name: "App",
	port: 3000,
	db: {
		connectionLimit: 2000,
		url: "localhost",
		user: "root",
		password: "root",
		database: "animals_db"
	},
	jwt: {
		secret: "jwt-secret"
	}
}