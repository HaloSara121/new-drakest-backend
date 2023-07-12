import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Não autorizado, usuário não autenticado!" });
  }

  try {
    const secret = process.env.APP_SECRET;

    verify(token, secret);

    next();
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: "Token Inválido! " });
  }
};

export default checkToken;
