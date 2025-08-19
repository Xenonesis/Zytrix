/* Polyfill for File API in environments where it's not available */
// @ts-ignore: Global is not defined in browser environment
if (typeof File === 'undefined') {
  // @ts-ignore: Global is not defined in browser environment
  global.File = class File extends Blob {
    name: string;
    lastModified: number;

    constructor(chunks: any[], filename: string, options?: any) {
      // @ts-ignore: Super constructor call
      super(chunks, options);
      this.name = filename;
      this.lastModified = (options && options.lastModified) || Date.now();
    }
  };
}

import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(document.getElementById('root')!, <RemixBrowser />);
});
