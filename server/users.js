'use strict';
let R = require('ramda');
let User = require('./user');

let Users = function() {
  this.users = {};
};
Users.prototype.addUser = function (socketId) {
  this.users[socketId] = new User(socketId);
};
Users.prototype.removeUser = function (socketId) {
  delete this.users[socketId];
};
Users.prototype.find = function (socketId) {
  return this.users[socketId];
};
Users.prototype.pickDrawer = function () {
  let userArray = this.getUserList();
  let randomIndex = Math.floor(Math.random() * userArray.length);
  return userArray[randomIndex].id;
};
Users.prototype.getUserList = function () {
  return R.values(this.users);
};
Users.prototype.allReady = function () {
  let userArray = this.getUserList();
  let isReady = R.propEq('isReady', true);
  return R.all(isReady)(userArray);
};
Users.prototype.unReadyAll = function () {
  Object.keys(this.users).forEach(id => this.users[id].isReady = false);
};

module.exports = Users;