import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import User from "../database/models/User";

const AuthController = {
  register: async (req: Request, res: Response) => {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name) {
      return res.status(422).json({ message: "Name is required!" });
    }
    if (!email) {
      return res.status(422).json({ message: "E-mail is required!" });
    }
    if (!password) {
      return res.status(422).json({ message: "Password is required!" });
    }
    if (password.length < 6) {
      return res
        .status(422)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (!passwordConfirmation) {
      return res
        .status(422)
        .json({ message: "Password Confirmation is required" });
    }
    if (password !== passwordConfirmation) {
      return res.status(422).json({ message: "The passwords must match!" });
    }

    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    const userEmail = userExists?.dataValues.email;
    if (userEmail === email) {
      return res.status(422).json({ message: "E-mail is already in use" });
    }

    const salt = await genSalt(12);
    const passwordHash = await hash(password, salt);

    const response = await User.create({
      name,
      email,
      password: passwordHash,
    });

    if (response) {
      return res.status(202).json({
        message: `User ${response.dataValues.name} has been registered!`,
      });
    }

    return res
      .status(500)
      .json({ message: "Something went wrong! Please try again later." });
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
  },
};

export default AuthController;
