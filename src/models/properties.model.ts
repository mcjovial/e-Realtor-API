import mongoose from 'mongoose'
import { PropertyAttributes } from '../constants/types'
import { User } from './users.model'

const Schema = mongoose.Schema

interface PropertyCreationAttributes extends mongoose.Model<PropertyDoc> {
  build(attr: PropertyAttributes): PropertyDoc
}

interface PropertyDoc extends mongoose.Document {
  _id?: string
  title: string
  description: string
  size: number
  rent: number
  state: string
  area: string
  street: string
  services: Array<string>
  images: Array<string>
  userId: string
}

const propertySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    default: 'Enugu',
    required: true
  },
  area: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  services: [String],
  images: [String],
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    require: true
  }
}, { timestamps: true })

const Property = mongoose.model<PropertyDoc, PropertyCreationAttributes>('Property', propertySchema)

propertySchema.statics.build = (attr: PropertyAttributes) => {
  return new Property(attr)
}

export { Property }