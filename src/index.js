const PORT = 3000;
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

const config = require("./config");
const { createConnection } = require("typeorm");
const { UserInfo } = require("./model/userinfo");
const { Post } = require("./model/post");
const { Comment } = require("./model/comment");
const UserController = require("./controllers/userController");
const CommentController = require("./controllers/commentController");
const PostController = require("./controllers/postController");

const timeout = require("connect-timeout");
const app = express();
const server = http.createServer(app);

(async () => {
  try {
    const connection = await createConnection(config);
    app.use(timeout("15s"));
    app.use(
      express.json({
        verify: (req, res, buf, encoding) => {
          try {
            JSON.parse(buf);
          } catch (e) {
            res
              .status(400)
              .send("{message: the request is not in the json format}");
            throw Error("invalid JSON");
          }
        },
      })
    );
    const userController = new UserController(
      connection.getRepository(UserInfo)
    );
    const postController = new PostController(connection.getRepository(Post));
    const commentController = new CommentController(
      connection.getRepository(Comment)
    );

    app.use("/api/user", userController.router);
    app.use("/api/post", postController.router);
    app.use("/api/comment", commentController.router);
    app.use(bodyParser.json({ limit: "1mb" }));
    app.use(
      bodyParser.urlencoded({
        limit: "1mb",
        extended: true,
        parameterLimit: 20,
      })
    );

    // error handler
    app.use((err, req, res, next) => {
      // const  fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      // console.log(fullUrl);
      if (err.name === "ValidationError") {
        var valErrors = [];
        Object.keys(err.errors).forEach((key) =>
          valErrors.push(err.errors[key].message)
        );
        res.status(422).send(valErrors);
      }
    });
    server.listen(PORT, () => {
      console.log(`server started at port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
