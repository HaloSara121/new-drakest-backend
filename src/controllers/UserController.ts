import { Request, Response } from "express";

import User from "../database/models/User";

const UserController = {
  index: async (req: Request, res: Response) => {
    const response = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      response,
    });
  },

  get: async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password"],
      },
    }).catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });

    if (response) {
      return res.status(200).json({
        response,
      });
    }

    res.status(404).json({ error: "User not found!" });
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;

    const { name, image, email } = req.body;

    const userExists = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password"],
      },
    }).catch((err) => {
      console.log(err);

      return res.status(404).json({ error: "User not found" });
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email) {
      const emailAlreadyUsed = await User.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (emailAlreadyUsed?.dataValues.email === email) {
        return res.status(422).json({ error: "Email is already in use" });
      }
    }

    const response = await User.update(
      {
        name,
        image,
        email,
      },
      {
        where: {
          id,
        },
      }
    ).catch((err) => {
      console.log(err);
      return res.status(404).json({ error: "User not found" });
    });

    return res.status(202).json({
      response,
    });
  },

  delete: async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await User.destroy({
      where: {
        id,
      },
      force: true,
    }).catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });

    if (response === 1) {
      return res.status(200).json({
        success: "User has been deleted",
      });
    }

    res.status(404).json({
      error: "User not found",
    });
  },
};

export default UserController;
