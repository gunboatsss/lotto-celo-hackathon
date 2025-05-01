import { http, createConfig } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [celoAlfajores],
  connectors: [
    injected()
  ],
  transports: {
    [celoAlfajores.id]: http()
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
