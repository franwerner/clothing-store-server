import typescript from 'rollup-plugin-typescript2'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import cleaner from "rollup-plugin-cleaner";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  input: [
    './src/index.ts',
  ],
  output: [
    {
      dir: resolve(__dirname, 'dist'), 
      format: 'esm',
      preserveModules: true, 
      preserveModulesRoot: 'src', 
    }
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
    cleaner({
      targets: ["./dist/"],
    })
  ]
};