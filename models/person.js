const mongoose = require('mongoose')

require('dotenv').config()

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{3,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    minLength: [8, 'Phone number must be at least 8 characters long'],
    required: [true, 'Phone number required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)