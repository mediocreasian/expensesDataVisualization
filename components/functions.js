
require('dotenv').config();
const uri =process.env.uri;
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const XLSX = require("xlsx");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true,
  },
});

formatDate = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

insertExcelRecords = async (batchRecords) => {
  var result = "";
  try {
    var dbo = client.db("finance"); // ! Use this database

    var myColl = dbo.collection("2024"); // ! Use this table/collection

    await myColl.insertMany(batchRecords, { ordered: false }).then(() => {
      result = "Successfully Inserted all";
    });
  } catch (error) {
    console.dir(error);
    result = error;
  } finally {
    await client.close();
    return result;
  }
};

exports.runBatchFile = () => {
  var x = []; // * Assign an Array

  // * Assign the Excel file
  var workbook = XLSX.readFile("2024_spending.xlsx");
  var sheet_name_list = workbook.SheetNames; // * Give the Name list of all the sheets of the Excel File
  // * assign the WorkSheet
  var workSheet = workbook.Sheets[sheet_name_list[1]];
  // * skip the first row */
  var range = XLSX.utils.decode_range(workSheet["!ref"]);
  range.s.r = 1; // * <-- zero-indexed, so setting to 1 will skip row 0
  workSheet["!ref"] = XLSX.utils.encode_range(range); // * Pass the range back to the workSheet

  var xlData = XLSX.utils.sheet_to_json(workSheet); // * It is an Object, not a JSON file due to the String Characters

  for (i = 0; i < Object.keys(xlData).length; i++) {
    let json_Obj = {}; // * Assign a JSON Obj

    json_Obj["_id"] = new ObjectId();

    json_Obj["Date"] = formatDate(xlData[i]["Date and time"]);
    json_Obj["Category"] = xlData[i].Category;
    json_Obj["Amount"] = xlData[i]["Amount in default currency"];
    //json_Obj["Amount"] = xlData[i]["sda"];

    x[i] = json_Obj;
  }
  insertExcelRecords(x).then((result) => {
    // ! Call back function
    console.log("Succesfull Insertion : ", result);
  });
};
