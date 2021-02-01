const config = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "username",
  password: "",
  database: "databasename",
  synchronize: true,
  logging: false,
  entities: [
    require("./entity/UserInfoSchema"),
    require("./entity/PostSchema"),
    require("./entity/CommentSchema"),
  ],
};
module.exports = config;
