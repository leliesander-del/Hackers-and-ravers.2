// Temporary: only Lisa (profile id 'staff') has access to the staff panel.
const QUALIFIED_STAFF = new Set(['staff'])

export function isQualifiedStaff(profile) {
  return profile?.type === 'staff' && QUALIFIED_STAFF.has(profile.id)
}

export function getStaffStoreId(profile) {
  if (!isQualifiedStaff(profile)) return null
  return profile.staffStoreId ?? null
}
