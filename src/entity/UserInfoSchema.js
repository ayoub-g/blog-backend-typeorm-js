const EntitySchema = require("typeorm").EntitySchema;
const UserInfo = require("../model/userinfo").UserInfo;

module.exports = new EntitySchema({
  name: "UserInfo",
  target: UserInfo,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    firstname: {
      type: "varchar",
    },
    lastname: {
      type: "varchar",
    },
    email: { type: "varchar", unique: true },
  },
});
