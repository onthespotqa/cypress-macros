import { defineConfig } from "cypress";
const browserify = require("@cypress/browserify-preprocessor");

export default defineConfig({
  video: false,
  screenshots: true,
  reporter: "junit",
  reporterOptions: {
    mochaFile: "cypress/results/result-[hash].xml"
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      const options = {
        browserifyOptions: {
          extensions: [".js", ".ts"],
          plugin: [["tsify"]]
        }
      };

      on("file:preprocessor", browserify(options));
    }
  }
});
