const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Post = require("../model/post").Post; // import {Post} from "../model/Post";

module.exports = new EntitySchema({
  name: "Post",
  target: Post,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    date: { type: "date" },
    content: {
      type: "text",
    },
  },
  relations: {
    user: {
      target: "UserInfo",
      type: "many-to-one",
      joinTable: false,
      joinColumn: true,
      cascade: false,
    },
  },
});
