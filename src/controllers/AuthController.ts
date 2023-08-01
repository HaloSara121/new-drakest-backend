import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import User from "../database/models/User";
import { mailgunClient } from "../libs/mailgun";

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
      return res
        .status(422)
        .json({ message: "O E-mail é obrigatório!", fieldMessage: "email" });
    }
    if (!password) {
      return res
        .status(422)
        .json({ message: "A senha é obrigatória!", fieldMessage: "password" });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado", fieldMessage: "toast" });
    }

    const checkPassword = await compare(password, user.dataValues.password);

    if (!checkPassword) {
      return res
        .status(422)
        .json({ message: "Senha ou e-mail inválido!", fieldMessage: "toast" });
    }

    try {
      const secret = process.env.APP_SECRET;
      const token = sign({ id: user.id }, secret);

      return res
        .status(200)
        .json({ message: "Usuário autenticado com sucesso", token });
    } catch (err) {
      console.log(err);

      return res
        .status(500)
        .json({ message: "Something went wrong! Please try again later." });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res
        .status(422)
        .json({ message: "O E-mail é obrigatório!", fieldMessage: "email" });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado", fieldMessage: "toast" });
    }

    try {
      const secret = process.env.APP_SECRET + user.password;

      const token = sign({ email: user.email, id: user.id }, secret, {
        expiresIn: "15m",
      });

      const link = `${process.env.FRONT_END_URL}/password-reset/${user.id}/${token}`;

      mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, {
        from: "drakest@mail.com",
        to: [email],
        subject: "Recuperação de senha | Drakest",
        text: `O link para recuperação de senha do Drakest é: ${link}`,
      });

      return res.status(200).json({
        message:
          "Link para recuperação de senha foi enviado para o seu e-mail!",
      });
    } catch (err) {
      console.log(err);

      return res
        .status(500)
        .json({ message: "Something went wrong! Please try again later." });
    }
  },

  passwordReset: async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    const { password, passwordConfirmation } = req.body;

    // ======= request validation =================
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Parâmetros faltando!", fieldMessage: "toast" });
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "Parâmetros faltando!", fieldMessage: "toast" });
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado", fieldMessage: "toast" });
    }

    // ======= data validation =================
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
    try {
      const secret = process.env.APP_SECRET + user.password;
      verify(token, secret);
    } catch (error) {
      console.log(error);

      return res.status(400).json({ message: "Token Inválido" });
    }

    const salt = await genSalt(12);
    const passwordHash = await hash(password, salt);

    try {
      await User.update(
        {
          password: passwordHash,
        },
        {
          where: {
            id: user.id,
          },
        }
      );

      return res.status(202).json({
        message: `Usuário ${user.name} foi atualizado com sucesso!`,
        fieldMessage: "toast",
      });
    } catch (err) {
      console.log(err);

      return res
        .status(500)
        .json({ message: "Something went wrong! Please try again later." });
    }
  },

  validate: async (req: Request, res: Response) => {
    try {
      const secret = process.env.APP_SECRET;

      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      const payload = verify(token, secret);

      return res.status(200).json({ message: "Valid token", userId: payload });
    } catch (err) {
      console.log(err);

      return res.status(400).json({ message: "Invalid token! " });
    }
  },
};

export default AuthController;
