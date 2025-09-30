import htmlLinkExtractor from "./htmlLinkExtractor.js"
import writeLinksInJson from "./writeLinksInJson.js"
import execCmd from "./execCmd.js"
import fetchLinks from "./fetchLinks.js";
import path from "node:path";

const inputDirectory: string | undefined = process.argv[2]
const baseUrl: string | undefined = process.argv[3]

if (!inputDirectory) {
    console.error("Veuillez indiquer le dossier d'entré")
    process.exit(1)
}

if(!baseUrl) {
    console.error("Veuillez indiquer l'url de bae pour le fetch media")
    process.exit(1)
}


console.info(`Lancement du script 'npm run generate' avec l'input ${inputDirectory}`)
const exec_nuxt_generate = await execCmd('npm run generate', inputDirectory)
console.info(exec_nuxt_generate)


console.info('Extraction des liens, enregistrement dans un fichier json et fetch des medias')
const allLinks = await htmlLinkExtractor(inputDirectory)

writeLinksInJson(allLinks).then(jsonExportPath => {
    console.log(`Les résultats ont été enregistrés dans ${jsonExportPath}`)
})

const {fetch_successful_urls, fetch_failed_urls} = await fetchLinks(baseUrl, allLinks)
console.info(`Successful URLs: ${fetch_successful_urls.length}`)
console.info(`Failed URLs: ${fetch_failed_urls.length}`)
console.info(fetch_failed_urls)


console.info('Copie des medias dans le dossier static')
const exec_copy_medias_to_static_website_directory = await execCmd('npm run temp_prod_copy_media', inputDirectory)
console.info(exec_copy_medias_to_static_website_directory)


console.info("Remplacement des liens servie depuis l'API du backend par leur url relative")
const exec_clean_base_url = await execCmd('npm run temp_prod_replace_base_url', inputDirectory).catch(error => {
    console.error("Une erreur est survenue :", error)
    process.exit(1)
})
console.info(exec_clean_base_url)

const staticWebsitePath = path.join(process.cwd(), inputDirectory, '.output')

console.info(`
Site static généré correctement
${staticWebsitePath}
`)

process.exit(0)
