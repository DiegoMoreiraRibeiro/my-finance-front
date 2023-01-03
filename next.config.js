/** @type {import('next').NextConfig} */
const path = require("path");
const withOffline = require("next-offline");
const webpack = require("webpack");

console.log("variavel NODE_ENV: " + `.env.${process.env.NODE_ENV}`);
require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    AMBIENTE: process.env.AMBIENTE,
    API: process.env.API,
  },
  publicRuntimeConfig: {
    basePath: "/",
  },
};

module.exports = nextConfig;
