interface LiteraturePageProps {
  onBack: () => void
}

interface LitItem {
  title: string
  url: string
}

interface LitSection {
  id: string
  label: string
  language: 'en' | 'de'
  color: string
  bgColor: string
  items: LitItem[]
}

const LITERATURE: LitSection[] = [
  {
    id: 'risk',
    label: 'Risk Management',
    language: 'en',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    items: [
      {
        title: 'Berk, J. & DeMarzo, P. (2023). Corporate Finance, 5th ed. — Chapter 20: Options',
        url: 'https://www.pearson.com/en-us/subject-catalog/p/corporate-finance/P200000005936',
      },
      {
        title: 'Berk, J. & DeMarzo, P. (2023). Corporate Finance, 5th ed. — Chapter 21: Option Valuation',
        url: 'https://www.pearson.com/en-us/subject-catalog/p/corporate-finance/P200000005936',
      },
      {
        title: 'Berk, J. & DeMarzo, P. (2023). Corporate Finance, 5th ed. — Chapter 30: Risk Management',
        url: 'https://www.pearson.com/en-us/subject-catalog/p/corporate-finance/P200000005936',
      },
    ],
  },
  {
    id: 'accounting',
    label: 'Unternehmensrechnung',
    language: 'de',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    items: [
      {
        title: 'Friedl, G., Hofmann, C. & Pedell, B. (2017). Kostenrechnung — Kap. 1, 7–11',
        url: 'https://www.vahlen.de/friedl-hofmann-pedell-kostenrechnung/product/3426498',
      },
      {
        title: 'Pellens, B. et al. (2021). Internationale Rechnungslegung — Kap. 1–5, 21, 27',
        url: 'https://www.schaeffer-poeschel.de/produkt/internationale-rechnungslegung-9783791052489',
      },
    ],
  },
  {
    id: 'digital',
    label: 'Digitale Unternehmung',
    language: 'de',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    items: [
      {
        title: 'Alt, R., Fleisch, E. & Österle, H. (2005). Business Networking: Shaping Collaboration Between Enterprises',
        url: 'https://scholar.google.com/scholar?q=Alt+Fleisch+%C3%96sterle+Business+Networking+2005',
      },
      {
        title: 'Hess, T. (2007). Wissensmanagement im Unternehmen',
        url: 'https://scholar.google.com/scholar?q=Hess+Wissensmanagement+2007',
      },
      {
        title: 'Lilien, G. L., Morrison, P. D., Searls, K., Sonnack, M. & von Hippel, E. (2002). Performance Assessment of the Lead User Idea-Generation Process. Management Science, 48(8).',
        url: 'https://doi.org/10.1287/mnsc.48.8.1042.167',
      },
      {
        title: 'Van der Aalst, W. M. P. (2016). Process Mining: Data Science in Action, 2nd ed.',
        url: 'https://link.springer.com/book/10.1007/978-3-662-49851-4',
      },
      {
        title: 'Varian, H. R. (2014). Big Data: New Tricks for Econometrics. Journal of Economic Perspectives, 28(2), 3–28.',
        url: 'https://doi.org/10.1257/jep.28.2.3',
      },
    ],
  },
  {
    id: 'strategy',
    label: 'Competition & Strategy',
    language: 'en',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    items: [
      {
        title: 'Besanko, D., Dranove, D., Shanley, M. & Schaefer, S. (2017). Economics of Strategy, 7th ed.',
        url: 'https://www.wiley.com/en-us/Economics+of+Strategy%2C+7th+Edition-p-9781119042310',
      },
      {
        title: 'Brandenburger, A. M. & Nalebuff, B. J. (1996). Co-opetition.',
        url: 'https://scholar.google.com/scholar?q=Brandenburger+Nalebuff+Co-opetition+1996',
      },
      {
        title: 'Cabral, L. M. B. (2017). Introduction to Industrial Organization, 2nd ed.',
        url: 'https://mitpress.mit.edu/9780262035941/',
      },
      {
        title: 'Porter, M. E. (1980). Competitive Strategy.',
        url: 'https://scholar.google.com/scholar?q=Porter+Competitive+Strategy+1980',
      },
      {
        title: 'Shapiro, C. & Varian, H. R. (1999). Information Rules: A Strategic Guide to the Network Economy.',
        url: 'https://scholar.google.com/scholar?q=Shapiro+Varian+Information+Rules+1999',
      },
    ],
  },
  {
    id: 'people',
    label: 'People & Organization',
    language: 'en',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    items: [
      {
        title: 'Aguinis, H. & Kraiger, K. (2009). Benefits of Training and Development. Annual Review of Psychology, 60, 451–474.',
        url: 'https://doi.org/10.1146/annurev.psych.60.110707.163505',
      },
      {
        title: 'Bidwell, M. (2011). Paying More to Get Less. Administrative Science Quarterly, 56(3), 369–407.',
        url: 'https://doi.org/10.1177/0001839211433562',
      },
      {
        title: 'Breaugh, J. A. (2013). Employee Recruitment. Annual Review of Psychology, 64, 389–416.',
        url: 'https://doi.org/10.1146/annurev-psych-113011-143757',
      },
      {
        title: 'Gerhart, B. & Weller, I. (2019). Compensation. In Handbook of Human Resource Management. Sage.',
        url: 'https://scholar.google.com/scholar?q=Gerhart+Weller+Compensation+2019',
      },
      {
        title: 'Gibson, C. B. & Gibbs, J. L. (2006). Unpacking the Concept of Virtuality. Administrative Science Quarterly, 51(3), 451–495.',
        url: 'https://doi.org/10.2189/asqu.51.3.451',
      },
      {
        title: 'Heilman, M. E. & Caleo, S. (2018). Combating Gender Discrimination. In Oxford Handbook of Women and the Economy.',
        url: 'https://scholar.google.com/scholar?q=Heilman+Caleo+2018+gender+discrimination',
      },
      {
        title: 'Junker, N. M. & van Dick, R. (2014). Implicit Theories in Organizational Settings. Leadership Quarterly, 25(6), 1078–1097.',
        url: 'https://doi.org/10.1016/j.leaqua.2014.09.002',
      },
      {
        title: 'Kanfer, R. & Chen, G. (2016). Motivation in Organizational Behavior. Organizational Behavior and Human Decision Processes, 136, 6–19.',
        url: 'https://doi.org/10.1016/j.obhdp.2016.06.002',
      },
      {
        title: 'Mathieu, J., Hollenbeck, J. R., van Knippenberg, D. & Ilgen, D. R. (2017). A Century of Work Teams. Journal of Applied Psychology, 102(3), 452–467.',
        url: 'https://doi.org/10.1037/apl0000128',
      },
      {
        title: 'Oldham, G. R. & Fried, Y. (2016). Job Design Research and Theory. Organizational Behavior and Human Decision Processes, 136, 20–35.',
        url: 'https://doi.org/10.1016/j.obhdp.2016.05.002',
      },
      {
        title: 'Sackett, P. R. et al. (2022). Revisiting Meta-Analytic Estimates of Validity. Journal of Applied Psychology, 107(12), 2180–2209.',
        url: 'https://doi.org/10.1037/apl0001009',
      },
      {
        title: 'Sinding, K. & Waldstrom, C. (2014). Organisational Behaviour.',
        url: 'https://scholar.google.com/scholar?q=Sinding+Waldstrom+Organisational+Behaviour+2014',
      },
    ],
  },
  {
    id: 'international',
    label: 'International Management',
    language: 'en',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    items: [
      {
        title: 'Hill, C. W. L. (2023). International Business: Competing in the Global Marketplace, 14th ed. McGraw-Hill.',
        url: 'https://www.mheducation.com/highered/product/international-business-competing-global-marketplace-hill/M9781260598056.html',
      },
    ],
  },
]

export function LiteraturePage({ onBack }: LiteraturePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-lmu-blue text-white px-4 py-3 shadow sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition"
          >
            ←
          </button>
          <span className="font-semibold">Literaturübersicht</span>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
        <p className="text-sm text-gray-500 bg-white rounded-xl p-4 border shadow-sm">
          Alle Pflichtlektüren für den LMU Master BWL Auswahltest 2026. Klicke auf einen Titel, um zur Quelle zu gelangen.
        </p>

        {LITERATURE.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className={`px-5 py-4 border-b ${section.bgColor}`}>
              <div className="flex items-center gap-2">
                <span>{section.language === 'en' ? '🇬🇧' : '🇩🇪'}</span>
                <h2 className={`font-bold text-base ${section.color}`}>{section.label}</h2>
              </div>
            </div>
            <ul className="divide-y">
              {section.items.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition group"
                  >
                    <span className="flex-shrink-0 mt-0.5 text-gray-300 group-hover:text-lmu-light transition">🔗</span>
                    <span className="text-sm text-gray-700 group-hover:text-lmu-blue transition leading-relaxed">
                      {item.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  )
}
