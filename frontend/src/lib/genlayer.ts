import { createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'

export const CHAIN_ID = 61999
export const CHAIN_HEX = '0xf22f'
export const STUDIO_RPC = 'https://studio.genlayer.com/api'
export const EXPLORER_BASE = import.meta.env.VITE_EXPLORER_BASE || 'https://explorer-studio.genlayer.com'
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '') as `0x${string}`

export const readClient = createClient({ chain: studionet })
export type WalletClient = ReturnType<typeof createClient>

type StudioTransaction = {
  statusName?: string
  status_name?: string
  status?: number
  result_name?: string
  consensus_data?: {
    leader_receipt?: Array<{
      mode?: string
      execution_result?: string
      result?: { status?: string } | string | unknown
    }>
  }
}

export type TransactionOutcome = {
  state: 'pending' | 'success' | 'failed'
  message: string
  transaction?: StudioTransaction
}

export function isContractConfigured(): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS)
}

function normalizeChainId(value: unknown): string {
  return String(value ?? '').toLowerCase()
}

function parseAccounts(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(String).filter(address => /^0x[a-fA-F0-9]{40}$/.test(address))
    : []
}

export function shortAddress(value: string, lead = 6, tail = 4): string {
  if (value.length <= lead + tail + 3) return value
  return `${value.slice(0, lead)}…${value.slice(-tail)}`
}

export function createInjectedWalletClient(provider: NonNullable<Window['ethereum']>, address: string): WalletClient {
  return createClient({ chain: studionet, account: address as `0x${string}`, provider })
}

export async function ensureStudioNet(provider: NonNullable<Window['ethereum']>) {
  const current = normalizeChainId(await provider.request({ method: 'eth_chainId' }))
  if (current === CHAIN_HEX) return

  try {
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] })
  } catch (error) {
    const code = Number((error as { code?: unknown })?.code)
    if (code !== 4902) throw error
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: CHAIN_HEX,
        chainName: 'GenLayer StudioNet',
        rpcUrls: [STUDIO_RPC],
        nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
        blockExplorerUrls: [EXPLORER_BASE],
      }],
    })
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] })
  }
}

const LOCAL_DISCONNECT_KEY = 'clausem.wallet.disconnected'

export function markWalletConnected() {
  try { window.localStorage.removeItem(LOCAL_DISCONNECT_KEY) } catch { /* storage unavailable */ }
}

export function markWalletDisconnected() {
  try { window.localStorage.setItem(LOCAL_DISCONNECT_KEY, '1') } catch { /* storage unavailable */ }
}

export function wasWalletLocallyDisconnected(): boolean {
  try { return window.localStorage.getItem(LOCAL_DISCONNECT_KEY) === '1' } catch { return false }
}

export async function connectWallet() {
  const provider = window.ethereum
  if (!provider) throw new Error('No injected wallet found. Install MetaMask, Rabby, or another EIP-1193 wallet.')
  const accounts = parseAccounts(await provider.request({ method: 'eth_requestAccounts' }))
  const address = accounts[0]
  if (!address) throw new Error('Wallet did not expose an account.')
  await ensureStudioNet(provider)
  markWalletConnected()
  return { address, client: createInjectedWalletClient(provider, address) }
}

export async function getAuthorizedWalletSnapshot() {
  const provider = window.ethereum
  if (!provider || wasWalletLocallyDisconnected()) return { address: '', chainId: '' }
  const accounts = parseAccounts(await provider.request({ method: 'eth_accounts' }))
  const chainId = normalizeChainId(await provider.request({ method: 'eth_chainId' }))
  return { address: accounts[0] || '', chainId }
}

export async function disconnectInjectedWallet() {
  const provider = window.ethereum
  markWalletDisconnected()
  if (!provider) return
  try {
    await provider.request({
      method: 'wallet_revokePermissions',
      params: [{ eth_accounts: {} }],
    })
  } catch {
    // EIP-1193 has no universal disconnect method. Clausem's local session
    // remains disconnected across reloads even when the provider cannot revoke.
  }
}

export async function hydrateAuthorizedWallet() {
  const provider = window.ethereum
  if (!provider || wasWalletLocallyDisconnected()) return { address: '', chainId: '', client: null as WalletClient | null }
  const snapshot = await getAuthorizedWalletSnapshot()
  if (!snapshot.address) return { ...snapshot, client: null as WalletClient | null }
  return { ...snapshot, client: createInjectedWalletClient(provider, snapshot.address) }
}

export async function readContract<T>(functionName: string, args: unknown[] = []): Promise<T> {
  if (!isContractConfigured()) throw new Error('Clausem contract address is not configured yet.')
  return await readClient.readContract({ address: CONTRACT_ADDRESS, functionName, args: args as never[] }) as T
}

export async function writeContract(client: WalletClient, functionName: string, args: unknown[] = []) {
  if (!isContractConfigured()) throw new Error('Clausem contract address is not configured yet.')
  const hash = await client.writeContract({ address: CONTRACT_ADDRESS, functionName, args: args as never[], value: 0n })
  return String(hash)
}

export async function inspectTransaction(hash: string): Promise<TransactionOutcome> {
  try {
    const tx = await readClient.getTransaction({ hash: hash as `0x${string}` & { length: 66 } }) as unknown as StudioTransaction
    const statusName = tx.status_name ?? tx.statusName
    const finalized = statusName === 'FINALIZED' || tx.status === 7
    if (!finalized) return { state: 'pending', message: `StudioNet status: ${statusName ?? tx.status ?? 'pending'}.`, transaction: tx }

    const leader = tx.consensus_data?.leader_receipt?.find(row => row.mode === 'leader') ?? tx.consensus_data?.leader_receipt?.[0]
    const resultStatus = leader?.result && typeof leader.result === 'object'
      ? (leader.result as { status?: string }).status
      : undefined
    const success = tx.result_name === 'MAJORITY_AGREE'
      && leader?.execution_result === 'SUCCESS'
      && (resultStatus === undefined || resultStatus === 'return')

    if (success) return { state: 'success', message: 'FINALIZED / MAJORITY_AGREE / SUCCESS', transaction: tx }
    return {
      state: 'failed',
      message: `FINALIZED / ${tx.result_name ?? 'unknown consensus'} / ${leader?.execution_result ?? 'unknown execution'}${resultStatus ? ` / ${resultStatus}` : ''}`,
      transaction: tx,
    }
  } catch (error) {
    return { state: 'pending', message: `StudioNet indexing pending. ${error instanceof Error ? error.message : ''}`.trim() }
  }
}

export function explorerTx(hash: string) { return `${EXPLORER_BASE}/tx/${hash}` }
export function explorerAddress(address: string) { return `${EXPLORER_BASE}/address/${address}` }
