import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { stores, distanceToUser } from '../data/stores.js'
import StoreLogo from '../components/StoreLogo.jsx'
import SearchBar from '../components/SearchBar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import {
  CHEF_GREETING,
  CHEF_QUESTIONS,
  chefReply,
  recognizeChoices,
  rankRecipes,
  ingredientsForDishes,
  processMessage,
} from '../lib/assistant.js'
import { useSpeech } from '../lib/useSpeech.js'

// Small helper: "a, b and c".
function joinList(items) {
  const arr = (items || []).filter(Boolean)
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`
}

// The home: at the top a choice between stores (by distance), next to it the chef —
// a conversation that asks about your preferences and builds your list. The list
// itself (ingredients + products) lives on the Cart page.
export default function ListPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('stores')

  return (
    <div>
      <PageHeader title="Home" />

      <div className="px-4 pb-6 pt-5">
        {/* Tab switcher (pill style) */}
        <div className="mb-5 flex gap-1 rounded-full bg-slate-100 p-1">
          {[
            { id: 'stores', label: 'Stores' },
            { id: 'chef', label: '✨ Chef' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                tab === t.id ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'stores' && <StoresTab />}
        {tab === 'chef' && <ChefTab goToCart={() => navigate('/cart')} />}
      </div>
    </div>
  )
}

// The stores sorted by distance to the user, with logo, street and distance.
// Tap a store to view the assortment and start a route.
function StoresTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const sorted = useMemo(
    () =>
      stores
        .map((s) => ({ ...s, _distance: distanceToUser(s) }))
        .sort((a, b) => a._distance - b._distance),
    [],
  )

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return sorted
    return sorted.filter((s) =>
      [s.name, s.street, s.type].some((v) => v?.toLowerCase().includes(term)),
    )
  }, [search, sorted])

  return (
    <div className="space-y-2">
      <SearchBar value={search} onChange={setSearch} placeholder="Search for a store" />

      {visible.length === 0 && (
        <p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
          No store found for “{search.trim()}”.
        </p>
      )}

      {visible.map((s) => (
        <button
          key={s.id}
          onClick={() => navigate(`/store/${s.id}`)}
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-brand-300 active:scale-[0.98]"
        >
          <StoreLogo store={s} sizeClass="h-12 w-12" emojiClass="text-xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-800">{s.name}</p>
            <p className="truncate text-xs text-slate-500">{s.street}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-brand-600">{s._distance} km</p>
            <p className="text-[11px] text-slate-400">{s.type}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// The chef: one conversation that combines the old questionnaire and free chat.
// The chef asks step by step (time → servings → cuisine → moment → ingredients →
// avoid), then suggests matching real recipes and puts the ingredients on your
// list. You can always type or speak freely; the chef recognizes dishes/
// ingredients and keeps asking follow-ups.
function ChefTab({ goToCart }) {
  const { activeProfile, addIngredients } = useStore()

  const [messages, setMessages] = useState(() => [
    { role: 'ai', text: CHEF_GREETING },
    { role: 'ai', text: CHEF_QUESTIONS[0].question },
  ])
  const [answers, setAnswers] = useState({})
  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState('questions') // 'questions' | 'dishes' | 'done'
  const [pendingMulti, setPendingMulti] = useState([])
  const [suggestedDishes, setSuggestedDishes] = useState([])
  const [selectedDishes, setSelectedDishes] = useState([])
  const [addedCount, setAddedCount] = useState(0)
  const [input, setInput] = useState('')
  const [readAloud, setReadAloud] = useState(false)
  const scrollRef = useRef(null)

  const currentQuestion = phase === 'questions' ? CHEF_QUESTIONS[questionIndex] : null

  // Store an answer, react like a chef and move on to the next question or
  // (after the last question) to the dish suggestions. Doesn't push a user
  // bubble itself — the caller does that (chip choice or free text).
  function processAnswer(question, ids) {
    const labels = ids.map((id) => question.options.find((o) => o.id === id)?.label).filter(Boolean)
    const updated = { ...answers, [question.key]: question.multi ? ids : ids[0] || '' }
    setAnswers(updated)
    setPendingMulti([])

    const reaction = chefReply(question.key, labels)
    setMessages((b) => [...b, { role: 'ai', text: reaction }])

    const next = questionIndex + 1
    if (next < CHEF_QUESTIONS.length) {
      setQuestionIndex(next)
      setMessages((b) => [...b, { role: 'ai', text: CHEF_QUESTIONS[next].question }])
      if (readAloud) speak(`${reaction} ${CHEF_QUESTIONS[next].question}`)
    } else {
      showDishes(updated)
      if (readAloud) speak(reaction)
    }
  }

  // Suggest concrete recipes based on the answers + diet/price from the profile,
  // via the same ranking function as the signup questionnaire.
  function showDishes(answ) {
    const list = rankRecipes({
      ...answ,
      diet: activeProfile?.preferences?.diet || [],
      priceTier: activeProfile?.preferences?.priceTier || '',
    }).slice(0, 6)
    setSuggestedDishes(list)
    setQuestionIndex(CHEF_QUESTIONS.length)
    setPhase('dishes')
    const text = list.length
      ? "Based on your answers I'd recommend these. Tap whatever sounds good and I'll put the ingredients on your list:"
      : "Hmm, I can't find anything that fits this combination. Feel free to start over and relax a choice."
    setMessages((b) => [...b, { role: 'ai', text }])
  }

  function toggleDish(name) {
    setSelectedDishes((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]))
  }

  function confirmDishes() {
    const chosen = suggestedDishes.filter((r) => selectedDishes.includes(r.name))
    if (!chosen.length) return
    const { terms } = ingredientsForDishes(chosen)
    if (terms.length) {
      addIngredients(terms)
      setAddedCount((n) => n + terms.length)
    }
    const names = chosen.map((r) => r.name)
    const text = `Great! For ${joinList(names)} I put ${terms.length} ${
      terms.length === 1 ? 'ingredient' : 'ingredients'
    } on your list. Enjoy! 🍳`
    setMessages((b) => [...b, { role: 'user', text: joinList(names) }, { role: 'ai', text }])
    setPhase('done')
    if (readAloud) speak(text)
  }

  function restart() {
    setAnswers({})
    setPendingMulti([])
    setSuggestedDishes([])
    setSelectedDishes([])
    setQuestionIndex(0)
    setPhase('questions')
    setMessages([{ role: 'ai', text: CHEF_QUESTIONS[0].question }])
  }

  // One place every free message (typed or spoken) goes through.
  function sendMessage(rawText) {
    const text = (rawText ?? '').trim()
    if (!text) return
    setInput('')
    setMessages((b) => [...b, { role: 'user', text }])

    if (phase === 'questions' && currentQuestion) {
      // 1. Does the answer fit the current question? ("quick", "something with chicken")
      const recognized = recognizeChoices(currentQuestion.options, text)
      if (recognized.length) {
        processAnswer(currentQuestion, recognized.map((o) => o.id))
        return
      }
      // 2. Does the customer spontaneously name a dish/ingredient? Add it and keep asking.
      const res = processMessage(text)
      if (res.items.length) {
        addIngredients(res.items.map((i) => i.key))
        setAddedCount((n) => n + res.items.length)
        setMessages((b) => [...b, { role: 'ai', text: `${res.reply} ${currentQuestion.question}` }])
        if (readAloud) speak(res.reply)
        return
      }
      // 3. Nothing recognized — kindly repeat the question.
      setMessages((b) => [...b, { role: 'ai', text: `I didn't quite get that. ${currentQuestion.question}` }])
      return
    }

    // Phase 'dishes'/'done': freely add via the assistant recognition.
    const res = processMessage(text)
    if (res.items.length) {
      addIngredients(res.items.map((i) => i.key))
      setAddedCount((n) => n + res.items.length)
    }
    setMessages((b) => [...b, { role: 'ai', text: res.reply }])
    if (readAloud) speak(res.reply)
  }

  const { supported, listening, interim, startListening, stopListening, speak, stopSpeaking } = useSpeech({
    onResult: sendMessage,
  })

  // Scroll along with new messages.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, interim])

  // Stop the voice when you leave the tab.
  useEffect(() => () => stopSpeaking(), [stopSpeaking])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 13rem)' }}>
      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-3">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {listening && (
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-100 px-4 py-2.5 text-sm italic text-brand-500">
            {interim || 'Listening…'}
          </div>
        )}
      </div>

      {/* Interactive panel: quick replies for the current question, or the dish
          choice, or the wrap-up buttons. */}
      {phase === 'questions' && currentQuestion && (
        <QuickReplies
          question={currentQuestion}
          pending={pendingMulti}
          onChoose={(id) => {
            setMessages((b) => [...b, { role: 'user', text: currentQuestion.options.find((o) => o.id === id)?.label }])
            processAnswer(currentQuestion, [id])
          }}
          onToggle={(id) =>
            setPendingMulti((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
          }
          onDone={() => {
            const labels = pendingMulti.map((id) => currentQuestion.options.find((o) => o.id === id)?.label)
            setMessages((b) => [...b, { role: 'user', text: labels.length ? joinList(labels) : 'No preference' }])
            processAnswer(currentQuestion, pendingMulti)
          }}
        />
      )}

      {phase === 'dishes' && (
        <div className="mb-2 space-y-2">
          <div className="flex flex-wrap gap-2">
            {suggestedDishes.map((r) => {
              const selected = selectedDishes.includes(r.name)
              return (
                <button
                  key={r.name}
                  onClick={() => toggleDish(r.name)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ring-1 transition active:scale-95 ${
                    selected
                      ? 'bg-brand-600 text-white ring-brand-600'
                      : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-300'
                  }`}
                >
                  {r.emoji} {r.name} · {r.time}m
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={confirmDishes}
              disabled={!selectedDishes.length}
              className="flex-1 rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-40"
            >
              {selectedDishes.length ? `Add to my list (${selectedDishes.length})` : 'Pick a dish'}
            </button>
            <button
              onClick={restart}
              className="rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-200 active:scale-95"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="mb-2 flex gap-2">
          <button
            onClick={goToCart}
            className="flex-1 rounded-full bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 active:scale-[0.98]"
          >
            ✓ {addedCount} added · view your list →
          </button>
          <button
            onClick={restart}
            className="rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-200 active:scale-95"
          >
            Another dish
          </button>
        </div>
      )}

      {/* "View list" shortcut as soon as something is added during the chat */}
      {phase !== 'done' && addedCount > 0 && (
        <button
          onClick={goToCart}
          className="mb-2 w-full rounded-full bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 active:scale-[0.98]"
        >
          ✓ {addedCount} added · view your list →
        </button>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
          }}
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-slate-200 focus-within:ring-brand-300"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer or what you want to eat…"
            aria-label="Message to the chef"
            className="flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 active:scale-95 disabled:opacity-40"
          >
            ↑
          </button>
        </form>

        {supported && (
          <button
            onClick={listening ? stopListening : startListening}
            aria-label={listening ? 'Stop listening' : 'Speak'}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg shadow-sm transition active:scale-95 ${
              listening
                ? 'animate-pulse bg-rose-500 text-white ring-4 ring-rose-200'
                : 'bg-white text-brand-600 ring-1 ring-slate-200 hover:ring-brand-300'
            }`}
          >
            🎤
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between px-1">
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={readAloud}
            onChange={(e) => {
              setReadAloud(e.target.checked)
              if (!e.target.checked) stopSpeaking()
            }}
            className="h-3.5 w-3.5 accent-brand-600"
          />
          Read answers aloud
        </label>
        {!supported && <span className="text-xs text-slate-300">Speech not supported in this browser</span>}
      </div>
    </div>
  )
}

// Quick-reply chips for the current chef question. For a single choice a tap
// answers immediately; for multiple choices you collect first and confirm with "Done".
function QuickReplies({ question, pending, onChoose, onToggle, onDone }) {
  return (
    <div className="mb-2 space-y-2">
      <div className="flex flex-wrap gap-2">
        {question.options.map((o) => {
          const selected = question.multi && pending.includes(o.id)
          return (
            <button
              key={o.id}
              onClick={() => (question.multi ? onToggle(o.id) : onChoose(o.id))}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition active:scale-95 ${
                selected
                  ? 'bg-brand-600 text-white ring-brand-600'
                  : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-300'
              }`}
            >
              {o.emoji} {o.label}
            </button>
          )
        })}
      </div>
      {question.multi && (
        <button
          onClick={onDone}
          className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
        >
          {pending.length ? `Done (${pending.length})` : question.skippable ? 'Skip' : 'No preference'}
        </button>
      )}
    </div>
  )
}

function MessageBubble({ message }) {
  if (message.role === 'user') {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm text-white">
        {message.text}
      </div>
    )
  }
  return (
    <div className="mr-auto max-w-[90%] space-y-2">
      <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100">
        <span className="mr-1.5">✨</span>
        {message.text}
      </div>
    </div>
  )
}
