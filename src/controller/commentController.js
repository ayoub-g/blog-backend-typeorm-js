const express = require("express");
const HttpStatus = require("http-status-codes");
const url = require("url");
module.exports = class CommentController {
  constructor(commentRespository) {
    this.router = express.Router();
    this.commentRepository = commentRespository;
    this.router.post("/", this.addComment);
    this.router.get("/", this.getPostComments);
  }
  getPostComments = async (req, res) => {
    const { postId } = url.parse(req.url, true).query;
    console.log(postId);
    try {
      if (postId) {
        const comments = await this.commentRepository
          .createQueryBuilder("comment")
          .where("comment.post = :postId", { postId: postId })
          .select([
            "comment.id as id",
            "comment.content as content",
            "comment.date as date",
            "comment.responseToCommentId",
            "comment.userId as userId",
            "comment.postId as postId",
          ])
          .orderBy("date", "DESC")
          .getRawMany();
        res.status(HttpStatus.StatusCodes.OK).json(comments);
      } else {
        res
          .status(HttpStatus.StatusCodes.BAD_REQUEST)
          .json({ message: "missing query parameters" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "error" });
    }
  };

  addComment = async (req, res) => {
    const comment = req.body;
    try {
      if (
        comment &&
        comment.content &&
        comment.date &&
        comment.user &&
        comment.post
      ) {
        await this.commentRepository.save(comment);
        res.status(HttpStatus.StatusCodes.CREATED).json({ message: "OK" });
      } else {
        res
          .status(HttpStatus.StatusCodes.BAD_REQUEST)
          .json({ message: "missing query parameters" });
      }
    } catch (error) {
      // console.log(error);
      res
        .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "error" });
    }
  };
};
