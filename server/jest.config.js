export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^@pickup/shared$': '<rootDir>/../packages/shared/dist/index.js',
        '^@/(.*)\\.js$': '<rootDir>/src/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: 'tsconfig.json'
        }]
    }
};
