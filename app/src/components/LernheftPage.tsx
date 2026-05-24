import { useState } from 'react'
import { LERNHEFT, type Article, type Block } from '../data/lernheft'
import { type Subject, type SubjectMeta } from '../types'
import { SUBJECT_META } from '../utils/scoring'

interface LernheftPageProps {
  initialSubject?: Subject | null
  onBack: () => void
}

// ─── Block Renderer ───────────────────────────────────────────────────────────

function BlockRenderer({ block }: { block: Block }) {
  switch (block.t) {
    case 'p':
      return <p className="text-gray-700 text-sm leading-relaxed">{block.v}</p>

    case 'h3':
      return <h3 className="font-bold text-gray-900 text-sm mt-1">{block.v}</h3>

    case 'formula':
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
          {block.v}
        </div>
      )

    case 'tip':
      return (
        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <span className="text-base flex-shrink-0 mt-0.5">💡</span>
          <p className="text-amber-800 text-xs leading-relaxed">{block.v}</p>
        </div>
      )

    case 'ul':
      return (
        <ul className="space-y-1 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'table':
      return (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead>
              <tr>
                {block.cols.map((col) => (
                  <th
                    key={col}
                    className="text-left px-3 py-2 bg-gray-100 border border-gray-200 font-semibold text-gray-700"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-3 py-2 border border-gray-200 text-gray-700 leading-relaxed"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

// ─── Article Detail View ──────────────────────────────────────────────────────

function ArticleView({
  article,
  subjectMeta,
  onBack,
}: {
  article: Article
  subjectMeta: SubjectMeta
  onBack: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className={`text-white px-4 py-3 flex items-center gap-3 shadow sticky top-0 z-10 bg-lmu-blue`}>
        <button
          onClick={onBack}
          className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-blue-200 truncate">{subjectMeta.label}</div>
          <div className="font-semibold text-sm truncate leading-tight">{article.title}</div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">
        {article.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </main>
    </div>
  )
}

// ─── Article List View ────────────────────────────────────────────────────────

function ArticleListView({
  subject,
  onSelectArticle,
  onBack,
}: {
  subject: Subject
  onSelectArticle: (article: Article) => void
  onBack: () => void
}) {
  const meta = SUBJECT_META[subject]
  const lernheftEntry = LERNHEFT.find((l) => l.subject === subject)
  const articles = lernheftEntry?.articles ?? []

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-lmu-blue text-white px-4 py-3 flex items-center gap-3 shadow sticky top-0 z-10">
        <button
          onClick={onBack}
          className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="text-xs text-blue-200">Lernheft</div>
          <div className="font-semibold">{meta.label}</div>
        </div>
        <span className="text-xl">{meta.language === 'en' ? '🇬🇧' : '🇩🇪'}</span>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">
        <div className={`rounded-2xl p-4 mb-4 ${meta.bgColor}`}>
          <p className={`text-xs font-semibold ${meta.color}`}>
            {articles.length} Artikel · {meta.language === 'en' ? 'English' : 'Deutsch'}
          </p>
        </div>

        <div className="space-y-2">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="w-full bg-white rounded-xl px-4 py-3.5 text-left shadow-sm border border-gray-100 hover:border-gray-300 hover:shadow transition-all flex items-center gap-3 group"
            >
              <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${meta.bgColor.replace('bg-', 'bg-').replace('-50', '-300')}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 group-hover:text-lmu-blue transition-colors">
                  {article.title}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {article.blocks.length} Abschnitte
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-lmu-blue transition-colors text-lg">›</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

// ─── Subject Grid View ────────────────────────────────────────────────────────

function SubjectGridView({
  onSelectSubject,
  onBack,
}: {
  onSelectSubject: (subject: Subject) => void
  onBack: () => void
}) {
  const subjects = Object.values(SUBJECT_META)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-lmu-blue text-white px-4 py-3 flex items-center gap-3 shadow sticky top-0 z-10">
        <button
          onClick={onBack}
          className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition"
        >
          ←
        </button>
        <span className="font-semibold flex-1">Lernheft</span>
        <span className="text-xl">📖</span>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">
        <p className="text-gray-500 text-sm mb-5">
          Zusammengefasste Artikel zu allen 6 Themengebieten der Eingangsklausur.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {subjects.map((meta) => {
            const lernheftEntry = LERNHEFT.find((l) => l.subject === meta.id)
            const count = lernheftEntry?.articles.length ?? 0

            return (
              <button
                key={meta.id}
                onClick={() => onSelectSubject(meta.id)}
                className={`rounded-2xl p-4 text-left border transition-all hover:shadow-md hover:-translate-y-0.5 ${meta.bgColor} border-transparent hover:${meta.borderColor} group`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.language === 'en' ? '🇬🇧' : '🇩🇪'}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${meta.color}`}>{meta.label}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {count} Artikel · {meta.language === 'en' ? 'English' : 'Deutsch'}
                    </div>
                  </div>
                  <span className={`text-xl ${meta.color} opacity-40 group-hover:opacity-100 transition-opacity`}>›</span>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LernheftPage({ initialSubject, onBack }: LernheftPageProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(initialSubject ?? null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  // Article detail
  if (selectedSubject && selectedArticle) {
    return (
      <ArticleView
        article={selectedArticle}
        subjectMeta={SUBJECT_META[selectedSubject]}
        onBack={() => setSelectedArticle(null)}
      />
    )
  }

  // Article list for a subject
  if (selectedSubject) {
    return (
      <ArticleListView
        subject={selectedSubject}
        onSelectArticle={(article) => setSelectedArticle(article)}
        onBack={() => setSelectedSubject(null)}
      />
    )
  }

  // Subject grid (top level)
  return (
    <SubjectGridView
      onSelectSubject={(subject) => setSelectedSubject(subject)}
      onBack={onBack}
    />
  )
}
