import typescript from 'rollup-plugin-typescript2'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

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
    }
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
 
  ]
};