//TODO: handle text & parameters with npm 'commander'
if (process.argv.length <= 2) {
    console.log('Usage: run $node index.js --csvFilePath [path.csv] --outputFileName [name.json]')
    console.log('Options: \n --csvFilePath \t Path to csv to convert (needed) \n --outputFileName \t ' +
        'Name of the json created (needed) \n --delimiter \t Delimiter seperating columns (optional). ' +
        'Default "auto", specify as --delimiter "\\n" \n' + 
        '--eol \t End of line - If omitted; auto-attempting, specify as --eol "\\n"')
    process.exit(1);
}

let csvFilePath
let csvFilePathIndex = process.argv.indexOf('--csvFilePath')
if (csvFilePathIndex > -1 && process.argv[csvFilePathIndex + 1] != null) {
    csvFilePath = process.argv[csvFilePathIndex + 1];
} else {
    console.error('--csvFilePath argument required! 💩');
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

//TODO: use streams to read and write -> single lines
const fsLibrary = require('fs').promises
const csvtojson = require('csvtojson');
let resultJson;
csvtojson(parserParameters)
    .fromFile(csvFilePath)
    //Convert to string and modify JSON notation for Elasticdump
    .then(async (jsonObj) => {
        //Strip JSON Array from commas after every JSON Object
        resultJson = JSON.stringify(jsonObj).replace(/(?<=})(\s*,)/g, "\n")
        //Strip first and last char being [ & ]
        resultJson = resultJson.slice(1, -1)
        await fsLibrary.writeFile(`${outputFileName}`, resultJson, (error) => {
            if (error) throw err;
        }).then(() => {
            console.log(`Succesfully wrote ${(resultJson.match(/\n/g) || '').length + 1} lines`)
        })
    })
