///const inquirer = require('inquirer');
const components = require("./components/functions.js")




const questions = [
  {
    type: 'input',
    name: 'file',
    message: "What file would you like to use?",
  }
];
/*
inquirer.prompt(questions).then(answers => {
  console.log(` You will be using Batch File ${answers.file}!`);
});
*/
components.runBatchFile();