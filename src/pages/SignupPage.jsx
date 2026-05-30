import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Compass } from '../components/icons.jsx'
import { useStore, getAccounts, saveAccount } from '../context/StoreContext.jsx'
import { hashPassword, MAX_PASSWORD_LENGTH } from '../lib/security.js'
import { Button, Input } from '../components/ui/index.js'
import {
  RECIPES,
  THEMES,
  MEALS,
  BASE_INGREDIENTS,
  COOK_TIME_OPTIONS,
  rankRecipes,
  ingredientsForDishes,
} from '../lib/assistant.js'

const DIET_OPTIONS = ['Gluten-free', 'Lactose-free', 'Vegetarian', 'Vegan', 'Sugar-free']
const PRICE_OPTIONS = ['Budget', 'Mid', 'Premium']

// Step 2 — how many people are you cooking for? (wide, single choice)
const HOUSEHOLD_SIZE_OPTIONS = [
  { id: '1', label: 'Just me', sub: '1 person', emoji: '🧑' },
  { id: '2', label: 'The two of us', sub: '2 people', emoji: '👫' },
  { id: '3-4', label: 'Small family', sub: '3 – 4 people', emoji: '👨‍👩‍👧' },
  { id: '5+', label: 'Large family', sub: '5+ people', emoji: '👨‍👩‍👧‍👦' },
]

// Step 2 — how often do you cook per week? (single choice)
const FREQUENCY_OPTIONS = [
  { id: '1-2', label: '1 – 2×', sub: 'per week', emoji: '🗓️' },
  { id: '3-4', label: '3 – 4×', sub: 'per week', emoji: '📅' },
  { id: '5-7', label: '5 – 7×', sub: 'almost daily', emoji: '🔥' },
]

const STORES = [
  { id: 'colruyt', name: 'Colruyt', emoji: '🛒', color: 'bg-red-600' },
  { id: 'delhaize', name: 'Delhaize', emoji: '🦁', color: 'bg-green-600' },
  { id: 'carrefour', name: 'Carrefour', emoji: '🛍️', color: 'bg-blue-600' },
  { id: 'aldi', name: 'Aldi', emoji: '🏷️', color: 'bg-slate-600' },
  { id: 'lidl', name: 'Lidl', emoji: '🌻', color: 'bg-yellow-500' },
]

const STEP_TITLES = [
  'Account',
  'Household',
  'Cook time',
  'Cuisine',
  'Meal',
  'Ingredients',
  'Avoid',
  'Diet & price',
  'Dishes',
  'Stores',
]
const STEP_COUNT = STEP_TITLES.length
// Fixed brand accent color (violet) for new accounts.
const ACCENT_COLOR = '#7c3aed'
const DEMO_EMAILS = ['sander@neverlost.be', 'marc@neverlost.be', 'guest@neverlost.be']

function CheckBadge() {
  return (
    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600">
      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
    </span>
  )
}

// Section heading within a step.
function SectionHeading({ title }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
}

// Reusable grid of choice cards with emoji + label (+ optional subtext).
// `singleSelect` = one choice (radio behavior), otherwise multiple selection.
function CardGrid({ options, selected, onToggle, columns = 2, singleSelect = false }) {
  const isSelected = (id) => (singleSelect ? selected === id : selected.includes(id))
  return (
    <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((o) => {
        const on = isSelected(o.id)
        return (
          <button
            key={o.id}
            onClick={() => onToggle(o.id)}
            className={`relative rounded-xl px-3 py-4 text-left transition active:scale-[0.97] ${
              on ? 'bg-brand-50 ring-2 ring-brand-400' : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {on && <CheckBadge />}
            <span className="mb-1.5 block text-2xl">{o.emoji}</span>
            <span className="block text-sm font-medium leading-tight text-slate-800">{o.label}</span>
            {o.sub && <span className="mt-0.5 block text-xs text-slate-400">{o.sub}</span>}
          </button>
        )
      })}
    </div>
  )
}

// Reusable row of pill buttons (multiple selection).
function PillGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const id = typeof o === 'string' ? o : o.id
        const label = typeof o === 'string' ? o : o.label
        const emoji = typeof o === 'string' ? null : o.emoji
        const on = selected.includes(id)
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.97] ${
              on
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
            }`}
          >
            {emoji && <span className="mr-1">{emoji}</span>}
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function SignupPage() {
  const { login, addIngredients } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  // Step 1 — account
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 2 — household
  const [household, setHousehold] = useState('')
  const [frequency, setFrequency] = useState('')

  // Step 3 — how long do you want to cook?
  const [cookTime, setCookTime] = useState('')

  // Step 4 — cuisine (themes from the real recipes)
  const [themes, setThemes] = useState([])

  // Step 5 — meal moment
  const [meals, setMeals] = useState([])

  // Step 6 — which ingredients
  const [ingredients, setIngredients] = useState([])

  // Step 7 — what to avoid
  const [avoid, setAvoid] = useState([])

  // Step 8 — diet & price tier
  const [diet, setDiet] = useState([])
  const [priceTier, setPriceTier] = useState('')

  // Step 9 — favorite dishes
  const [dishes, setDishes] = useState([])

  // Step 10 — favorite stores
  const [favoriteStores, setFavoriteStores] = useState([])

  // Dishes come straight from the real recipes via the shared ranking function
  // (assistant.js) — the same one the chef chat uses.
  const filteredDishes = useMemo(
    () => rankRecipes({ diet, cookTime, avoid, themes, meals, ingredients, priceTier }),
    [diet, cookTime, avoid, themes, meals, ingredients, priceTier],
  )

  function toggleIn(setter) {
    return (item) => setter((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))
  }
  const toggleDiet = toggleIn(setDiet)
  const toggleTheme = toggleIn(setThemes)
  const toggleMeal = toggleIn(setMeals)
  const toggleIngredient = toggleIn(setIngredients)
  const toggleAvoid = toggleIn(setAvoid)
  const toggleDish = toggleIn(setDishes)
  const toggleStore = toggleIn(setFavoriteStores)

  function validateAccount() {
    const trimmedName = name.trim()
    if (!trimmedName) return 'Enter your name.'
    const letterCount = (trimmedName.match(/\p{L}/gu) || []).length
    if (letterCount < 5) return 'Your name must contain at least 5 letters.'

    const trimmedEmail = email.trim()
    if (!trimmedEmail) return 'Enter your email address.'
    if (!trimmedEmail.includes('@')) return "Make sure it's a valid email address."

    if (!password) return 'Enter a password.'
    if (password.length < 7) return 'Password must contain at least 7 characters.'
    if (password.length > MAX_PASSWORD_LENGTH) return 'Password is too long (max. 128 characters).'

    const emailLower = trimmedEmail.toLowerCase()
    if (DEMO_EMAILS.includes(emailLower) || getAccounts()[emailLower]) {
      return 'An account with this email address already exists.'
    }
    return null
  }

  function validateStep() {
    if (step === 1) return validateAccount()
    return null
  }

  function next() {
    const errorMsg = validateStep()
    if (errorMsg) { setError(errorMsg); return }
    setError('')
    if (step < STEP_COUNT) { setStep((s) => s + 1); return }
    void createAccount()
  }

  function previous() {
    setError('')
    setStep((s) => s - 1)
  }

  async function createAccount() {
    const accountError = validateAccount()
    if (accountError) {
      setStep(1)
      setError(accountError)
      return
    }

    const emailLower = email.trim().toLowerCase()

    // Final check: one account per email address. Prevents silently overwriting
    // an existing account when the flow is resumed.
    if (DEMO_EMAILS.includes(emailLower) || getAccounts()[emailLower]) {
      setStep(1)
      setError('An account with this email address already exists.')
      return
    }

    const description = [priceTier, ...diet].filter(Boolean).join(' · ') || 'Standard account'

    const profile = {
      id: emailLower,
      name: name.trim(),
      type: 'member',
      description,
      color: ACCENT_COLOR,
      accent: ACCENT_COLOR,
      person: { email: emailLower, phone: '', address: '' },
      preferences: {
        diet,
        priceTier: priceTier ? priceTier.toLowerCase() : 'budget',
        brands: [],
        departments: [],
        household,
        frequency,
        cookTime,
        themes,
        meals,
        ingredients,
        avoid,
      },
      dishes,
      history: { stores: favoriteStores },
      loyaltyPoints: 0,
      cashbackBalance: 0,
      cashbackTier: 'Standard',
    }

    const passwordHash = await hashPassword(password)
    saveAccount(emailLower, { password: passwordHash, profile })
    login(profile, 'customer-account')

    // Immediately turn the chosen dishes into ingredients on the shopping list,
    // via the same recipe source as the assistant.
    if (dishes.length) {
      const chosenRecipes = RECIPES.filter((r) => dishes.includes(r.name))
      const { terms } = ingredientsForDishes(chosenRecipes)
      if (terms.length) addIngredients(terms)
    }

    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-surface px-5 py-8">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/25">
            <Compass className="h-4.5 w-4.5" strokeWidth={1.8} />
          </div>
          <span className="text-base font-bold text-slate-900">Never Lost</span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {Array.from({ length: STEP_COUNT }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  n <= step ? 'bg-brand-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Step {step} of {STEP_COUNT} &middot;{' '}
            <span className="text-slate-600">{STEP_TITLES[step - 1]}</span>
            {name && step > 1 && (
              <> &middot; <span className="text-slate-600">{name}</span></>
            )}
          </p>
        </div>

        {/* Step content */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

          {/* Step 1 — Account */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create your account</h2>
                <p className="mt-0.5 text-sm text-slate-500">We personalize your shopping experience</p>
              </div>
              <div className="space-y-3">
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Name" autoComplete="name" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" autoComplete="email" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 7 characters)"
                  aria-label="Password"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-brand-600 transition hover:text-brand-700">
                  Log in
                </Link>
              </p>
            </div>
          )}

          {/* Step 2 — Household */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Who are you cooking for?</h2>
                <p className="mt-0.5 text-sm text-slate-500">This is how we tune portions and quantities</p>
              </div>
              <div>
                <SectionHeading title="Number of people" />
                <CardGrid options={HOUSEHOLD_SIZE_OPTIONS} selected={household} singleSelect onToggle={(id) => setHousehold((c) => (c === id ? '' : id))} />
              </div>
              <div>
                <SectionHeading title="How often do you cook?" />
                <CardGrid options={FREQUENCY_OPTIONS} selected={frequency} singleSelect columns={3} onToggle={(id) => setFrequency((c) => (c === id ? '' : id))} />
              </div>
            </div>
          )}

          {/* Step 3 — How long do you want to cook? */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">How long do you want to cook?</h2>
                <p className="mt-0.5 text-sm text-slate-500">This is how we match the dishes to your time</p>
              </div>
              <CardGrid options={COOK_TIME_OPTIONS} selected={cookTime} singleSelect onToggle={(id) => setCookTime((c) => (c === id ? '' : id))} />
            </div>
          )}

          {/* Step 4 — Cuisine */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Which cuisine appeals to you?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Pick one or more styles</p>
              </div>
              <CardGrid options={THEMES} selected={themes} onToggle={toggleTheme} />
            </div>
          )}

          {/* Step 5 — Meal moment */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">What would you like to make?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Pick one or more moments</p>
              </div>
              <CardGrid options={MEALS} selected={meals} columns={3} onToggle={toggleMeal} />
            </div>
          )}

          {/* Step 6 — Ingredients */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">What do you like to cook with?</h2>
                <p className="mt-0.5 text-sm text-slate-500">Select your favorite base ingredients</p>
              </div>
              <PillGroup options={BASE_INGREDIENTS} selected={ingredients} onToggle={toggleIngredient} />
            </div>
          )}

          {/* Step 7 — Avoid */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Anything you'd rather avoid?</h2>
                <p className="mt-0.5 text-sm text-slate-500">We'll leave these ingredients out of your dishes — skip if there's nothing</p>
              </div>
              <PillGroup options={BASE_INGREDIENTS} selected={avoid} onToggle={toggleAvoid} />
            </div>
          )}

          {/* Step 8 — Diet & price tier */}
          {step === 8 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Diet &amp; price tier</h2>
                <p className="mt-0.5 text-sm text-slate-500">Select what applies to you</p>
              </div>

              <div>
                <SectionHeading title="Dietary preference" />
                <PillGroup options={DIET_OPTIONS} selected={diet} onToggle={toggleDiet} />
              </div>

              <div>
                <SectionHeading title="Price tier" />
                <div className="flex gap-2">
                  {PRICE_OPTIONS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setPriceTier((cur) => (cur === item ? '' : item))}
                      className={`flex-1 rounded-full py-2.5 text-sm font-medium transition active:scale-[0.97] ${
                        priceTier === item
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 9 — Favorite dishes */}
          {step === 9 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Which dishes appeal to you?</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Tailored to your choices — the best matches are at the top
                </p>
              </div>

              {filteredDishes.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  No dishes found for this combination.<br />Go back to adjust your diet, cook time or avoided ingredients.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {filteredDishes.map((g) => {
                    const selected = dishes.includes(g.name)
                    return (
                      <button
                        key={g.name}
                        onClick={() => toggleDish(g.name)}
                        className={`relative rounded-xl px-3 py-3.5 text-left transition active:scale-[0.97] ${
                          selected
                            ? 'bg-brand-50 ring-2 ring-brand-400'
                            : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {selected && <CheckBadge />}
                        <span className="mb-1.5 block text-2xl">{g.emoji}</span>
                        <span className="block text-xs font-medium capitalize leading-tight text-slate-800">{g.name}</span>
                        <span className="mt-1 block text-[10px] text-slate-400">{g.time} min</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 10 — Favorite stores */}
          {step === 10 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Favorite stores</h2>
                <p className="mt-0.5 text-sm text-slate-500">Select your regular supermarkets</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {STORES.map((w) => {
                  const selected = favoriteStores.includes(w.id)
                  return (
                    <button
                      key={w.id}
                      onClick={() => toggleStore(w.id)}
                      className={`relative rounded-xl px-3 py-4 text-left transition active:scale-[0.97] ${
                        selected
                          ? 'bg-brand-50 ring-2 ring-brand-400'
                          : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected && <CheckBadge />}
                      <span className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${w.color} text-lg shadow-sm`}>
                        {w.emoji}
                      </span>
                      <span className="block text-sm font-medium text-slate-800">{w.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="secondary" size="lg" onClick={previous} className="px-5">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          <Button size="lg" onClick={next} className="flex-1">
            {step === STEP_COUNT ? 'Create account' : 'Next'}
            {step < STEP_COUNT && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
