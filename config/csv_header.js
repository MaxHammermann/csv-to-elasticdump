//Taxonomy csv fields
//list_id === NCBI taxonID
const taxonomy = ["taxa", "genus", "species", "author", "year", "parentheses", "species_author_year", "subspecies", "common_names", "distribution", "comments", "diagnosis", "types", "picture_links", "reference_numbers", "etymology", "ncbi_id", "redlist_id", "superfamily"]

//Bibliography csv fields
const bibliography = ["biblio_id", "author", "year", "titel", "source", "link"]

module.exports = {
  taxonomy,
  bibliography
}
