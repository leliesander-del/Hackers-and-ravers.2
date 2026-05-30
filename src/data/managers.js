// Demo-accounts voor winkelbeheerders. Elk account is gekoppeld aan één winkel.
export const managers = [
  {
    id: 'mgr-ah-xl',
    naam: 'Beheerder AH XL Gent',
    storeId: 'ah-xl',
    wachtwoord: 'ahxl',
  },
  {
    id: 'mgr-mediamarkt',
    naam: 'Beheerder MediaMarkt Gent',
    storeId: 'mediamarkt',
    wachtwoord: 'media',
  },
  {
    id: 'mgr-decathlon',
    naam: 'Beheerder Decathlon Gent',
    storeId: 'decathlon',
    wachtwoord: 'sport',
  },
  {
    id: 'mgr-hema',
    naam: 'Beheerder HEMA Veldstraat',
    storeId: 'hema',
    wachtwoord: 'hema',
  },
  {
    id: 'mgr-delhaize',
    naam: 'Beheerder Delhaize Sint-Pieters',
    storeId: 'delhaize',
    wachtwoord: 'delhaize',
  },
]

export function getManager(id) {
  return managers.find((m) => m.id === id) || null
}

export function findManagerByCredentials(storeId, wachtwoord) {
  return managers.find((m) => m.storeId === storeId && m.wachtwoord === wachtwoord) || null
}
