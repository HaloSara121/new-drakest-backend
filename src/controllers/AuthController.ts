import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import User from "../database/models/User";

const AuthController = {
  register: async (req: Request, res: Response) => {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name) {
      return res
        .status(422)
        .json({ message: "O Nome é obrigatório!", fieldMessage: "name" });
    }
    if (!email) {
      return res
        .status(422)
        .json({ message: "O E-mail é obrigatório!", fieldMessage: "email" });
    }
    if (!password) {
      return res
        .status(422)
        .json({ message: "A senha é obrigatória!", fieldMessage: "password" });
    }
    if (password.length < 6) {
      return res.status(422).json({
        message: "A senha deve conter no mínimo 6 caracteres",
        fieldMessage: "password",
      });
    }
    if (!passwordConfirmation) {
      return res.status(422).json({
        message: "A confirmação de senha é obrigatória",
        fieldMessage: "passwordConfirmation",
      });
    }
    if (password !== passwordConfirmation) {
      return res.status(422).json({
        message: "A senha de confirmação não confere!",
        fieldMessage: "passwordConfirmation",
      });
    }

    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    const userEmail = userExists?.dataValues.email;
    if (userEmail === email) {
      return res.status(422).json({
        message: "Esse E-mail já está em uso.",
        fieldMessage: "email",
      });
    }

    const salt = await genSalt(12);
    const passwordHash = await hash(password, salt);

    try {
      const response = await User.create({
        name,
        email,
        password: passwordHash,
      });

      if (response) {
        return res.status(202).json({
          message: `Usuário ${response.dataValues.name} foi registrado com sucesso!`,
          fieldMessage: "toast",
        });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: "Algo deu errado! por favor tente mais tarde.",
        fieldMessage: "toast",
      });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
      return res.status(422).json({ message: "E-mail is required!" });
    }
    if (!password) {
      return res.status(422).json({ message: "Password is required!" });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPassword = await compare(password, user.dataValues.password);

    if (!checkPassword) {
      return res.status(422).json({ message: "Invalid password!" });
    }

    try {
      const secret = process.env.APP_SECRET;
      const token = sign({ id: user.id }, secret);

      return res
        .status(202)
        .json({ message: "User authenticated with success" });
    } catch (err) {
      console.log(err);

      return res
        .status(500)
        .json({ message: "Something went wrong! Please try again later." });
    }
  },
};

export default AuthController;
