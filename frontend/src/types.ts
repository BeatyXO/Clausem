export type PairRecord = {
  pair_id: number
  creator: string
  parent_pair_id: number
  title: string
  domain: string
  language_a: string
  language_b: string
  source_a_url: string
  source_b_url: string
  categories: number[]
  category_names: string[]
  pair_hash: string
  status: number
  status_name: 'REGISTERED' | 'EVALUATED'
  evaluation_id: number
}

export type EvaluationRecord = {
  evaluation_id: number
  pair_id: number
  evaluator: string
  source_hash_a: string
  source_hash_b: string
  source_size_a: number
  source_size_b: number
  statuses: number[]
  status_names: string[]
  overall: number
  overall_name: 'PARITY' | 'MATERIAL_DRIFT' | 'AMBIGUOUS'
  semantic_hash: string
  evaluation_hash: string
}

export type Counts = { pair_count: number; evaluation_count: number }
