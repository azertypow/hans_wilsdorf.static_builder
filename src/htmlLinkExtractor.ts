// scrapeHtmlLinks.js
import {promises as fs} from 'node:fs'
import path from 'node:path'
import { readFileSync } from "node:fs"
import type {ILinkInfo} from "./linksInterfaces.js";

async function getAllFiles(dir: string, fileList: string[] = []): Promise<string[]> {
    const files = await fs.readdir(dir)

    for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = await fs.stat(filePath)

        if (stat.isDirectory()) {
            // Appel récursif pour les sous-répertoires
            fileList = await getAllFiles(filePath, fileList)
        } else {
            fileList.push(filePath)
        }
    }

    return fileList
}

async function extractMediaLinks(filePath: string): Promise<ILinkInfo[]> {
    const content = readFileSync(filePath, "utf-8");

    const regex = /\/media\/[^\s"')]+/g;

    return content.match(regex)?.map(value => {
        return {
            file: filePath,
            href: value,
        }
    }) || []
}

export default async function() {
    const inputDirectory: string | undefined = process.argv[2]

    if (!inputDirectory) {
        console.error("Veuillez indiquer le dossier d'entré")
        process.exit(1)
    }

    const outputDir = path.join(process.cwd(), inputDirectory)

    try {
        await fs.access(outputDir)
    } catch (error) {
        console.error(`Le dossier "${outputDir}" n'existe pas.`)
        process.exit(1)
    }

    console.log(`Recherche des liens dans les fichiers du dossier "${outputDir}"...`)

    const allFiles = await getAllFiles(outputDir)

    const jsonFiles = allFiles.filter(file => path.extname(file).toLowerCase() === '.json')
    console.log(`${jsonFiles.length} fichiers trouvés.`)

    // Extraire les liens
    const allLinks: ILinkInfo[] = []
    for (const htmlFile of jsonFiles) {
        const links = await extractMediaLinks(htmlFile)
        allLinks.push(...links)
    }

    console.log(`\n${allLinks.length} liens trouvés :\n`)

    return allLinks
}
