import htmlLinkExtractor from "./htmlLinkExtractor.js";
import writeLinksInJson from "./writeLinksInJson.js";
import type {ILinkInfo} from "./linksInterfaces.js";

htmlLinkExtractor().catch(error => {
    console.error("Une erreur est survenue :", error)
    process.exit(1)
}).then(async allLinks => {
    writeLinksInJson(allLinks).then(jsonExportPath => {
        console.log(`Les résultats ont été enregistrés dans ${jsonExportPath}`)
    })

    const fetch_successful_urls = []
    const fetch_failed_urls = []

    for (const link of allLinks) {
        const url = new URL(link.href, 'http://hw-cms.test/')
        // const url = new URL(link.href, 'http://localhost:8000/')
        try {
            const response = await fetch(url);
            if (response.ok) {
                fetch_successful_urls.push(url)
            } else {
                fetch_failed_urls.push(url)
                console.error(`Fetch failed for ${url}: ${response.status}`)
            }
        } catch (error) {
            fetch_failed_urls.push(url)
            console.error(`Fetch error for ${url}:`, error)
        }
    }

    console.log(`Successful URLs: ${fetch_successful_urls.length}`)
    console.log(`Failed URLs: ${fetch_failed_urls.length}`)
    console.log(fetch_failed_urls)
})
