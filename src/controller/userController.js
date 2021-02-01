const express = require("express");
const HttpStatus = require("http-status-codes");
const url = require("url");
const UserInfo = require("../model/userinfo").UserInfo;

module.exports = class UserController {
  userRepository;
  constructor(userRepository) {
    this.router = express.Router();
    this.userRepository = userRepository;
    this.router.post("/", this.addUser);
    this.router.delete("/", this.deleteUser);
    this.router.get("/", this.getUserByEmail);
  }
  getUserByEmail = async (req, res) => {
    const { email } = url.parse(req.url, true).query;

    if (email) {
      try {
        const user = await this.userRepository
          .createQueryBuilder("user")
          .where("user.email = :email", { email: email })
          .getOne();
        if (user) {
          res.status(HttpStatus.StatusCodes.OK).json(user);
        } else {
          // post not found
          res
            .status(HttpStatus.StatusCodes.NOT_FOUND)
            .json({ message: "user not found" });
        }
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

  addUser = async (req, res) => {
    const user = req.body;
    if (user && user.firstname && user.lastname && user.email) {
      try {
        await this.userRepository.save(user);
        res.status(HttpStatus.StatusCodes.OK).json({ message: "ok" });
      } catch (error) {
        if (error.code) {
          switch (error.code) {
            case "23505":
              res
                .status(HttpStatus.StatusCodes.CONFLICT)
                .json({ message: "mail address alreay registred" });
              break;
            default:
              // console.log(error);
              res
                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "error" });
              break;
          }
        } else {
          console.log(error);
        }
      }
    } else {
      res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .json({ message: "missing query parameters" });
    }
  };

  deleteUser = async (req, res) => {
    console.log("deleting user ...");
    const { id } = url.parse(req.url, true).query;
    if (id) {
      this.userRepository
        .createQueryBuilder()
        .delete()
        .from(UserInfo)
        .where("id = :id", { id: id })
        .execute();
      res.status(HttpStatus.StatusCodes.OK).json({ message: "deleted" });
    } else {
      res
        .status(HttpStatus.StatusCodes.BAD_REQUEST)
        .json({ message: "missing query parameters" });
    }
  };
};
