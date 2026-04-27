#!/usr/bin/env node

import('../dist/index.js')
  .then(({ main }) => main())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
