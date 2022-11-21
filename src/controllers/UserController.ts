import { Request, Response } from "express"

import User from "../database/models/User"

const UserController = {
  create: async (req: Request, res: Response) => {
    const {name, email} = req.body
  
    const response = await User.create({
      name,
      email 
    })
  
    res.json({
      response
    })
  },

  delete: async (req: Request, res: Response) => {
    const { id } = req.params
  
    const response = await User.destroy({
      where: {
        id
      },
      force: true
    })
  
    res.json({
      response
    })
  }
}

export default UserController