const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // Validação de senha
    if (password != confirmpassword) {
      // Mensagem para o front
      req.flash("message", "As senhas não conferem, tente novamente!");
      res.render("auth/register");

      return;
    }

    // Checar se o usuário exite
    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      // Mensagem para o front
      req.flash("message", "O e-mail já está em uso!");
      res.render("auth/register");

      return;
    }

    // Criar a senha
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      // Inicializa a sessão
      req.session.userid = createdUser.id;
      req.flash("message", "Cadastro realizado com sucesso!");
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
