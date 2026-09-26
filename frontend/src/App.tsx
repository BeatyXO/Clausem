import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpenCheck,
  Braces,
  CheckCircle2,
  Check,
  ChevronDown,
  Copy,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FileDiff,
  FilePlus2,
  Fingerprint,
  Globe2,
  Languages,
  Link2,
  LogOut,
  LoaderCircle,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { StatusBadge } from './components/StatusBadge'
import type { Counts, EvaluationRecord, PairRecord } from './types'
import {
  CHAIN_HEX,
  CONTRACT_ADDRESS,
  connectWallet,
  disconnectInjectedWallet,
  explorerAddress,
  explorerTx,
  hydrateAuthorizedWallet,
  inspectTransaction,
  isContractConfigured,
  readContract,
  shortAddress,
  type WalletClient,
  writeContract,
} from './lib/genlayer'

const categories = [
  [1, 'Obligations'],
  [2, 'Rights'],
  [3, 'Fees'],
  [4, 'Deadlines'],
  [5, 'Termination'],
  [6, 'Liability'],
  [7, 'Privacy / Data'],
  [8, 'Eligibility'],
  [9, 'Dispute'],
  [10, 'Exceptions'],
] as const

type View = 'dashboard' | 'register' | 'explore' | 'protocol'

type FormState = {
  parentPairId: string
  title: string
  domain: string
  languageA: string
  languageB: string
  sourceA: string
  sourceB: string
  categories: number[]
}

const emptyForm: FormState = {
  parentPairId: '0',
  title: '',
  domain: '',
  languageA: 'en',
  languageB: 'fr',
  sourceA: '',
  sourceB: '',
  categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}

const demoPair: PairRecord = {
  pair_id: 12,
  creator: '0x7c19a1c75d8f80657E5F8A9A66F52d4208c19A74',
  parent_pair_id: 7,
  title: 'Merchant Terms — English / French',
  domain: 'Marketplace merchant terms',
  language_a: 'en',
  language_b: 'fr',
  source_a_url: 'https://raw.githubusercontent.com/example/policies/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/terms-en.txt',
  source_b_url: 'https://raw.githubusercontent.com/example/policies/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb/terms-fr.txt',
  categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  category_names: categories.map(([, name]) => name.toUpperCase().replaceAll(' / ', '_').replaceAll(' ', '_')),
  pair_hash: '7da657dfe84614a73420fc0204bd7d188e87ec149d5d819a3560f3d9a7a1fc13',
  status: 2,
  status_name: 'EVALUATED',
  evaluation_id: 9,
}

const demoEvaluation: EvaluationRecord = {
  evaluation_id: 9,
  pair_id: 12,
  evaluator: '0xb19a6c9873ac71558197A66221dB90c417A7C531',
  source_hash_a: '1a6cf98452fcb5740de4810e2230994a3b5a2a744cbda5f9668f110e8bec87ee',
  source_hash_b: '71eaf3be684df0e15f209cad7682957f53cfaba64644575363f0da60a6cdff3b',
  source_size_a: 7864,
  source_size_b: 8192,
  statuses: [1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  status_names: ['EQUIVALENT', 'EQUIVALENT', 'EQUIVALENT', 'EQUIVALENT', 'NARROWER_IN_B', 'EQUIVALENT', 'EQUIVALENT', 'EQUIVALENT', 'EQUIVALENT', 'EQUIVALENT'],
  overall: 2,
  overall_name: 'MATERIAL_DRIFT',
  semantic_hash: '3dbcc861f641547401059909f5a40e6f0a7a151e2fac880b5c69b4c6c5fc72dd',
  evaluation_hash: '9f1c98f4454a367a8b7b8f40ee771dbd03ef7c1780a8fa9572106164086245cf',
}

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [walletAddress, setWalletAddress] = useState('')
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null)
  const [walletBusy, setWalletBusy] = useState(false)
  const [walletError, setWalletError] = useState('')
  const [walletMenuOpen, setWalletMenuOpen] = useState(false)
  const [walletCopied, setWalletCopied] = useState(false)
  const walletMenuRef = useRef<HTMLDivElement | null>(null)
  const [counts, setCounts] = useState<Counts>({ pair_count: 0, evaluation_count: 0 })
  const [recentPairs, setRecentPairs] = useState<PairRecord[]>([])
  const [registryLoading, setRegistryLoading] = useState(false)
  const [registryError, setRegistryError] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitBusy, setSubmitBusy] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [txHash, setTxHash] = useState('')
  const [lookupId, setLookupId] = useState('1')
  const [selectedPair, setSelectedPair] = useState<PairRecord | null>(null)
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationRecord | null>(null)
  const [lookupBusy, setLookupBusy] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [evaluateBusy, setEvaluateBusy] = useState(false)

  const configured = isContractConfigured()

  const refreshRegistry = useCallback(async () => {
    if (!configured) return
    setRegistryLoading(true)
    setRegistryError('')
    try {
      const nextCounts = await readContract<Counts>('get_counts')
      setCounts(nextCounts)
      const ids = Array.from({ length: Math.min(8, nextCounts.pair_count) }, (_, idx) => nextCounts.pair_count - idx)
      const pairs = await Promise.all(ids.map(id => readContract<PairRecord>('get_pair', [id])))
      setRecentPairs(pairs)
    } catch (error) {
      setRegistryError(error instanceof Error ? error.message : String(error))
    } finally {
      setRegistryLoading(false)
    }
  }, [configured])

  useEffect(() => {
    void refreshRegistry()
  }, [refreshRegistry])

  useEffect(() => {
    let active = true
    const provider = window.ethereum

    const hydrate = async () => {
      try {
        const snapshot = await hydrateAuthorizedWallet()
        if (!active) return
        if (snapshot.address && snapshot.chainId === CHAIN_HEX && snapshot.client) {
          setWalletAddress(snapshot.address)
          setWalletClient(snapshot.client)
          setWalletError('')
        } else {
          setWalletAddress('')
          setWalletClient(null)
        }
      } catch {
        if (active) {
          setWalletAddress('')
          setWalletClient(null)
        }
      }
    }

    void hydrate()
    if (!provider?.on) return () => { active = false }

    const onAccountsChanged = () => { void hydrate() }
    const onChainChanged = () => { void hydrate() }
    const onDisconnect = () => {
      if (!active) return
      setWalletAddress('')
      setWalletClient(null)
      setWalletMenuOpen(false)
    }

    provider.on('accountsChanged', onAccountsChanged)
    provider.on('chainChanged', onChainChanged)
    provider.on('disconnect', onDisconnect)

    return () => {
      active = false
      provider.removeListener?.('accountsChanged', onAccountsChanged)
      provider.removeListener?.('chainChanged', onChainChanged)
      provider.removeListener?.('disconnect', onDisconnect)
    }
  }, [])

  useEffect(() => {
    if (!walletMenuOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
        setWalletMenuOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWalletMenuOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [walletMenuOpen])

  const connect = async () => {
    setWalletBusy(true)
    setWalletError('')
    try {
      const result = await connectWallet()
      setWalletAddress(result.address)
      setWalletClient(result.client)
      setWalletMenuOpen(false)
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : String(error))
    } finally {
      setWalletBusy(false)
    }
  }

  const connectAndGetClient = async () => {
    if (walletClient) return walletClient
    const result = await connectWallet()
    setWalletAddress(result.address)
    setWalletClient(result.client)
    return result.client
  }

  const copyWalletAddress = async () => {
    if (!walletAddress) return
    try {
      await navigator.clipboard.writeText(walletAddress)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = walletAddress
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setWalletCopied(true)
    window.setTimeout(() => setWalletCopied(false), 1400)
  }

  const disconnectWallet = async () => {
    await disconnectInjectedWallet()
    setWalletAddress('')
    setWalletClient(null)
    setWalletMenuOpen(false)
    setWalletCopied(false)
    setWalletError('')
  }

  const loadDemoForm = () => {
    setForm({
      parentPairId: '0',
      title: 'Merchant Terms — English / French',
      domain: 'Marketplace merchant terms',
      languageA: 'en',
      languageB: 'fr',
      sourceA: 'https://raw.githubusercontent.com/example/policies/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/terms-en.txt',
      sourceB: 'https://raw.githubusercontent.com/example/policies/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb/terms-fr.txt',
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    })
  }

  const toggleCategory = (id: number) => {
    setForm(current => ({
      ...current,
      categories: current.categories.includes(id)
        ? current.categories.filter(value => value !== id)
        : [...current.categories, id].sort((a, b) => a - b),
    }))
  }

  const submitPair = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!configured) {
      setSubmitMessage('Deploy Clausem first and set VITE_CONTRACT_ADDRESS. The interface is otherwise ready.')
      return
    }
    setSubmitBusy(true)
    setSubmitMessage('')
    setTxHash('')
    try {
      const client = await connectAndGetClient()
      const hash = await writeContract(client, 'register_pair', [
        Number(form.parentPairId || 0),
        form.title,
        form.domain,
        form.languageA,
        form.languageB,
        form.sourceA,
        form.sourceB,
        JSON.stringify(form.categories),
      ])
      setTxHash(hash)
      setSubmitMessage('Registration submitted. StudioNet consensus can take longer than a normal EVM transaction.')
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setSubmitBusy(false)
    }
  }

  const lookupPair = async (idOverride?: number) => {
    const id = idOverride ?? Number(lookupId)
    setLookupBusy(true)
    setLookupError('')
    setSelectedPair(null)
    setSelectedEvaluation(null)
    try {
      if (!configured) {
        setSelectedPair(demoPair)
        setSelectedEvaluation(demoEvaluation)
        return
      }
      const pair = await readContract<PairRecord>('get_pair', [id])
      setSelectedPair(pair)
      if (pair.evaluation_id) {
        setSelectedEvaluation(await readContract<EvaluationRecord>('get_evaluation', [pair.evaluation_id]))
      }
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : String(error))
    } finally {
      setLookupBusy(false)
    }
  }

  const evaluateSelected = async () => {
    if (!selectedPair) return
    if (!configured) {
      setLookupError('The live evaluate action becomes available after a canonical StudioNet contract is configured.')
      return
    }
    setEvaluateBusy(true)
    setLookupError('')
    try {
      const client = await connectAndGetClient()
      const hash = await writeContract(client, 'evaluate_pair', [selectedPair.pair_id])
      setTxHash(hash)
      setLookupError(`Evaluation submitted: ${shortAddress(hash, 12, 8)}. Wait for StudioNet finalization, then refresh Pair #${selectedPair.pair_id}.`)
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : String(error))
    } finally {
      setEvaluateBusy(false)
    }
  }

  const reconcileTx = async () => {
    if (!txHash) return
    const outcome = await inspectTransaction(txHash)
    setSubmitMessage(outcome.message)
    if (outcome.state === 'success') await refreshRegistry()
  }

  const stats = useMemo(() => configured
    ? [
      ['Pairs registered', counts.pair_count, <Network size={19} />],
      ['Evaluations final', counts.evaluation_count, <ShieldCheck size={19} />],
      ['Material categories', 10, <FileDiff size={19} />],
    ]
    : [
      ['Demo pairs', 12, <Network size={19} />],
      ['Demo evaluations', 9, <ShieldCheck size={19} />],
      ['Material categories', 10, <FileDiff size={19} />],
    ], [configured, counts])

  const shownPairs = configured ? recentPairs : [demoPair]

  return (
    <div className="app-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <header className="topbar">
        <button className="brand" onClick={() => setView('dashboard')}>
          <span className="brand-mark"><Languages size={24} /></span>
          <span>
            <strong>Clausem</strong>
            <small>material parity registry</small>
          </span>
        </button>
        <nav className="nav-tabs" aria-label="Main navigation">
          {(['dashboard', 'register', 'explore', 'protocol'] as View[]).map(item => (
            <button key={item} className={view === item ? 'active' : ''} onClick={() => setView(item)}>
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
        <div className="wallet-area" ref={walletMenuRef}>
          {walletAddress ? (
            <>
              <button
                className={walletMenuOpen ? 'wallet-chip wallet-chip-open' : 'wallet-chip'}
                onClick={() => setWalletMenuOpen(open => !open)}
                aria-expanded={walletMenuOpen}
                aria-haspopup="menu"
                type="button"
              >
                <span className="wallet-dot" />
                {shortAddress(walletAddress)}
                <ChevronDown className={walletMenuOpen ? 'wallet-chevron wallet-chevron-open' : 'wallet-chevron'} size={14} />
              </button>
              {walletMenuOpen && (
                <div className="wallet-menu" role="menu">
                  <div className="wallet-menu-head">
                    <span>Connected wallet</span>
                    <code title={walletAddress}>{shortAddress(walletAddress, 10, 8)}</code>
                  </div>
                  <button type="button" role="menuitem" onClick={() => void copyWalletAddress()}>
                    {walletCopied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{walletCopied ? 'Copied' : 'Copy address'}</span>
                  </button>
                  <a href={explorerAddress(walletAddress)} target="_blank" rel="noreferrer" role="menuitem">
                    <ExternalLink size={16} />
                    <span>View on explorer</span>
                  </a>
                  <div className="wallet-menu-rule" />
                  <button className="wallet-disconnect" type="button" role="menuitem" onClick={() => void disconnectWallet()}>
                    <LogOut size={16} />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <button className="button button-ghost" onClick={connect} disabled={walletBusy}>
              {walletBusy ? <LoaderCircle className="spin" size={17} /> : <Wallet size={17} />}
              Connect wallet
            </button>
          )}
        </div>
      </header>

      <main>
        {!configured && (
          <div className="config-banner">
            <CircleAlert size={19} />
            <div>
              <strong>Preview mode</strong>
              <span>The frontend is complete, but no canonical StudioNet address is configured yet. Live writes are intentionally disabled until deployment evidence exists.</span>
            </div>
          </div>
        )}
        {walletError && <div className="error-banner">{walletError}</div>}

        {view === 'dashboard' && (
          <section className="page dashboard-page">
            <div className="hero">
              <div className="eyebrow"><Sparkles size={16} /> multilingual policy integrity, onchain</div>
              <h1>Same policy.<br /><span>Same material meaning?</span></h1>
              <p>
                Clausem lets GenLayer validators independently compare immutable language versions of policies and terms,
                then seal a hash-bound <b>PARITY</b>, <b>MATERIAL DRIFT</b>, or <b>AMBIGUOUS</b> result.
              </p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => setView('register')}><FilePlus2 size={18} /> Register a pair</button>
                <button className="button button-secondary" onClick={() => { setView('explore'); setTimeout(() => void lookupPair(), 0) }}><Search size={18} /> Explore result</button>
              </div>
              <div className="trust-row">
                <span><Fingerprint size={17} /> immutable source hashes</span>
                <span><ShieldCheck size={17} /> validator agreement</span>
                <span><Network size={17} /> single-shot finality</span>
              </div>
            </div>

            <div className="stat-grid">
              {stats.map(([label, value, icon]) => (
                <article className="stat-card" key={String(label)}>
                  <div className="stat-icon">{icon}</div>
                  <strong>{String(value)}</strong>
                  <span>{String(label)}</span>
                </article>
              ))}
            </div>

            <div className="section-head">
              <div><span className="section-kicker">registry</span><h2>Recent document pairs</h2></div>
              <button className="icon-button" onClick={refreshRegistry} disabled={registryLoading || !configured} title="Refresh registry">
                <RefreshCw className={registryLoading ? 'spin' : ''} size={18} />
              </button>
            </div>
            {registryError && <div className="error-banner">{registryError}</div>}
            <div className="pair-grid">
              {shownPairs.map(pair => (
                <button className="pair-card" key={pair.pair_id} onClick={() => { setLookupId(String(pair.pair_id)); setView('explore'); setTimeout(() => void lookupPair(pair.pair_id), 0) }}>
                  <div className="pair-card-top">
                    <span className="pair-id">PAIR #{pair.pair_id}</span>
                    <StatusBadge value={pair.status_name} />
                  </div>
                  <h3>{pair.title}</h3>
                  <p>{pair.domain}</p>
                  <div className="language-route"><span>{pair.language_a.toUpperCase()}</span><ChevronRight size={17} /><span>{pair.language_b.toUpperCase()}</span></div>
                  <div className="pair-card-foot"><span>{pair.categories.length} categories</span><span>{shortAddress(pair.pair_hash, 10, 6)}</span></div>
                </button>
              ))}
            </div>
          </section>
        )}

        {view === 'register' && (
          <section className="page split-page">
            <div className="page-intro sticky-intro">
              <span className="section-kicker">new pair</span>
              <h1>Bind two immutable documents.</h1>
              <p>Clausem only accepts sources whose content identity is stable: commit-pinned GitHub raw files, IPFS CIDs, or Arweave transactions.</p>
              <div className="mini-flow">
                <div><span>01</span><b>Register</b><small>freeze languages, sources and categories</small></div>
                <div><span>02</span><b>Evaluate</b><small>validators fetch both exact source payloads</small></div>
                <div><span>03</span><b>Consume</b><small>downstream apps pin pair + evaluation hashes</small></div>
              </div>
            </div>

            <form className="form-card" onSubmit={submitPair}>
              <div className="form-toolbar">
                <h2>Pair definition</h2>
                <button type="button" className="text-button" onClick={loadDemoForm}><Sparkles size={15} /> Fill sample</button>
              </div>
              <label>Parent pair ID <span>0 for a new lineage</span><input value={form.parentPairId} onChange={e => setForm({ ...form, parentPairId: e.target.value })} inputMode="numeric" /></label>
              <label>Title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Merchant Terms — English / French" required /></label>
              <label>Domain<input value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} placeholder="Marketplace merchant terms" required /></label>
              <div className="two-col">
                <label>Language A <span>reference</span><input value={form.languageA} onChange={e => setForm({ ...form, languageA: e.target.value })} required /></label>
                <label>Language B<input value={form.languageB} onChange={e => setForm({ ...form, languageB: e.target.value })} required /></label>
              </div>
              <label>Immutable source A<input value={form.sourceA} onChange={e => setForm({ ...form, sourceA: e.target.value })} placeholder="https://raw.githubusercontent.com/.../<40-hex-commit>/terms-en.txt" required /></label>
              <label>Immutable source B<input value={form.sourceB} onChange={e => setForm({ ...form, sourceB: e.target.value })} placeholder="https://arweave.net/<transaction-id>" required /></label>
              <fieldset>
                <legend>Material categories <span>{form.categories.length} selected</span></legend>
                <div className="category-grid">
                  {categories.map(([id, name]) => (
                    <button type="button" className={form.categories.includes(id) ? 'category-chip selected' : 'category-chip'} onClick={() => toggleCategory(id)} key={id}>
                      <span>{String(id).padStart(2, '0')}</span>{name}
                    </button>
                  ))}
                </div>
              </fieldset>
              <button className="button button-primary submit-button" type="submit" disabled={submitBusy || form.categories.length === 0}>
                {submitBusy ? <LoaderCircle className="spin" size={18} /> : <Fingerprint size={18} />}
                Register immutable pair
              </button>
              {submitMessage && <div className="inline-message">{submitMessage}</div>}
              {txHash && (
                <div className="tx-actions">
                  <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">Open transaction <ExternalLink size={14} /></a>
                  <button type="button" className="text-button" onClick={reconcileTx}><RefreshCw size={14} /> Check finalization</button>
                </div>
              )}
            </form>
          </section>
        )}

        {view === 'explore' && (
          <section className="page explore-page">
            <div className="section-head wide-head">
              <div><span className="section-kicker">proof explorer</span><h1>Inspect a parity record.</h1></div>
              <div className="lookup-box">
                <span>#</span><input value={lookupId} onChange={e => setLookupId(e.target.value)} inputMode="numeric" aria-label="Pair ID" />
                <button onClick={() => void lookupPair()} disabled={lookupBusy}>{lookupBusy ? <LoaderCircle className="spin" size={17} /> : <Search size={17} />} Load pair</button>
              </div>
            </div>
            {lookupError && <div className="inline-message">{lookupError}</div>}

            {!selectedPair ? (
              <div className="empty-state">
                <div className="empty-icon"><BookOpenCheck size={31} /></div>
                <h2>Choose a pair ID</h2>
                <p>{configured ? 'Load any registered Clausem pair from StudioNet.' : 'Preview mode will open a realistic evaluated example without pretending it exists onchain.'}</p>
                {!configured && <button className="button button-secondary" onClick={() => void lookupPair()}><Sparkles size={17} /> Show preview record</button>}
              </div>
            ) : (
              <>
                <div className="proof-header">
                  <div>
                    <div className="proof-meta"><span>PAIR #{selectedPair.pair_id}</span><StatusBadge value={selectedPair.status_name} /></div>
                    <h2>{selectedPair.title}</h2>
                    <p>{selectedPair.domain}</p>
                  </div>
                  <div className="language-big"><span>{selectedPair.language_a.toUpperCase()}</span><ChevronRight /><span>{selectedPair.language_b.toUpperCase()}</span></div>
                </div>

                <div className="proof-grid">
                  <article className="proof-card source-card">
                    <div className="card-label"><Link2 size={16} /> immutable source A</div>
                    <b>{selectedPair.language_a.toUpperCase()} / reference</b>
                    <code>{selectedPair.source_a_url}</code>
                    {selectedEvaluation && <small>hash · {shortAddress(selectedEvaluation.source_hash_a, 14, 10)} · {selectedEvaluation.source_size_a.toLocaleString()} bytes</small>}
                  </article>
                  <article className="proof-card source-card">
                    <div className="card-label"><Link2 size={16} /> immutable source B</div>
                    <b>{selectedPair.language_b.toUpperCase()} / compared</b>
                    <code>{selectedPair.source_b_url}</code>
                    {selectedEvaluation && <small>hash · {shortAddress(selectedEvaluation.source_hash_b, 14, 10)} · {selectedEvaluation.source_size_b.toLocaleString()} bytes</small>}
                  </article>
                </div>

                {!selectedEvaluation ? (
                  <div className="pending-card">
                    <div><span className="pulse-dot" /><b>Registered, not evaluated</b><p>The immutable definition is onchain. A caller can now trigger the GenLayer semantic comparison once.</p></div>
                    <button className="button button-primary" onClick={evaluateSelected} disabled={evaluateBusy}>{evaluateBusy ? <LoaderCircle className="spin" size={18} /> : <ShieldCheck size={18} />} Evaluate pair</button>
                  </div>
                ) : (
                  <>
                    <div className={`result-hero result-${selectedEvaluation.overall_name.toLowerCase().replaceAll('_', '-')}`}>
                      <div><span>FINAL MATERIAL RESULT</span><h2>{selectedEvaluation.overall_name.replaceAll('_', ' ')}</h2></div>
                      <CheckCircle2 size={42} />
                    </div>
                    <div className="matrix-card">
                      <div className="matrix-head"><div>Category</div><div>Validator consensus</div></div>
                      {selectedPair.category_names.map((name, index) => (
                        <div className="matrix-row" key={name}><span>{String(index + 1).padStart(2, '0')} · {name.replaceAll('_', ' ')}</span><StatusBadge value={selectedEvaluation.status_names[index]} /></div>
                      ))}
                    </div>
                    <div className="hash-grid">
                      <article><span>Pair hash</span><code>{selectedPair.pair_hash}</code></article>
                      <article><span>Semantic hash</span><code>{selectedEvaluation.semantic_hash}</code></article>
                      <article><span>Evaluation hash</span><code>{selectedEvaluation.evaluation_hash}</code></article>
                      <article><span>Evaluator</span><code>{selectedEvaluation.evaluator}</code></article>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        )}

        {view === 'protocol' && (
          <section className="page protocol-page">
            <div className="protocol-hero">
              <span className="section-kicker">protocol</span>
              <h1>Consensus on meaning.<br />Determinism on the verdict.</h1>
              <p>Clausem is deliberately narrower than a generic “AI judges documents” app. The contract constrains what validators decide and cryptographically binds what they saw.</p>
            </div>
            <div className="protocol-grid">
              <article><div className="protocol-icon"><Link2 /></div><span>01</span><h3>Immutable source binding</h3><p>Only commit-pinned GitHub raw files, IPFS CIDs and Arweave transaction URLs are admissible.</p></article>
              <article><div className="protocol-icon"><Fingerprint /></div><span>02</span><h3>Exact byte agreement</h3><p>Leader and validators must agree on both full source hashes and byte sizes before semantic output is accepted.</p></article>
              <article><div className="protocol-icon"><Braces /></div><span>03</span><h3>Constrained semantic vector</h3><p>Validators classify only requested material categories into eight explicit states. Malformed output fails closed to ambiguity.</p></article>
              <article><div className="protocol-icon"><ShieldCheck /></div><span>04</span><h3>Deterministic final result</h3><p>After consensus, pure deterministic logic maps the semantic vector to PARITY, MATERIAL DRIFT, or AMBIGUOUS.</p></article>
              <article><div className="protocol-icon"><Network /></div><span>05</span><h3>Version lineage</h3><p>A finalized pair can never be re-adjudicated. Changed documents become successor pairs with new definition hashes.</p></article>
              <article><div className="protocol-icon"><Globe2 /></div><span>06</span><h3>Composable proof</h3><p>Downstream contracts can pin pair_hash + evaluation_hash through the typed is_parity consumer interface.</p></article>
            </div>
            <div className="boundary-card">
              <div><ShieldCheck size={24} /><h3>What Clausem does not claim</h3></div>
              <p>It does not declare which wording is legally superior, provide legal advice, guarantee translation quality outside selected categories, or silently re-run old evidence. It records one bounded consensus result over two immutable documents.</p>
            </div>
          </section>
        )}
      </main>

      <footer>
        <div><strong>Clausem</strong><span>Consensus-backed material parity on GenLayer StudioNet.</span></div>
        <div className="footer-links">
          {configured && <a href={explorerAddress(CONTRACT_ADDRESS)} target="_blank" rel="noreferrer">Contract <ExternalLink size={13} /></a>}
          <a href="https://github.com/BeatyXO/Clausem" target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a>
        </div>
      </footer>
    </div>
  )
}

export default App
