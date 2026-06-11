import bcrypt from "bcryptjs";
import validator from "validator";

import User from "../models/User.js";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateToken.js";

import RefreshToken
from "../models/RefreshToken.js";

export const registerUser =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "All fields are required"
          });
      }

      if (
        !validator.isEmail(
          email
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid email"
          });
      }

      const existingUser =
        await User.findOne({
          email
        });

      if (
        existingUser
      ) {
        return res
          .status(400)
          .json({
            message:
              "User already exists"
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword
        });

      const accessToken =
        generateAccessToken(
          user._id
        );

      const refreshToken =
        generateRefreshToken(
          user._id
        );

        await RefreshToken.create({
  userId: user._id,

  token: refreshToken,

  expiresAt:
    new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    )
});
await RefreshToken.create({
  userId: user._id,

  token: refreshToken,

  expiresAt:
    new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    )
});

      return res
        .status(201)
        .json({
          success: true,

          user: {
            id: user._id,
            name: user.name,
            email:
              user.email
          },

          accessToken,
          refreshToken
        });

    } catch (error) {
      return res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };

  //login user
  export const loginUser =
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Email and password are required"
          });
      }

      const user =
        await User.findOne({
          email
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found"
          });
      }

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          user.password
        );

      if (
        !isPasswordCorrect
      ) {
        return res
          .status(401)
          .json({
            message:
              "Invalid credentials"
          });
      }

      const accessToken =
        generateAccessToken(
          user._id
        );

      const refreshToken =
        generateRefreshToken(
          user._id
        );

      return res
        .status(200)
        .json({
          success: true,

          user: {
            id: user._id,
            name: user.name,
            email:
              user.email
          },

          accessToken,
          refreshToken
        });

    } catch (error) {
      return res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };

  export const getProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.userId
        ).select(
          "-password"
        );

      return res
        .status(200)
        .json({
          success: true,
          user
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };

  export const refreshAccessToken =
  async (req, res) => {

    try {

      const {
        refreshToken
      } = req.body;

      if (
        !refreshToken
      ) {
        return res
          .status(401)
          .json({
            message:
              "Refresh token required"
          });
      }

      const storedToken =
        await RefreshToken.findOne({
          token:
            refreshToken
        });

      if (
        !storedToken
      ) {
        return res
          .status(403)
          .json({
            message:
              "Invalid refresh token"
          });
      }

      const decoded =
        jwt.verify(
          refreshToken,
          process.env
            .JWT_REFRESH_SECRET
        );

      const newAccessToken =
        generateAccessToken(
          decoded.userId
        );

      return res
        .status(200)
        .json({
          accessToken:
            newAccessToken
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };