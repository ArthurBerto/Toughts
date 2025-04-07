const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    res.render("toughts/home");
  }

  static async dashboard(req, res) {
    const userid = req.session.userid;

    const user = await User.findOne({
      where: { id: userid },
      include: Tought,
      plain: true,
    });

    // Checa se o usuário existe
    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    res.render("toughts/dashboard", { toughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash("message", "Pensamento criado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(`Aconteceu um erro: ${err}`);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, Userid: UserId } });

      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(`Aconteceu um erro: ${err}`);
    }
  }
};
