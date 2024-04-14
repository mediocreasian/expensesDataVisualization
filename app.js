const inquirer = require("inquirer");
const components = require("./components/functions.js");
const fs = require("fs");

const questions = [
  {
    type: "input",
    name: "file",
    message: "What file would you like to use?",
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    if (fs.existsSync(answers.file+".xlsx")) {
      console.log(`You will be using Batch File ${answers.file}!`);
      components.runBatchFile(answers.file);
    } else {
      console.log(` Batch File ${answers.file} , does not exist !`);
    }
  })
  .catch((error) => {
    console.dir(error);
  });
