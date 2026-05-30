import { demoPasswordDigest } from './security.js'

// Demo login accounts — password digests only, never plaintext.
export const DEMO_CUSTOMER_ACCOUNTS = [
  { email: 'sander@neverlost.be', profileId: 'sander', passwordHash: demoPasswordDigest('sander123') },
  { email: 'marc@neverlost.be', profileId: 'marc', passwordHash: demoPasswordDigest('marc123') },
  { email: 'guest@neverlost.be', profileId: 'guest', passwordHash: demoPasswordDigest('guest') },
]

export const DEMO_STAFF_ACCOUNTS = [
  { email: 'lisa@neverlost.be', profileId: 'staff', passwordHash: demoPasswordDigest('lisa123') },
]
