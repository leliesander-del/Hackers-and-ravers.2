import { demoPasswordDigest } from '../lib/security.js'

// Demo accounts for store managers. Each account is linked to a single store.
// Passwords are stored as digests only — never plaintext.
const managerRecords = [
  {
    id: 'mgr-ah-xl',
    name: 'Manager AH XL Ghent',
    storeId: 'ah-xl',
    passwordHash: demoPasswordDigest('ahxl'),
  },
  {
    id: 'mgr-mediamarkt',
    name: 'Manager MediaMarkt Ghent',
    storeId: 'mediamarkt',
    passwordHash: demoPasswordDigest('media'),
  },
  {
    id: 'mgr-decathlon',
    name: 'Manager Decathlon Ghent',
    storeId: 'decathlon',
    passwordHash: demoPasswordDigest('sport'),
  },
  {
    id: 'mgr-hema',
    name: 'Manager HEMA Veldstraat',
    storeId: 'hema',
    passwordHash: demoPasswordDigest('hema'),
  },
  {
    id: 'mgr-delhaize',
    name: 'Manager Delhaize Sint-Pieters',
    storeId: 'delhaize',
    passwordHash: demoPasswordDigest('delhaize'),
  },
]

/** Public manager data — no credential fields. */
export const managers = managerRecords.map(({ id, name, storeId }) => ({ id, name, storeId }))

export function getManager(id) {
  return managers.find((m) => m.id === id) || null
}

export function findManagerByCredentials(storeId, password) {
  const record = managerRecords.find((m) => m.storeId === storeId)
  if (!record) return null
  if (demoPasswordDigest(password) !== record.passwordHash) return null
  return { id: record.id, name: record.name, storeId: record.storeId }
}

/** Demo password hints for the login page (demo environment only). */
export const MANAGER_DEMO_HINTS = [
  { label: 'AH XL Ghent', hint: 'ahxl' },
  { label: 'MediaMarkt', hint: 'media' },
  { label: 'Decathlon', hint: 'sport' },
  { label: 'HEMA', hint: 'hema' },
  { label: 'Delhaize', hint: 'delhaize' },
]
