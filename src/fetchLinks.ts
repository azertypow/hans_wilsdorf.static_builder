import type {ILinkInfo} from "./linksInterfaces.js";

export default async function (baseUrl: string, allLinks: ILinkInfo[]) {
    const fetch_successful_urls = []
    const fetch_failed_urls = []

    for (const link of allLinks) {
        const url = new URL(link.href, baseUrl)
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

    return {
        fetch_failed_urls,
        fetch_successful_urls,
    }
}
