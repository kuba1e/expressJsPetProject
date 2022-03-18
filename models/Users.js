const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: {
  type: String,
  required: true
},
age:{
  type: String,
  required: true
},
position: {
  type: String,
  required: true
},
img: {
  type: String
}
}) 


module.exports = model('Users', schema)