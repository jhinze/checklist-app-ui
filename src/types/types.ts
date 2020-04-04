export interface List {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
  title: string
  category: string
  items?: Item[] | null
  itemsSummary?: ItemsSummary
}

export interface Item {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
  doneAt?: Date | null
  listId?: string
  description: string
}

export interface ItemsSummary {
  listId: string
  lastUpdated: Date
  total: bigint
  incomplete: bigint
}