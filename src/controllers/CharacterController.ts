import { Request, Response } from "express"

import Character from "../database/models/Character"
import User from "../database/models/User"

const CharacterController = {
  index: async (req: Request, res: Response) => {
    const { userId } = req.params

    
    if (userId) {
      const response = await Character.findAll({
        where: {
          userId
        }
      })
      
      //FIX se o user não tiver characters
      if(!response) return res.status(404).json({ error: "User doesn't have characters" })
  
      return res.status(200).json({
        response
      })
    }

    const response = await Character.findAll()

    res.status(200).json({
      response
    })
  },

  create: async (req: Request, res: Response) => {
    const { userId } = req.params
    const { name } = req.body    

    const userIdNumber = Number(userId)

    const user = await User.findByPk(userIdNumber)

    if(!user) 
      return res.status(404).json({ error: "User not found" })

    const response = await Character.create({
      userId: user.dataValues.id,
      name,
    })

    return res.status(201).json({
      response
    })
  },

  update: async (req: Request, res: Response) => {
    const { characterId } = req.params

    const valuesToUpdate = req.body

    const character = await Character.findOne({
      where: {
        id: characterId,
      }
    })

    if (character) {
      const response = await Character.update({
        ...valuesToUpdate 
      }, {
        where: {
          id: characterId
        }
      })

      return res.status(200).json({
        response
      })
    }
  },

  delete: async (req: Request, res: Response) => {
    const { characterId } = req.params

    const response = await Character.destroy({
      where: {
        id: characterId
      },
      force: true
    })
    
    if (response === 1) {
      res.status(200).json({
        success: "character has been deleted"
      })
    }

    res.status(404).json({
      error: "character not found"
    })
  }
}

export default CharacterController