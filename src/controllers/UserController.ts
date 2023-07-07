import { Request, Response } from "express";

import User from "../database/models/User";

const UserController = {
  index: async (req: Request, res: Response) => {
    const response = await User.findAll();

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

  // create: async (req: Request, res: Response) => {
  //   const { name, email } = req.body;

  //   const userExists = await User.findOne({
  //     where: {
  //       email,
  //     },
  //   });

  //   const userEmail = userExists?.dataValues.email;

  //   if (userEmail !== email) {
  //     const response = await User.create({
  //       name,
  //       email,
  //     });

  //     return res.status(201).json({
  //       response,
  //     });
  //   }

  //   res.status(400).json({
  //     error: "User already exists",
  //   });
  // },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;

    const { name, email } = req.body;

    const userExists = await User.findOne({
      where: {
        id,
      },
    }).catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });

    const emailAlreadyUsed = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists && emailAlreadyUsed.dataValues.email !== email) {
      const response = await User.update(
        {
          name,
          email,
        },
        {
          where: {
            id,
          },
        }
      ).catch((err) => {
        return res.status(404).json({ error: "User not found" });
      });

      return res.status(200).json({
        response,
      });
    } else if (emailAlreadyUsed.dataValues.email === email) {
      return res.status(401).json({ error: "Email is already in use" });
    }

    res.status(404).json({ error: "User not found" });
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
