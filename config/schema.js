const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const installations = new Schema({
  name: {
    type: String,
    required: true
  },
  _id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

const repo = new Schema({
  name: {
    type: String,
    required: true
  },
  orgName: {
    type: String,
    required: true
  },
  repoId: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  curlUrl: {
    type: String,
    required: true
  },
  ref: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});


const installation = mongoose.model('installation',installations);
const repos = mongoose.model('repos',repo)

module.exports ={

    installation:installation,
    repos:repos
}
