import { Request, Response } from "express"
import { property } from "lodash"
import { PropertyAttributes, UserAttributes } from "../constants/types"
import { Property } from "../models/properties.model"
import { User } from "../models/users.model"

const _ = require('lodash')

// 400 Bad Request -> The 400 status code, or Bad Request error, means the HTTP request that was sent to the server has invalid syntax.
// 401 unauthneticated
// 403 unauthorized

// @desc    fetch all properties
// @route   GET /properties
// @access  Public
const getAllProperties = async (req: Request, res: Response) => {
  let properties: Array<object> = []
  let userProperties: Array<object> | [] = []
  let userId: string | undefined

  const maxRent = await Property.find().sort({ 'rent': -1 }).limit(1)
  const maxSize = await Property.find().sort({ 'size': -1 }).limit(1)

  try {
    userId = req?.header('UserId')

    properties = await Property.find({})

    if (userId) {
      userProperties = await Property.find({ userId })
      properties = _.filter(properties, function(storage_unit: PropertyAttributes) {
        return storage_unit.userId !== userId
      })
    }

    if (
      !properties ||
      !userProperties ||
      !properties.every((property) => property instanceof Property)
    ) throw new Error('Could not retrieve all properties')

    res.status(200).send({ properties: [ ...userProperties, ...properties ], maxRent, maxSize })
    // res.status(200).send({ properties })
  } catch (err) {
    let errorMessage = 'Wrong credentials'

    if (err instanceof Error){
      errorMessage = err.message
    }

    res.status(403).send({ error: err.message })
  }
}

// @desc    filter  properties
// @route   POST /properties
// @access  Public
const filterAllproperties = async (req: Request, res: Response) => {
  let properties
  try {
    const { state, area, rent, size } = req.body
    console.log(area);
    
    if (!req.body) throw new Error('Error Occured -> Filtering Properties')

    // const maxRent = await Property.find().sort({ 'rent': -1 }).limit(1)
    // const maxSize = await Property.find().sort({ 'size': -1 }).limit(1)
    properties = await Property.find({ $or: [{ 'state': { $regex : new RegExp(state, "i")} }, { 'area': { $in : area }}, { 'rent': rent }, { 'size': size }] }).exec()

    if (!properties || !properties.every((property: any) => property instanceof Property)) {
      throw new Error('Couldnt filter property')
    }
    res.status(200).send({ properties })
  } catch (err) {
    let errorMessage = 'Something went wrong, Filtering Properties'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(400).send({ error: err.message})
  }
}


// @desc    post/create a property
// @route   POST /properties/create
// @access  Private
const createProperty = async (req: Request, res: Response) => {
  try {
    // const userData = res.locals.user
    const userData = '6287baf586202f252de91d1f'
    if (!userData) throw new Error("Authentication invalid")
    const newProperty: PropertyAttributes = req.body

    const property = await new Property({ ...newProperty, userId: userData }).save()

    if (!property || !(property instanceof Property)) {
      throw new Error('Error happened with Creating Property Instance')
    }

    res.status(201).send({ message: 'Property Created' })
  } catch (err) {
    let errorMessage = 'Unable to create Property'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(400).send({ error: err.message })
  }
}

// @desc    fetch property by id
// @route   GET /properties/:id
// @access  Public
const getProperty = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id

    const property = await Property.findById(id)

    if (!property || !(property instanceof Property)) throw new Error('Property not found')

    const user = await User.findById(property.userId)

    if (!user || !(user instanceof User)) throw new Error('Associated User not found')

    res.status(200).send({ property, user })
  } catch (err) {
    console.log(err)

    let errorMessage = 'Unable to fetch property'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(400).send({ error: err.message })
  }
}


// @desc    delete property by id
// @route   DELETE /properties/:id
// @access  Private
const deleteProperty = async (req: Request, res: Response) => {
  let user: UserAttributes
  let property: PropertyAttributes | null

  try {
    const id: string = req.params.id

    user = res.locals.user

    if (!user || !(user instanceof User)) {
      throw new Error('User Not Found or Unauthorized to Delete this associated property')
    }

    property = await Property.findById(id)

    if (user._id !== property?.userId) {
      throw new Error('Unauthorized operation')
    }

    await Property.findByIdAndRemove({ _id: id })

    res.status(200).send({ message: 'Property deleted Successfully' })
  } catch (err) {
    let errorMessage = 'Unable to delete the property'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(403).send({ error: err.message })
  }
}

export { getAllProperties, createProperty, getProperty, deleteProperty, filterAllproperties }