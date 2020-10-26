//TODO: handle text & parameters with npm 'commander'
if (process.argv.length <= 2) {
    console.log('Usage: run $node index.js --csvFilePath [path.csv] --outputFileName [name.json]')
    console.log('Options: \n --csvFilePath \t Path to csv to convert (needed) \n --outputFileName \t ' +
        'Name of the json created (needed) \n --delimiter \t Delimiter seperating columns (optional). ' +
        'Default "\\t", specify as --delimiter "\\n" ')
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
    delimiter = '\t'
}

const parserParameters = {
    quote: "off",
    delimiter: delimiter,
    checkType: true
}

//TODO: use streams to read and write -> single lines
const fsLibrary = require('fs').promises
const csv = require('csvtojson')
let resultJson
csv(parserParameters)
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
