import { readFile, writeFile } from 'node:fs/promises'

const workerTypesPath = new URL('../worker-configuration.d.ts', import.meta.url)

const globalPropsBlock = `\tinterface GlobalProps {\n\t\tmainModule: typeof import("./dist/server/server");\n\t}\n`

async function main() {
  const currentContents = await readFile(workerTypesPath, 'utf8')

  const nextContents = currentContents.replace(globalPropsBlock, '')

  if (nextContents === currentContents) {
    return
  }

  await writeFile(workerTypesPath, nextContents)
}

await main()
