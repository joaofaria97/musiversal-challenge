import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './swagger.json',
    output: {
      mode: 'single',
      target: './src/api/index.ts',
      schemas: './src/model',
      client: 'react-query',
      prettier: true,
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'page',
          options: {
            staleTime: 10000,
          },
        },
        mutator: {
          path: './src/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
}); 