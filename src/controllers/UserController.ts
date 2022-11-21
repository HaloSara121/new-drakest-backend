import { Request, Response } from "express"

import User from "../database/models/User"

const UserController = {
  index: async (req: Request, res: Response) => {
    const response = await User.findAll()

    res.status(200).json({
      response
    })
  },

  create: async (req: Request, res: Response) => {
    const {id, name, email} = req.body
  
    const user = await User.findOne({
      where: {
        id
      }
    })

    if (user?.dataValues.email !== email) {
      const response = await User.create({
        name,
        email 
      })

      return res.status(201).json({
        response
      })
    }
      
    res.status(400).json({
      error: "user already exists"
    })
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params

    const valuesToUpdate = req.body
  
    const user = await User.findOne({
      where: {
        id
      }
    })

    if (user) {
      const response = await User.update({
        ...valuesToUpdate 
      }, {
        where: {
          id
        }
      })

      return res.status(200).json({
        response
      })
    }
      
    res.status(404).json({
      error: "user doesn't exists"
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
    
    if (response === 1) {
      res.status(200).json({
        success: "user has been deleted"
      })
    }

    res.status(404).json({
      error: "user doesn't exists"
    })
  }
}

export default UserController