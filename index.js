const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

// Models
const Tought = require("./models/Tought")
const User = require("./models/User")

// Template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// Session Middleware
app.use(
  session({
    name: "session", // Nome da Seção
    secret: "nosso_secrett",
    resave: "false", // Se cair a seção, o usuário deve reconectar
    saveUninitialized: false,
    store: new FileStore({
      // Salvar seções em arquivos no servidor
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"), // Caminho para a pasta sessions
    }),
    cookie: {
      secure: false,
      maxAge: 360000, // Tempo de duração do cookie -> 1 dia
      expires: new Date(Date.now() + 360000), // Expira em 1 dia também
      httpOnly: true, //Sem certificado de segurança, pois usa o localhost
    },
  })
);

// Flash Messages
app.use(flash());

// Public Path
app.use(express.static("public"));

// Set session to res
app.use((req, res, next) => {
  if (req.session.userid) { // Se o usuário está logado, a sessão é enviada para a resposta
    res.locals.session = req.session;
  }

  next()
});

// Banco de dados ouvindo a porta 3000
conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
