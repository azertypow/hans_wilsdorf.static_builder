import util from "node:util"
import {exec} from "child_process";

export default async function (commande: string, processPath: string){
    const execAsync = util.promisify(exec)

    try {
        const {stdout, stderr} = await execAsync(commande, {cwd: processPath});
        if (stderr) {
            console.error(`Erreur d'exécution : ${stderr}`)
            process.exit(1)
        }

        return stdout

    } catch (error) {
        if (error instanceof Error) console.error(`Erreur lors du lancement de la commande : ${error.message}`)
        else console.error(`Erreur lors du lancement de la commande : ${error}`)
        process.exit(1)
    }
}
