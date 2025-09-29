import path from "node:path";
import fs from "node:fs/promises";
import type {ILinkInfo} from "./linksInterfaces.js";

export default async function(allLinks: ILinkInfo[]) {
    const projectFolder = new URL('./.output', import.meta.url)
    const jsonExportPath = path.join(projectFolder.pathname, 'html-links.json')

    await fs.writeFile(jsonExportPath, JSON.stringify(allLinks, null, 2))

    return jsonExportPath
}
