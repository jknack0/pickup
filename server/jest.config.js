export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        // Map to source TS so ts-jest can transform it
        '^@pickup/shared$': '<rootDir>/../packages/shared/src/index.ts',
        '^@/(.*)\\.js$': '<rootDir>/src/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: 'tsconfig.json'
        }]
    },
    // Transform shared package (it's outside node_modules but still ESM)
    transformIgnorePatterns: [
        '/node_modules/(?!@pickup)'
    ],
};

