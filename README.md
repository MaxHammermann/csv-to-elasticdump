<h2 align="left">CSV/TSV to Elasticdump</h2>

Super small script turning a csv/tsv into lines of JSON objects **not** seperated by comma but "\n" instead. 
This notation is needed by Elasticdump to bulk-index a JSON into Elasticsearch.
The csv conversion is done by utilizing the npm package 'csvtojson'.

#####Please contribute to make this a NPM package

## Features
Turn a (csv)tsv
```textmate
biblio_id   author  year    titel   source  link
00001	Hoge, A. R.  & S. A. R. W. L. Romano-Hoge	1983	Notas sobre micro e ultra-estructura de “Oberhäutchen” em Viperoidea.	Mem. Inst. Butantan 44/45: 81-118 [1980/81]	http://bibliotecadigital.butantan.gov.br/colecao/memorias-do-instituto-butantan
00002	Abdala V.	1990	MORPHOMETRICS IN TWO SPECIES OF GENUS PHIMOPHIS (COPE OPHIDIA COLUBRIDAE) [in Spanish].	Acta Zoologica Lilloana 39 (2): 85-90.	
00003	Abdala V.  Lavilla E O.	1994	Synonymy and chresonymy of Homonota fasciata (Sauria: Gekkonidae) [in Spanish].	Acta Zoologica Lilloana 42 (2): 279-282	
00004	Abe,A.S. & Fernandes,W.	1977	Polymorphism in Spilotes pullatus anomalepis BOCOURT (Reptilia, Serpentes: Colubridae).	Journal of Herpetology 11 (1): 98-100	http://www.jstor.org/action/showPublication?journalCode=jherpetology
```

into multiple JSON lines **not** seperated by a comma
```JSON
{"biblio_id":1,"author":"Hoge, A. R.  & S. A. R. W. L. Romano-Hoge","year":1983,"titel":"Notas sobre micro e ultra-estructura de “Oberhäutchen” em Viperoidea.","source":"Mem. Inst. Butantan 44/45: 81-118 [1980/81]","link":"http://bibliotecadigital.butantan.gov.br/colecao/memorias-do-instituto-butantan"}
{"biblio_id":2,"author":"Abdala V.","year":1990,"titel":"MORPHOMETRICS IN TWO SPECIES OF GENUS PHIMOPHIS (COPE OPHIDIA COLUBRIDAE) [in Spanish].","source":"Acta Zoologica Lilloana 39 (2): 85-90.","link":""}
{"biblio_id":3,"author":"Abdala V.  Lavilla E O.","year":1994,"titel":"Synonymy and chresonymy of Homonota fasciata (Sauria: Gekkonidae) [in Spanish].","source":"Acta Zoologica Lilloana 42 (2): 279-282","link":""}
{"biblio_id":4,"author":"Abe,A.S. & Fernandes,W.","year":1977,"titel":"Polymorphism in Spilotes pullatus anomalepis BOCOURT (Reptilia, Serpentes: Colubridae).","source":"Journal of Herpetology 11 (1): 98-100","link":"http://www.jstor.org/action/showPublication?journalCode=jherpetology"}   
```

## Usage

Clone the repository and perform a
    
    npm install

Run the index.js file with node by executing

    node index.js --csvFilePath [path.csv] --outputFileName [name.json]

**Options**

* **csvFilePath**: (required)       Path to csv to convert
* **outputFileName**: (required)        Name of the json created 
* **delimiter**: (optional)     Delimiter seperating columns. Default "\t", specify as --delimiter "\n" 


## Before using Elasticdump
The JSON you want to index needs to be the value of the `_source` object when importing, e.g.
```JSON
{
  "_index": "bibliography",
  "_type": "_doc",
  "_id": "1",
  "_score": 1,
  "_source": {
    "titel": "Polymorphism in Spilotes pullatus anomalepis BOCOURT (Reptilia, Serpentes: Colubridae).",
    "year": 1977,
    "biblio_id": 6,
    "author": "Abe,A.S. & Fernandes,W.",
    "id": 1,
    "@version": "1",
    "@timestamp": "2019-12-04T13:49:17.438Z",
    "link": "http://www.jstor.org/action/showPublication?journalCode=jherpetology",
    "source": "Journal of Herpetology 11 (1): 98-100"
  }
}
```

This can be achieved upon indexing by calling Elasticdump with the `transform` option

    --transform="doc._source=Object.assign({},doc)"
