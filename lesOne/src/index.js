import express from "express";
//middleware. проверяет jwt распарсив его
import expressJwt from "express-jwt";
//гинирирует json web token
import jwt from "jsonwebtoken";
//api
import getApi from "./api/api.js";
//logger
import bunyan from "bunyan";
//bodyParser, cookieParser, cors
import reqParser from "./middlewares/reqParser.js";

const app = express();

//api
const api = getApi({});
app.use("/api", api);
//bodyParser, cookieParser, cors
app.use(reqParser());

const log = bunyan.createLogger({
	name: "app",
	src: __DEV__,
	lavel: "trace"
});
log.info("Started");

//делаем запрос чтобы получить токен
app.get("/token", (req, res) => {
	//берем данные которые хотим поместить в токен
	const data = {
		user: "Dradnout",
		name: "I am Dradnout"
	};
	//подписываем данные секретным ключем. придет длинная строка
	return res.json(jwt.sign(data, secret));
});

app.get("/protected", 
	//при запросе парсим наш ключ, если они равны, то вып. функцию
	expressJwt({secret}),
	(req, res) => {
		return res.json(req.user);
	}	
);

app.get("/", (req, res) => {
	res.json({
		hello: "Hello"
	});
});

app.listen(3000, () => console.log("Server started"));