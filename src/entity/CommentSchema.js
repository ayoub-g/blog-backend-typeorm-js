const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Comment = require("../model/comment").Comment; // import {Post} from "../model/Post";

module.exports = new EntitySchema({
  name: "Comment",
  target: Comment,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    content: {
      type: "text",
    },
    date: { type: "date" },
  },
  relations: {
    responseToComment: {
      target: "Comment",
      type: "one-to-one",
      joinTable: false,
      joinColumn: true,
      cascade: false,
      nullable: true,
    },
    user: {
      target: "UserInfo",
      type: "many-to-one",
      joinTable: false,
      joinColumn: true,
      cascade: false,
      nullable: false,
    },
    post: {
      target: "Post",
      type: "many-to-one",
      joinColumn: true,
      joinTable: false,
      cascade: false,
    },
  },
});
