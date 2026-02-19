import terser from '@rollup/plugin-terser';

const banner = `/**
 * mino.js v1.0.0
 * GameCube controller library for JavaScript
 * (c) ${new Date().getFullYear()} vale
 * MIT License
 */`;

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/mino.cjs.js',
      format: 'cjs',
      banner,
      exports: 'named',
    },
    {
      file: 'dist/mino.esm.js',
      format: 'es',
      banner,
    },
    {
      file: 'dist/mino.umd.js',
      format: 'umd',
      name: 'Mino',
      banner,
      exports: 'named',
    },
    {
      file: 'dist/mino.min.js',
      format: 'umd',
      name: 'Mino',
      plugins: [terser()],
      exports: 'named',
    },
  ],
};
