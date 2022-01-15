//TODO: handle text & parameters with npm 'commander'
let dataSet
let dataSetIndex = process.argv.indexOf('--dataset')
if (dataSetIndex > -1 && process.argv[dataSetIndex + 1] != null) {
  dataSet = process.argv[dataSetIndex + 1].toLowerCase();
} else {
  console.error('--dataset argument required! taxonomy/bibliography?');
}

if (process.argv.length <= 2) {
  console.log('Usage: run $node index.js --dumpFilePath [path.csv] --outputFileName [name.json]')
  console.log('Options: \n --dumpFilePath \t Path to csv to convert (needed) \n --outputFileName \t ' +
    'Name of the json created (needed) \n --delimiter \t Delimiter seperating columns (optional). ' +
    'Default "auto", specify as --delimiter "\\n" \n' +
    '--eol \t End of line - If omitted; auto-attempting, specify as --eol "\\n"')
  process.exit(1);
}

let dumpFilePath
let dumpFilePathIndex = process.argv.indexOf('--dumpFilePath')
if (dumpFilePathIndex > -1 && process.argv[dumpFilePathIndex + 1] != null) {
  dumpFilePath = process.argv[dumpFilePathIndex + 1];
} else {
  console.error('--dumpFilePath argument required! 💩');
  process.exit(1);
}

let outputFileName
let outputFileNameIndex = process.argv.indexOf('--outputFileName')
if (outputFileNameIndex > -1 && process.argv[outputFileNameIndex + 1] != null) {
  outputFileName = process.argv[outputFileNameIndex + 1];
  outputFileName += (outputFileName.includes('.json')) ? '' : '.json'
} else {
  console.error('--outputFileName argument required! 💩');
  process.exit(1);
}

let delimiter
let delimiterIndex = process.argv.indexOf('--delimiter')
if (delimiterIndex > -1 && process.argv[delimiterIndex + 1] != null) {
  delimiter = process.argv[delimiterIndex + 1];
} else {
  delimiter = 'auto'
}


const toJson = true

let eol
let eolIndex = process.argv.indexOf('--eol')
if (eolIndex > -1 && process.argv[eolIndex + 1] != null) {
  eol = process.argv[eolIndex + 1];
} else {
  eol = null
}

const parserParameters = {
  quote: "off",
  eol: eol,
  delimiter: delimiter,
  checkType: true
}

const fs = require('fs')
const csvtojson = require('csvtojson');
const headerFields = require("./config/csv_header");
const readline = require('readline');
const removeChars = require('./modules').removeCharacters
const updateProgress = require('./modules').updateProgress
const deleteExisting = require('./modules').deleteExisting
const tmpFilePath = './tmp/temp_tsv.tsv'

async function processLineByLine() {
  //fs for input txt file - utf16le necessary
  const dumpFileStream = fs.createReadStream(dumpFilePath, {encoding: 'utf16le'});

  let csvHeader
  //check if there is a csv header for specified dataSet
  if (dataSet.indexOf(Object.keys(headerFields))) {
    csvHeader = headerFields[dataSet].join('\t').toString() + '\r'
  } else {
    throw new Error(`Csv headers could not be specified with provided dataset name. \n Reading ${dumpFilePath}`)
  }

  //Write header into tmp dir to append tsv data in next step
  const tmpWriteStream = fs.createWriteStream(tmpFilePath, {encoding: 'utf8'})
  tmpWriteStream.write(csvHeader)

  const rl = readline.createInterface({
    input: dumpFileStream,
    crlfDelay: Infinity
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    let newLine = removeChars(line) + '\r'
    tmpWriteStream.write(newLine)
  }
}

async function saveAsJson() {
  deleteExisting(outputFileName).then(() => {
    csvtojson(parserParameters)
      .fromFile(tmpFilePath)
      //Convert to string and modify JSON notation for Elasticdump
      //onError, onCompleted callbacks possible
      .subscribe((json, lineNumber) => {
        return new Promise(async (resolve) => {
          //append lineByLine to final JSON. Add \n to break after every Object.
          fs.appendFile(`${outputFileName}`, JSON.stringify(json) + '\n', (error) => {
            if (error) throw error;
          })
          updateProgress(lineNumber)
          resolve()
        })
      })
      .then(() => {
        console.log("\n complete")
      })
  })
}

processLineByLine().then(() => {
  if (toJson) {
    //TODO: After conversion, read into ES with elasticdump
    saveAsJson().then()
  }
})
