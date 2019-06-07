// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const browserify = require("@cypress/browserify-preprocessor");

// Reconfigure browserify to process typescript source files.
module.exports = on => {
  const options = {
    browserifyOptions: {
      extensions: [".js", ".ts"],
      plugin: [["tsify"]]
    }
  };

  on("file:preprocessor", browserify(options));
};
