 import { DataTypes, Model } from "sequelize"
import sequelizeConnection from ".."

interface ICharacter {
  id?: number;
  userId: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Character extends Model<ICharacter> implements ICharacter {
  public id!: number
  public userId!: number
  public name!: string

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Character.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id'},
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: true
})

export default Character