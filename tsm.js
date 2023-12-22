//import rawConfig from './tsconfig.json' assert {type: 'json'};
import { readFileSync } from 'fs';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const rawConfig = JSON.parse(readFileSync('./tsconfig.json', { encoding: 'utf-8' }));

const tsconfigRaw = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  compilerOptions: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ...rawConfig.compilerOptions,
  },
};

const config = {
  common: {
    tsconfigRaw,
  },
};

export default config;
