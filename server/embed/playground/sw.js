import localforage from '/localforage';
import createESMWorker from '/esm-worker';

const esmWorker = createESMWorker({
  fs: {
    readFile: name => localforage.getItem(`file-${name.replace('/embed/playground/', '')}`)
  },
  compilerWasm: fetch('https://esm.sh/esm-worker/compiler/pkg/esm_worker_compiler_bg.wasm', { mode: 'cors' })
})

self.addEventListener('install', e => {
  if (location.hostname === 'localhost') {
    e.waitUntil(self.skipWaiting())
  }
})

self.addEventListener('fetch', e => {
  const { pathname } = new URL(e.request.url)
  if (pathname.startsWith('/embed/playground/')) {
    e.respondWith(esmWorker.fetch(e.request))
  }
})