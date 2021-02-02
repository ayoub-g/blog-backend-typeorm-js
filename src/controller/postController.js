const express = require("express");
const HttpStatus = require("http-status-codes");
const Post = require("../model/post").Post;
const url = require("url");

module.exports = class PostController {
  constructor(postRepository) {
    this.postRepository = postRepository;
    this.router = express.Router();
    this.router.post("/", this.addPost);
    this.router.patch("/", this.updatePost);
    this.router.delete("/", this.deletePost);
    this.router.get("/", this.getPost);
  }
  getPost = async (req, res) => {
    const { id } = url.parse(req.url, true).query;
    if (!id) {
      res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .json({ message: "missing query parameters" });
    } else {
      try {
        if (id) {
          //console.log("post id: ", id);
          const post = await this.postRepository
            .createQueryBuilder("post")
            .where("post.id = :id", { id })
            .getOne();
          if (post) {
            res.status(HttpStatus.StatusCodes.OK).json(post);
          } else {
            // post not found
            res
              .status(HttpStatus.StatusCodes.NOT_FOUND)
              .json({ message: "post not found" });
          }
        }
      } catch (error) {
        // console.log(error)
        res
          .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "error" });
      }
    }
  };

  addPost = async (req, res) => {
    try {
      let post = req.body;
      if (post && post.content && post.date && post.user) {
        await this.postRepository.save(post);
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
  updatePost = async (req, res) => {
    let post = req.body;
    if (post.id) {
      try {
        await this.postRepository
          .createQueryBuilder()
          .update(Post)
          .set(post)
          .where("id = :id", { id: post.id })
          .execute();
        res.status(HttpStatus.StatusCodes.CREATED).json({ message: "OK" });
      } catch (error) {
        // console.log(error);
        res
          .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "error" });
      }
    } else {
      res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .json({ message: "missing query parameters" });
    }
  };
  deletePost = async (req, res) => {
    try {
      const { id } = url.parse(req.url, true).query;
      if (id) {
        await this.postRepository
          .createQueryBuilder()
          .delete()
          .from(Post)
          .where("id = :id", { id })
          .execute();
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
