import { type Subject } from '../types'

export type Block =
  | { t: 'p'; v: string }
  | { t: 'formula'; v: string }
  | { t: 'tip'; v: string }
  | { t: 'h3'; v: string }
  | { t: 'table'; cols: string[]; rows: string[][] }
  | { t: 'ul'; items: string[] }

export interface Article {
  id: string
  title: string
  blocks: Block[]
}

export interface SubjectLernheft {
  subject: Subject
  articles: Article[]
}

// ─── RISK MANAGEMENT ──────────────────────────────────────────────────────────

const riskArticles: Article[] = [
  {
    id: 'risk-1',
    title: '1.1 Option Basics',
    blocks: [
      { t: 'p', v: 'An option gives the holder the right, but not the obligation, to buy (call) or sell (put) an underlying asset at a predetermined strike price K on or before a specified expiry date T.' },
      { t: 'h3', v: 'Payoff at Expiry' },
      { t: 'table', cols: ['Type', 'Payoff (long)', 'Payoff (short)'], rows: [
        ['Call', 'max(S_T − K, 0)', '−max(S_T − K, 0)'],
        ['Put',  'max(K − S_T, 0)', '−max(K − S_T, 0)'],
      ]},
      { t: 'h3', v: 'Moneyness' },
      { t: 'ul', items: [
        'In-the-money (ITM): exercising yields a positive payoff (S > K for call; S < K for put)',
        'At-the-money (ATM): S ≈ K',
        'Out-of-the-money (OTM): exercising yields zero payoff',
      ]},
      { t: 'h3', v: 'Option Value Components' },
      { t: 'formula', v: 'Option Price = Intrinsic Value + Time Value' },
      { t: 'p', v: 'Intrinsic value is the immediate exercise value; time value reflects the possibility that the option moves further in-the-money before expiry. Time value is always ≥ 0 and decays to zero at expiry (theta decay).' },
      { t: 'tip', v: 'European options can only be exercised at expiry; American options can be exercised at any time. For non-dividend-paying stocks, early exercise of an American call is never optimal.' },
    ],
  },
  {
    id: 'risk-2',
    title: '1.2 Put-Call Parity',
    blocks: [
      { t: 'p', v: 'Put-Call Parity is a no-arbitrage relationship that links the prices of European puts and calls with the same strike K, maturity T, and underlying S.' },
      { t: 'formula', v: 'c + K·e^(−rT) = p + S₀' },
      { t: 'p', v: 'The left side represents a portfolio of: long call + invested present value of strike. The right side: long put + long stock. Both portfolios have identical payoffs at T, so they must have the same price today.' },
      { t: 'h3', v: 'Arbitrage Violations' },
      { t: 'p', v: 'If c + PV(K) < p + S, buy the left side and sell the right side (borrow to buy call + bond, short stock + sell put). The opposite trade if c + PV(K) > p + S.' },
      { t: 'tip', v: 'Put-Call Parity only holds for European options. For American options it becomes an inequality: C − P ≤ S₀ − K·e^(−rT) ≤ C − P + dividends.' },
    ],
  },
  {
    id: 'risk-3',
    title: '1.3 Binomial Option Pricing',
    blocks: [
      { t: 'p', v: 'The binomial model divides the option life into discrete time steps. At each step the stock price either moves up (factor u) or down (factor d).' },
      { t: 'h3', v: 'Risk-Neutral Probability' },
      { t: 'formula', v: 'p* = (e^(rΔt) − d) / (u − d)' },
      { t: 'p', v: 'where r is the risk-free rate and Δt is the length of one time step. The option is priced as the discounted expected payoff under the risk-neutral measure.' },
      { t: 'h3', v: 'Replication Portfolio' },
      { t: 'p', v: 'A call can be replicated by holding Δ shares of stock and borrowing B dollars. Solving the two-equation system (up-state, down-state) gives the replicating portfolio, which must equal the option price to prevent arbitrage.' },
      { t: 'formula', v: 'Δ = (C_u − C_d) / (S·u − S·d)' },
      { t: 'tip', v: 'For multi-period trees, work backwards from expiry: compute option values at each node and discount one step at a time using risk-neutral probabilities.' },
    ],
  },
  {
    id: 'risk-4',
    title: '1.4 Black-Scholes Model',
    blocks: [
      { t: 'p', v: 'The Black-Scholes model provides a closed-form price for European options under the assumption of continuous trading, constant volatility σ, and log-normally distributed stock returns.' },
      { t: 'h3', v: 'Black-Scholes Formula (Call)' },
      { t: 'formula', v: 'c = S₀·N(d₁) − K·e^(−rT)·N(d₂)' },
      { t: 'formula', v: 'd₁ = [ln(S₀/K) + (r + σ²/2)T] / (σ√T)\nd₂ = d₁ − σ√T' },
      { t: 'p', v: "N(·) is the standard normal cumulative distribution function. N(d₂) is the risk-neutral probability that the option expires in-the-money. N(d₁) is the option's delta." },
      { t: 'h3', v: 'Key Assumptions' },
      { t: 'ul', items: [
        'No dividends during option life',
        'Constant risk-free rate r and volatility σ',
        'Continuous trading, no transaction costs',
        'No arbitrage opportunities',
        'Log-normal distribution of stock prices',
      ]},
      { t: 'tip', v: 'In practice, implied volatility varies by strike and maturity (the "volatility smile/skew"), violating the constant-σ assumption. Practitioners use Black-Scholes to quote implied vol rather than prices.' },
    ],
  },
  {
    id: 'risk-5',
    title: '1.5 The Greeks',
    blocks: [
      { t: 'p', v: 'The Greeks measure the sensitivity of an option price to changes in input parameters. They are essential for risk management and dynamic hedging.' },
      { t: 'table', cols: ['Greek', 'Definition', 'Call range', 'Put range'], rows: [
        ['Delta (Δ)', 'dC/dS — change in option price per $1 move in S', '0 to 1', '−1 to 0'],
        ['Gamma (Γ)', 'd²C/dS² — rate of change of delta', '> 0', '> 0'],
        ['Theta (Θ)', 'dC/dt — time decay per day', '< 0 (usually)', '< 0 (usually)'],
        ['Vega (ν)', 'dC/dσ — sensitivity to volatility', '> 0', '> 0'],
        ['Rho (ρ)', 'dC/dr — sensitivity to interest rate', '> 0', '< 0'],
      ]},
      { t: 'h3', v: 'Delta Neutrality' },
      { t: 'p', v: 'A delta-neutral portfolio has Δ = 0, meaning small moves in the underlying have no first-order effect on portfolio value. Achieving delta neutrality requires dynamic rebalancing because delta changes as S moves.' },
      { t: 'tip', v: 'Gamma measures convexity: high-gamma options benefit from large moves in either direction. A short-gamma position benefits from low volatility (stable underlying).' },
    ],
  },
  {
    id: 'risk-6',
    title: '1.6 Option Strategies',
    blocks: [
      { t: 'p', v: 'Option strategies combine positions in calls, puts, and the underlying to create specific payoff profiles tailored to market views.' },
      { t: 'table', cols: ['Strategy', 'Construction', 'View'], rows: [
        ['Bull Call Spread', 'Long call K₁ + Short call K₂ (K₂ > K₁)', 'Moderately bullish'],
        ['Bear Put Spread', 'Long put K₂ + Short put K₁ (K₂ > K₁)', 'Moderately bearish'],
        ['Straddle', 'Long call K + Long put K', 'High volatility expected'],
        ['Strangle', 'Long call K₂ + Long put K₁ (K₂ > K₁)', 'High volatility, cheaper'],
        ['Butterfly', 'Long call K₁ + Short 2 calls K₂ + Long call K₃', 'Low volatility (range-bound)'],
        ['Protective Put', 'Long stock + Long put', 'Downside protection'],
        ['Covered Call', 'Long stock + Short call', 'Yield enhancement'],
      ]},
      { t: 'tip', v: 'For spread positions, the maximum gain and loss are capped. For straddles, you profit if the move exceeds the total premium paid in either direction.' },
    ],
  },
  {
    id: 'risk-7',
    title: '1.7 Hedging with Derivatives',
    blocks: [
      { t: 'p', v: 'Hedging reduces exposure to unwanted risks. A perfect hedge eliminates risk entirely; in practice, basis risk (the difference between the hedged asset and the hedge instrument) remains.' },
      { t: 'h3', v: 'Delta Hedging' },
      { t: 'p', v: 'To delta-hedge a short call position, hold Δ shares of the underlying. The hedge is self-financing only instantaneously — it must be rebalanced continuously as Δ changes (dynamic hedging).' },
      { t: 'h3', v: 'Minimum-Variance Hedge Ratio' },
      { t: 'formula', v: 'h* = ρ · (σ_S / σ_F)' },
      { t: 'p', v: 'where ρ is the correlation between the spot and futures price changes, σ_S the spot price volatility, and σ_F the futures price volatility.' },
      { t: 'tip', v: 'Transaction costs limit how frequently a delta hedge can be rebalanced in practice. Gamma and vega hedging (using other options) reduce the need for frequent rebalancing.' },
    ],
  },
  {
    id: 'risk-8',
    title: '1.8 Merton Model (Structural Credit Risk)',
    blocks: [
      { t: 'p', v: "The Merton model (1974) treats a firm's equity as a call option on its assets. If the asset value V_A falls below the face value of debt D at maturity T, the firm defaults." },
      { t: 'formula', v: 'E = V_A · N(d₁) − D · e^(−rT) · N(d₂)' },
      { t: 'p', v: "Equity holders have limited liability: they keep the upside (V_A − D when V_A > D) but can walk away when V_A < D, leaving the firm to creditors. This is exactly the payoff of a call on V_A with strike D." },
      { t: 'h3', v: 'Implications' },
      { t: 'ul', items: [
        'Probability of default ≈ N(−d₂) under risk-neutral measure',
        'Credit spreads increase with leverage and asset volatility',
        'Debt holders are implicitly short a put on firm assets',
        'Asset substitution: equity holders gain from increasing risk (moral hazard)',
      ]},
      { t: 'tip', v: 'The Merton model assumes a simple capital structure with a single zero-coupon bond. Extensions (Leland, KMV) handle more complex structures and stochastic interest rates.' },
    ],
  },
  {
    id: 'risk-9',
    title: '1.9 Real Options',
    blocks: [
      { t: 'p', v: 'Real options apply option pricing theory to corporate investment decisions. A project may have embedded flexibility — the right but not the obligation to take future actions — which NPV analysis ignores.' },
      { t: 'h3', v: 'Types of Real Options' },
      { t: 'table', cols: ['Option Type', 'Analogous To', 'Example'], rows: [
        ['Option to expand', 'Call', 'Scale up production if demand is high'],
        ['Option to abandon', 'Put', 'Sell assets or exit market if project fails'],
        ['Option to defer', 'Call', 'Delay investment until uncertainty resolves'],
        ['Option to switch', 'Exchange option', 'Switch inputs/outputs based on prices'],
        ['Growth option', 'Call on a call', 'R&D investment opens future projects'],
      ]},
      { t: 'formula', v: 'Expanded NPV = Passive NPV + Option Value' },
      { t: 'tip', v: 'Real options are most valuable when: (1) uncertainty is high, (2) management has genuine flexibility, and (3) the investment is irreversible. Standard DCF undervalues projects with embedded options.' },
    ],
  },
  {
    id: 'risk-10',
    title: '1.10 Agency Costs & Capital Structure',
    blocks: [
      { t: 'p', v: "Modigliani-Miller (1958) showed that in perfect markets, a firm's value is independent of its capital structure. Adding taxes introduces the interest tax shield, making debt valuable. But frictions (agency costs, financial distress) limit optimal leverage." },
      { t: 'h3', v: 'Agency Problems with Debt' },
      { t: 'ul', items: [
        'Asset substitution (risk-shifting): equity holders take on riskier projects after debt is issued, transferring value from creditors to themselves',
        'Debt overhang: existing debt discourages new positive-NPV investment because gains go to creditors, not equity holders (Myers 1977)',
        'Underinvestment: firms close to distress may forgo good projects because equity must be diluted to fund them',
        'Wealth transfer at maturity: equity holders benefit from dividends paid out before debt matures',
      ]},
      { t: 'h3', v: 'Trade-off Theory' },
      { t: 'formula', v: 'V_L = V_U + PV(Tax Shield) − PV(Financial Distress Costs)' },
      { t: 'p', v: 'Optimal leverage balances the tax shield against expected costs of financial distress and agency conflicts. Firms with stable cash flows and tangible assets can support more debt.' },
      { t: 'tip', v: 'Pecking Order Theory (Myers-Majluf) argues firms prefer internal funds > debt > equity due to asymmetric information. This predicts no clear target leverage ratio.' },
    ],
  },
]

// ─── UNTERNEHMENSRECHNUNG ─────────────────────────────────────────────────────

const accountingArticles: Article[] = [
  {
    id: 'acc-1',
    title: '2.1 Grundbegriffe der Kostenrechnung',
    blocks: [
      { t: 'p', v: 'Die Kosten- und Leistungsrechnung (KLR) ist Teil des internen Rechnungswesens und dient der Planung, Steuerung und Kontrolle des betrieblichen Leistungsprozesses.' },
      { t: 'h3', v: 'Zentrale Begriffsabgrenzungen' },
      { t: 'table', cols: ['Begriff', 'Definition', 'Beispiel'], rows: [
        ['Auszahlung', 'Abgang flüssiger Mittel', 'Barzahlung Lieferant'],
        ['Ausgabe', 'Vermögensminderung (inkl. Verbindlichkeit)', 'Kauf auf Ziel'],
        ['Aufwand', 'Wertverbrauch in der GuV-Periode', 'Abschreibung, Lohn'],
        ['Kosten', 'Bewerteter Güterverbrauch für betrieblichen Zweck', 'Materialkosten, kalk. AfA'],
      ]},
      { t: 'h3', v: 'Kostenarten' },
      { t: 'ul', items: [
        'Variable Kosten (KV): ändern sich proportional zur Ausbringungsmenge (Stückmaterial, Akkordlohn)',
        'Fixe Kosten (KF): fallen unabhängig von der Menge an (Miete, Gehälter)',
        'Gemeinkosten: können nicht direkt auf Kostenträger zugerechnet werden',
        'Einzelkosten: direkt einem Kostenträger zurechenbar (Fertigungsmaterial)',
      ]},
      { t: 'tip', v: 'Kalkulatorische Kosten (kalk. Abschreibung, kalk. Zinsen, kalk. Unternehmerlohn) sind kostenrechnerische Größen ohne buchhalterischen Gegenwert — sie werden nur in der KLR berücksichtigt.' },
    ],
  },
  {
    id: 'acc-2',
    title: '2.2 Betriebsabrechnungsbogen (BAB)',
    blocks: [
      { t: 'p', v: 'Der Betriebsabrechnungsbogen verteilt die Gemeinkosten zunächst auf Kostenstellen (primäre Verteilung) und dann mittels Innerbetrieblicher Leistungsverrechnung (ILV) auf die Endkostenstellen (sekundäre Verteilung).' },
      { t: 'h3', v: 'Aufbau des BAB' },
      { t: 'ul', items: [
        'Hilfskostenstellen: Material, Fertigung, Verwaltung, Vertrieb (Beispiele)',
        'Primäre Verteilung: direkte Zurechnung der Kosten auf Kostenstellen (z. B. nach Strom-kWh)',
        'Sekundäre Verteilung: Umlage der Hilfskostenstellen auf Hauptkostenstellen',
        'Zuschlagsatz = Gemeinkosten der Stelle / Bezugsgröße der Stelle',
      ]},
      { t: 'h3', v: 'Zuschlagsätze' },
      { t: 'formula', v: 'Materialgemeinkosten-Zuschlag = MGK / Materialeinzelkosten × 100 %\nFertigungsgemeinkosten-Zuschlag = FGK / Fertigungslöhne × 100 %\nVerwaltungs-GK-Zuschlag = VwGK / Herstellkosten × 100 %\nVertriebs-GK-Zuschlag = VtGK / Herstellkosten × 100 %' },
      { t: 'tip', v: 'Die Innerbetriebliche Leistungsverrechnung (Anbauverfahren, Stufenleiterverfahren, Gleichungsverfahren) löst gegenseitige Leistungsbeziehungen zwischen Hilfskostenstellen auf.' },
    ],
  },
  {
    id: 'acc-3',
    title: '2.3 Deckungsbeitragsrechnung',
    blocks: [
      { t: 'p', v: 'Die Deckungsbeitragsrechnung (Direct Costing) trennt Einzel-/variable Kosten von den Fixkosten. Sie ist entscheidungsrelevant für kurzfristige Preis- und Produktionsentscheidungen.' },
      { t: 'h3', v: 'Einstufige DB-Rechnung' },
      { t: 'formula', v: 'DB = Erlös − variable Kosten\nBetriebsergebnis = Gesamt-DB − Fixkosten' },
      { t: 'h3', v: 'Break-Even-Analyse' },
      { t: 'formula', v: 'x_BE = Fixkosten / DB je Stück\nUmsatz_BE = Fixkosten / DB-Quote\nDB-Quote = DB / Umsatz' },
      { t: 'h3', v: 'Mehrstufige DB-Rechnung' },
      { t: 'p', v: 'Fixkosten werden in Schichten aufgeteilt (Produkt-Fix, Produktgruppen-Fix, Sparten-Fix, Unternehmens-Fix). Jede Stufe zeigt, wie viel des Deckungsbeitrags die jeweilige Ebene zur Deckung ihrer Fixkosten beisteuert.' },
      { t: 'h3', v: 'Engpassentscheidung' },
      { t: 'formula', v: 'Relativer DB = DB je Stück / Engpassbeanspruchung je Stück' },
      { t: 'p', v: 'Bei einem einzigen Engpass wird nach dem höchsten relativen DB je Engpasseinheit (z. B. Maschinenstunde) sortiert.' },
      { t: 'tip', v: 'Make-or-Buy: Kurzfristig lohnt sich Eigenfertigung, wenn der variable Selbstkostensatz kleiner ist als der Einkaufspreis. Langfristig müssen auch Fixkosten berücksichtigt werden.' },
    ],
  },
  {
    id: 'acc-4',
    title: '2.4 Plankostenrechnung',
    blocks: [
      { t: 'p', v: 'Die Plankostenrechnung stellt Plankosten (Sollkosten bei Planmenge) den Istkosten gegenüber und ermöglicht so eine detaillierte Kostenabweichungsanalyse.' },
      { t: 'h3', v: 'Kostenarten in der Plankostenrechnung' },
      { t: 'table', cols: ['Größe', 'Formel'], rows: [
        ['Plankosten (gesamt)', 'KF_plan + kv_plan × x_plan'],
        ['Sollkosten', 'KF_plan + kv_plan × x_ist'],
        ['Verrechnete Plankosten', 'Plankostensatz × x_ist'],
        ['Istkosten', 'Tatsächlich angefallene Kosten'],
      ]},
      { t: 'h3', v: 'Abweichungsarten (starre Plankostenrechnung)' },
      { t: 'ul', items: [
        'Gesamtabweichung = Istkosten − verrechnete Plankosten',
        'Beschäftigungsabweichung = verrechnete Plankosten − Sollkosten (zeigt Fixkostenunter-/überdeckung)',
        'Verbrauchsabweichung = Sollkosten − Istkosten (zeigt tatsächliche Effizienz)',
      ]},
      { t: 'tip', v: 'Bei der flexiblen Plankostenrechnung werden Sollkosten für die Istbeschäftigung berechnet. Die Beschäftigungsabweichung entfällt; nur Verbrauchsabweichung bleibt als steuerbare Größe.' },
    ],
  },
  {
    id: 'acc-5',
    title: '2.5 Zuschlagskalkulation',
    blocks: [
      { t: 'p', v: 'Die Zuschlagskalkulation (Vollkostenrechnung) ermittelt die Selbstkosten eines Erzeugnisses durch schrittweise Addition aller Kostenarten und -zuschläge.' },
      { t: 'h3', v: 'Kalkulationsschema' },
      { t: 'table', cols: ['Position', 'Berechnung'], rows: [
        ['Fertigungsmaterial', 'direkt'],
        ['+ Materialgemeinkosten', '+ MGK-Zuschlag × FMat'],
        ['= Materialkosten', ''],
        ['+ Fertigungslöhne', 'direkt'],
        ['+ Fertigungsgemeinkosten', '+ FGK-Zuschlag × FL'],
        ['= Fertigungskosten', ''],
        ['= Herstellkosten', 'Mat. + Fert. + Sonderkosten'],
        ['+ Verwaltungsgemeinkosten', '+ VwGK-Zuschlag × HK'],
        ['+ Vertriebsgemeinkosten', '+ VtGK-Zuschlag × HK'],
        ['= Selbstkosten', ''],
        ['+ Gewinnzuschlag', ''],
        ['= Angebotspreis', ''],
      ]},
      { t: 'tip', v: 'Vorwärtskalkulation: Preis wird aus Kosten hergeleitet. Rückwärtskalkulation: Zielpreis (Marktpreis) wird um Kosten reduziert, um den verbleibenden Spielraum zu bestimmen.' },
    ],
  },
  {
    id: 'acc-6',
    title: '2.6 IFRS Grundlagen',
    blocks: [
      { t: 'p', v: 'Die International Financial Reporting Standards (IFRS) sind internationale Rechnungslegungsstandards, die für börsennotierte Konzerne in der EU verpflichtend sind. Ziel ist eine entscheidungsnützliche Information für Investoren (Decision Usefulness).' },
      { t: 'h3', v: 'Grundlegende Annahmen und Prinzipien' },
      { t: 'ul', items: [
        'Periodenabgrenzung (Accrual Basis): Erträge und Aufwendungen werden erfasst, wenn sie entstehen, nicht wenn Cash fließt',
        'Unternehmensfortführung (Going Concern)',
        'Fair Presentation: Abschluss muss treu und fair die Lage darstellen',
        'Wesentlichkeit (Materiality): unwesentliche Posten können zusammengefasst werden',
        'Stetigkeit: Bilanzierungs- und Bewertungsmethoden sind beizubehalten',
      ]},
      { t: 'h3', v: 'Ansatzkriterien (Asset/Liability)' },
      { t: 'p', v: 'Ein Vermögenswert wird angesetzt, wenn (1) ein wirtschaftlicher Nutzen wahrscheinlich zufließen wird und (2) die Kosten/der Wert verlässlich messbar ist.' },
      { t: 'h3', v: 'Bewertungsmaßstäbe' },
      { t: 'table', cols: ['Maßstab', 'Beschreibung'], rows: [
        ['Historical Cost', 'Anschaffungs-/Herstellungskosten abzgl. Abschreibungen'],
        ['Fair Value', 'Preis in einem geordneten Verkauf zwischen unabhängigen Dritten'],
        ['Net Realisable Value', 'Erwarteter Verkaufserlös abzgl. Fertigstellungs- und Verkaufskosten'],
        ['Value in Use', 'Barwert der erwarteten Cashflows aus dem Vermögenswert'],
      ]},
      { t: 'tip', v: 'Das Vorsichtsprinzip (Prudence) des HGB gilt unter IFRS nicht in gleicher Weise — IFRS erlaubt aufwärts-Neubewertungen und verbietet übermäßige Rückstellungen.' },
    ],
  },
  {
    id: 'acc-7',
    title: '2.7 Wichtige IFRS Standards',
    blocks: [
      { t: 'p', v: 'Für die Klausur relevante Standards im Überblick:' },
      { t: 'table', cols: ['Standard', 'Thema', 'Kerninhalte'], rows: [
        ['IAS 2', 'Vorräte', 'Bewertung zu Anschaffungs-/HK oder NRV (lower of cost or NRV); FIFO oder Durchschnitt; kein LIFO'],
        ['IAS 16', 'Sachanlagen', 'Zugangsbewertung zu AHK; Folgebewertung: Cost Model oder Revaluation Model; planmäßige AfA'],
        ['IAS 36', 'Wertminderung', 'Impairment Test: Buchwert vs. erzielbarer Betrag (Max aus Fair Value und Value in Use); Wertaufholung erlaubt (außer Goodwill)'],
        ['IAS 37', 'Rückstellungen', 'Ansatz nur wenn: gegenwärtige Verpflichtung, Abfluss wahrscheinlich, verlässlich schätzbar; keine Aufwandsrückstellungen'],
        ['IAS 38', 'Immat. VW', 'Selbst erstellte immaterielle VW: Entwicklungskosten aktivierbar (6 Kriterien), Forschungskosten immer Aufwand; Zugangsbewertung zu AK'],
        ['IFRS 15', 'Umsatzrealisierung', '5-Schritte-Modell: Vertrag identifizieren, Leistungspflichten, Transaktionspreis, Allokation, Erfüllung'],
        ['IFRS 16', 'Leasingverhältnisse', 'Leasingnehmer: Right-of-Use Asset + Leasingverbindlichkeit; IFRS 16 schafft weitgehend Operating Lease ab'],
      ]},
      { t: 'tip', v: 'IAS 36 Impairment: Recoverable Amount = max(Fair Value less costs to sell, Value in Use). Bei Goodwill ist eine Wertaufholung verboten.' },
    ],
  },
  {
    id: 'acc-8',
    title: '2.8 Prozesskostenrechnung (Activity-Based Costing)',
    blocks: [
      { t: 'p', v: 'Die Prozesskostenrechnung (PKR) überwindet die pauschalen Gemeinkostenzuschläge der Zuschlagskalkulation, indem sie Gemeinkosten über Teilprozesse und Kostentreiber (Cost Drivers) verursachungsgerecht auf Produkte/Kunden verteilt.' },
      { t: 'h3', v: 'Vorgehensweise' },
      { t: 'ul', items: [
        '1. Hauptprozesse und Teilprozesse identifizieren (z. B. „Bestellung aufnehmen", „Lieferung veranlassen")',
        '2. Kostentreiber (Cost Driver) je Prozess bestimmen (z. B. Anzahl Bestellungen)',
        '3. Prozesskostensatz = Kosten des Prozesses / Menge des Cost Drivers',
        '4. Produktkalkulation: Produktkosten += Prozessnutzung × Prozesskostensatz',
      ]},
      { t: 'h3', v: 'Vorteile gegenüber Zuschlagskalkulation' },
      { t: 'ul', items: [
        'Komplexe (kleinstückige, variantenreiche) Produkte werden realistischer bewertet',
        'Transparenz über Overhead-Kosten',
        'Ansatzpunkt für Prozessoptimierung und Lean-Management',
      ]},
      { t: 'tip', v: 'PKR ist aufwendiger als Zuschlagskalkulation und lohnt sich besonders, wenn Gemeinkosten hoch sind und Produkte unterschiedlich stark auf Support-Prozesse zurückgreifen.' },
    ],
  },
  {
    id: 'acc-9',
    title: '2.9 Lineare Programmierung bei Engpässen',
    blocks: [
      { t: 'p', v: 'Bei mehreren Engpässen (z. B. zwei Maschinen) reicht die einfache Sortierung nach relativem DB nicht mehr aus. Das optimale Produktionsprogramm muss mit Linearer Programmierung bestimmt werden.' },
      { t: 'h3', v: 'Formulierung' },
      { t: 'formula', v: 'Maximiere: DB_1 · x_1 + DB_2 · x_2\nNebenbedingungen:\n  a_11 · x_1 + a_12 · x_2 ≤ K_1  (Engpass 1)\n  a_21 · x_1 + a_22 · x_2 ≤ K_2  (Engpass 2)\n  x_1, x_2 ≥ 0' },
      { t: 'p', v: 'Die optimale Lösung liegt immer in einem Eckpunkt (Basislösung) des zulässigen Bereichs (Simplexverfahren). Grafisch: Zeichne die Nebenbedingungen als Geraden, identifiziere das Polyeder der zulässigen Lösungen und verschiebe die Zielfunktionsgerade bis zum letzten Berührungspunkt.' },
      { t: 'h3', v: 'Schattenpreise (Dualpreise)' },
      { t: 'p', v: 'Der Schattenpreis eines Engpasses gibt an, um wie viel der optimale DB steigt, wenn der Engpass um eine Einheit gelockert wird. Er entspricht dem maximalen Preis, den man für eine zusätzliche Kapazitätseinheit zahlen sollte.' },
      { t: 'tip', v: 'Wenn eine Nebenbedingung nicht bindend ist (Schlupf > 0), ist ihr Schattenpreis = 0.' },
    ],
  },
]

// ─── DIGITALE UNTERNEHMUNG ────────────────────────────────────────────────────

const digitalArticles: Article[] = [
  {
    id: 'dig-1',
    title: '3.1 Virtuelle Organisation',
    blocks: [
      { t: 'p', v: 'Eine virtuelle Organisation ist ein zeitlich befristetes Netzwerk rechtlich selbständiger Unternehmen, die gemeinsam eine Marktleistung erbringen und dabei IKT-gestützt kooperieren, ohne eine formale Konzernstruktur zu bilden.' },
      { t: 'h3', v: 'Merkmale' },
      { t: 'ul', items: [
        'Keine physische Zentralstruktur – Kooperation über digitale Infrastruktur',
        'Fokus auf Kernkompetenzen der Partner',
        'Temporär und projektbezogen',
        'Vertrauen als Governancemechanismus (statt Hierarchie)',
        'Geographische Verteilung möglich',
      ]},
      { t: 'h3', v: 'Chancen und Risiken' },
      { t: 'table', cols: ['Chancen', 'Risiken'], rows: [
        ['Flexibilität, schnelle Marktbearbeitung', 'Koordinationsaufwand'],
        ['Zugang zu Kompetenzen ohne Aufbaukosten', 'Verlust von Know-how durch Auslagerung'],
        ['Skalierbarkeit', 'Abhängigkeit von Partnern'],
        ['Kosteneffizienz', 'Kulturelle Unterschiede, Vertrauensprobleme'],
      ]},
      { t: 'tip', v: 'Abzugrenzen von: (1) Virtuellen Teams innerhalb eines Unternehmens und (2) Outsourcing (dauerhafter Leistungsbezug von außen).' },
    ],
  },
  {
    id: 'dig-2',
    title: '3.2 Wissensmanagement & SECI-Modell',
    blocks: [
      { t: 'p', v: 'Das SECI-Modell (Nonaka & Takeuchi, 1995) beschreibt, wie Wissen in Organisationen entsteht und sich transformiert. Es unterscheidet explizites Wissen (artikulierbar, dokumentierbar) von implizitem Wissen (tacit knowledge, schwer transferierbar).' },
      { t: 'h3', v: 'Die vier SECI-Phasen' },
      { t: 'table', cols: ['Phase', 'Von → Nach', 'Prozess', 'Beispiel'], rows: [
        ['Sozialisation (S)', 'Implizit → Implizit', 'Gemeinsame Erfahrungen', 'Meister-Lehrling, Beobachtung'],
        ['Externalisierung (E)', 'Implizit → Explizit', 'Artikulation, Metaphern', 'Expertengespräch → Handbuch'],
        ['Kombination (C)', 'Explizit → Explizit', 'Verknüpfung von Dokumenten', 'Datenbanken, Reports'],
        ['Internalisierung (I)', 'Explizit → Implizit', 'Learning by doing', 'Training am Dokument'],
      ]},
      { t: 'p', v: 'Die Spirale dreht sich: durch wiederholte Durchläufe entsteht neues Wissen auf immer höherem Niveau (Knowledge Spiral).' },
      { t: 'tip', v: 'Enabling Conditions: Intention (Wissensziel), Autonomie, kreatives Chaos, Redundanz, requisite variety (Vielfalt im Team).' },
    ],
  },
  {
    id: 'dig-3',
    title: '3.3 Lead User Methode',
    blocks: [
      { t: 'p', v: 'Die Lead User Methode (von Hippel, 1986) nutzt fortschrittliche Nutzer als Innovationsquelle. Lead User erleben einen Bedarf Monate oder Jahre vor dem Massenmarkt und haben einen starken Anreiz, selbst Lösungen zu entwickeln.' },
      { t: 'h3', v: 'Merkmale von Lead Usern' },
      { t: 'ul', items: [
        'Frühzeitige Konfrontation mit künftigen Marktbedürfnissen',
        'Hoher Leidensdruck und Innovationsmotivation',
        'Eigene (Proto-)Lösungen vorhanden',
        'Übertragbarkeit ihrer Bedürfnisse auf den Massenmarkt',
      ]},
      { t: 'h3', v: 'Prozess der Lead User Methode' },
      { t: 'ul', items: [
        '1. Trend- und Bedarfsanalyse: relevante Trends im Zielmarkt und in analogen Märkten identifizieren',
        '2. Lead User Identifikation: Screening über Netzwerke, Fachforen, Experten',
        '3. Workshop mit Lead Usern: gemeinsame Konzeptentwicklung',
        '4. Markttest der entwickelten Konzepte',
      ]},
      { t: 'tip', v: 'Lead User unterscheiden sich von Durchschnittsnutzern in Intensität des Bedarfs und Innovationsbereitschaft. Sie sind keine "Wunschzettel-User", sondern bereits prototypisch aktiv.' },
    ],
  },
  {
    id: 'dig-4',
    title: '3.4 Process Mining',
    blocks: [
      { t: 'p', v: 'Process Mining extrahiert Prozesswissen aus den Event-Logs von IT-Systemen (ERP, CRM) und rekonstruiert daraus tatsächlich gelebte Prozessabläufe — unabhängig davon, wie sie dokumentiert sind.' },
      { t: 'h3', v: 'Arten von Process Mining' },
      { t: 'table', cols: ['Art', 'Ziel'], rows: [
        ['Process Discovery', 'Prozessmodell (z. B. Petri-Net) aus Event-Log ableiten'],
        ['Conformance Checking', 'Abweichungen zwischen Ist-Prozess und Soll-Modell aufdecken'],
        ['Enhancement / Extension', 'Soll-Modell mit Ist-Daten anreichern (Zeitstempel, Kosten)'],
      ]},
      { t: 'h3', v: 'Event Log Struktur' },
      { t: 'p', v: 'Ein Event Log enthält mindestens: Case ID (Prozessinstanz), Activity (Aktivitätsbezeichnung) und Timestamp. Zusätzliche Attribute wie Ressource, Kosten oder Ergebnis reichern die Analyse an.' },
      { t: 'tip', v: 'Process Mining deckt typische Probleme auf: Rework-Schleifen, Bottlenecks, ungeplante Aktivitäten (Spaghetti-Prozesse) und Policy-Verletzungen (z. B. Four-Eyes-Prinzip umgangen).' },
    ],
  },
  {
    id: 'dig-5',
    title: '3.5 Big Data & Econometrics',
    blocks: [
      { t: 'p', v: 'Big Data bezeichnet Datensätze, die durch die 5 V charakterisiert sind: Volume (Menge), Velocity (Geschwindigkeit), Variety (Vielfalt), Veracity (Verlässlichkeit) und Value.' },
      { t: 'h3', v: 'Kausalität vs. Korrelation' },
      { t: 'p', v: 'Ein zentrales Problem bei Big-Data-Analysen: Korrelation impliziert keine Kausalität. Um kausale Zusammenhänge zu identifizieren, sind randomisierte Experimente (A/B-Tests) oder ökonometrische Methoden (Instrumental Variables, Difference-in-Differences, Regression Discontinuity) nötig.' },
      { t: 'h3', v: 'Omitted Variable Bias (OVB)' },
      { t: 'formula', v: 'OVB = β_omitted × Corr(X, Z)' },
      { t: 'p', v: 'Wenn eine relevante Variable Z aus der Regression weggelassen wird und mit der eingeschlossenen Variablen X korreliert, ist der geschätzte Koeffizient von X verzerrt.' },
      { t: 'h3', v: 'Machine Learning vs. Econometrics' },
      { t: 'table', cols: ['Kriterium', 'ML', 'Econometrics'], rows: [
        ['Ziel', 'Prediction (Vorhersage)', 'Inference (Kausalität)'],
        ['Modellwahl', 'Datengetrieben, komplex', 'Theoriemotiviert'],
        ['Interpretation', 'Black Box (oft)', 'Transparente Koeffizienten'],
        ['Overfitting', 'Cross-Validation', 'Formelle Tests'],
      ]},
      { t: 'tip', v: 'Causal ML (Double ML, Causal Forests) versucht, ML-Flexibilität mit kausaler Inferenz zu kombinieren — wichtiges Feld in der aktuellen Forschung.' },
    ],
  },
  {
    id: 'dig-6',
    title: '3.6 Netzwerkeffekte & Plattformökonomik',
    blocks: [
      { t: 'p', v: 'Plattformen verbinden zwei oder mehr Nutzergruppen und schaffen Wert durch die Vermittlung von Transaktionen. Ihr zentrales Merkmal sind Netzwerkeffekte.' },
      { t: 'h3', v: 'Netzwerkeffekte' },
      { t: 'ul', items: [
        'Direkte (Same-Side) Netzwerkeffekte: Nutzen eines Nutzers steigt mit Anzahl der Nutzer auf der gleichen Seite (z. B. Telefonieren)',
        'Indirekte (Cross-Side) Netzwerkeffekte: Nutzen einer Seite steigt mit Anzahl der Nutzer auf der anderen Seite (z. B. mehr App-Entwickler → mehr Smartphone-Käufer)',
        'Negative Same-Side-Effekte: möglich (z. B. mehr Verkäufer → mehr Konkurrenz für Verkäufer)',
      ]},
      { t: 'h3', v: 'Winner-Take-All / Tipping' },
      { t: 'p', v: 'Starke Netzwerkeffekte führen zu Konzentration auf ein oder wenige Plattformen (Tipping Point). Multihoming (gleichzeitige Nutzung mehrerer Plattformen) und Differenzierung verhindern vollständige Monopolisierung.' },
      { t: 'h3', v: 'Chicken-and-Egg Problem' },
      { t: 'p', v: 'Plattformen müssen beide Seiten gleichzeitig gewinnen. Strategien: einer Seite subventionieren (z. B. kostenlose Nutzung für Konsumenten, Erlöse über Anbieter), Single-User Utility schaffen, Penguin-Strategie (kritische Masse auf einer Seite zuerst).' },
      { t: 'tip', v: 'Für die Klausur relevant: Unterschied zwischen Produkt- und Plattformlogik — bei Plattformen ist Marktmacht stärker, da Netzwerkeffekte natürliche Eintrittsbarrieren schaffen.' },
    ],
  },
  {
    id: 'dig-7',
    title: '3.7 Datenschutz & IT-Sicherheit',
    blocks: [
      { t: 'p', v: 'Datenschutz und IT-Sicherheit sind zentrale Compliance-Themen für digitale Unternehmen. Die DSGVO (EU 2016/679) definiert europäischen Rechtsrahmen.' },
      { t: 'h3', v: 'DSGVO Grundprinzipien' },
      { t: 'ul', items: [
        'Rechtmäßigkeit, Verarbeitung nach Treu und Glauben, Transparenz',
        'Zweckbindung: Daten nur für festgelegte Zwecke',
        'Datensparsamkeit (Datenminimierung)',
        'Richtigkeit',
        'Speicherbegrenzung',
        'Integrität und Vertraulichkeit',
        'Rechenschaftspflicht (Accountability)',
      ]},
      { t: 'h3', v: 'IT-Sicherheitsziele (CIA-Triad)' },
      { t: 'table', cols: ['Ziel', 'Beschreibung', 'Maßnahmen'], rows: [
        ['Confidentiality', 'Nur Befugte haben Zugang zu Daten', 'Verschlüsselung, Zugriffskontrollen'],
        ['Integrity', 'Daten dürfen nicht unautorisiert verändert werden', 'Hashwerte, Signaturen, Audit Logs'],
        ['Availability', 'Systeme müssen verfügbar sein', 'Redundanz, Backups, DDoS-Schutz'],
      ]},
      { t: 'tip', v: 'Privacy by Design bedeutet, Datenschutzanforderungen von Beginn der Systementwicklung an zu berücksichtigen — nicht nachträglich anzupassen.' },
    ],
  },
]

// ─── COMPETITION & STRATEGY ───────────────────────────────────────────────────

const strategyArticles: Article[] = [
  {
    id: 'str-1',
    title: '4.1 Porter\'s Five Forces',
    blocks: [
      { t: 'p', v: "Porter's Five Forces framework analyses the competitive intensity and profitability potential of an industry. The five forces determine the long-run industry average return on capital." },
      { t: 'table', cols: ['Force', 'Key Drivers'], rows: [
        ['Threat of New Entrants', 'Economies of scale, capital requirements, switching costs, brand identity, access to distribution, government policy'],
        ['Bargaining Power of Suppliers', 'Supplier concentration, switching costs, differentiation of inputs, forward integration threat'],
        ['Bargaining Power of Buyers', 'Buyer concentration, switching costs, price sensitivity, backward integration threat, product standardisation'],
        ['Threat of Substitutes', 'Relative price/performance of substitutes, switching costs, buyer propensity to substitute'],
        ['Rivalry Among Existing Firms', 'Industry growth, fixed costs, product differences, switching costs, exit barriers, number of competitors'],
      ]},
      { t: 'p', v: 'High profitability industries (e.g., pharmaceuticals, luxury goods) typically feature high entry barriers, low buyer/supplier power, few substitutes, and moderate rivalry.' },
      { t: 'tip', v: "Porter argues that strategy should position the firm where these forces are weakest, or change the industry structure. His framework is industry-level, not firm-level — the RBV (see 4.7) complements it by explaining firm-level heterogeneity." },
    ],
  },
  {
    id: 'str-2',
    title: '4.2 Oligopoly Models',
    blocks: [
      { t: 'p', v: 'When a market has few competitors, firms are interdependent. Classic models capture different strategic interactions.' },
      { t: 'table', cols: ['Model', 'Competition Variable', 'Outcome vs. Perfect Competition'], rows: [
        ['Cournot', 'Quantities (simultaneously)', 'Output between monopoly and PC; price above MC'],
        ['Bertrand', 'Prices (simultaneously, homogeneous)', 'Price = MC (competitive outcome!) — Bertrand paradox'],
        ['Stackelberg', 'Quantities (leader first)', 'Leader produces more than Cournot equilibrium; follower less'],
        ['Bertrand–Edgeworth', 'Prices with capacity constraints', 'Mixed strategy equilibrium; avoids paradox'],
      ]},
      { t: 'h3', v: 'Cournot Equilibrium (Duopoly)' },
      { t: 'formula', v: 'If P = a − b(q₁ + q₂) and MC = c:\nReaction function firm 1: q₁* = (a − c − b·q₂) / (2b)\nCournot–Nash: q₁ = q₂ = (a − c) / (3b)\nPrice = (a + 2c) / 3' },
      { t: 'tip', v: 'Bertrand with differentiated products yields prices above MC. Bertrand with capacity constraints (Edgeworth) produces no pure-strategy Nash equilibrium.' },
    ],
  },
  {
    id: 'str-3',
    title: '4.3 Game Theory',
    blocks: [
      { t: 'p', v: "Game theory analyses strategic interaction between rational players. A Nash Equilibrium (NE) is a profile of strategies where no player can improve by deviating unilaterally." },
      { t: 'h3', v: 'Prisoner\'s Dilemma' },
      { t: 'p', v: "The classic example: two firms decide whether to advertise. Mutual non-advertising maximises joint profit (cooperative outcome), but each firm has a dominant strategy to advertise, leading to a Pareto-inferior NE." },
      { t: 'h3', v: 'Dominant Strategy' },
      { t: 'p', v: 'A strictly dominant strategy yields a higher payoff regardless of what the opponent does. If a dominant strategy exists, rational players always choose it.' },
      { t: 'h3', v: 'Repeated Games and Collusion' },
      { t: 'p', v: 'In infinitely repeated games (or games with uncertain end), cooperation can be sustained through trigger strategies (e.g., Grim Trigger, Tit-for-Tat). The "Folk Theorem" shows any payoff above the minmax level can be sustained as a NE.' },
      { t: 'tip', v: 'Mixed strategy NE: a player randomises to make the opponent indifferent. In a 2×2 game, find the mix that makes the opponent\'s payoffs equal across both pure strategies.' },
    ],
  },
  {
    id: 'str-4',
    title: '4.4 Market Power & Entry Barriers',
    blocks: [
      { t: 'p', v: 'A firm has market power if it can profitably raise prices above marginal cost. The Lerner Index measures the degree of market power.' },
      { t: 'formula', v: 'Lerner Index L = (P − MC) / P = −1 / ε_d' },
      { t: 'p', v: 'where ε_d is the price elasticity of demand. L = 0 means perfect competition; L → 1 means near-monopoly.' },
      { t: 'h3', v: 'Entry Barriers' },
      { t: 'ul', items: [
        'Structural barriers: economies of scale, sunk costs, network effects, switching costs, absolute cost advantages',
        'Strategic barriers: limit pricing (set P below monopoly level to deter entry), predatory pricing (price below cost to drive out entrants), capacity pre-commitment',
      ]},
      { t: 'h3', v: 'Limit Pricing' },
      { t: 'p', v: 'Incumbent prices just below the entrant\'s break-even price to deter entry. Sustainable only if the incumbent has a genuine cost advantage, or if the threat is credible.' },
      { t: 'tip', v: 'Baumol\'s Contestable Markets: even a monopoly behaves competitively if entry and exit are costless (no sunk costs). The relevant barrier is sunk costs, not just entry costs.' },
    ],
  },
  {
    id: 'str-5',
    title: '4.5 Information Economics',
    blocks: [
      { t: 'p', v: 'Information asymmetry — where one party knows more than another — creates market failures. Two key problems: adverse selection (hidden information) and moral hazard (hidden action).' },
      { t: 'h3', v: 'Adverse Selection (Hidden Information)' },
      { t: 'p', v: 'Before contracting, the uninformed party cannot distinguish high from low quality. Akerlof\'s "Market for Lemons": buyers fear low quality, bid down prices, driving high-quality sellers out of the market. Solutions: signalling (informed party credibly reveals type) and screening (uninformed party designs a menu of contracts to separate types).' },
      { t: 'h3', v: 'Signalling (Spence)' },
      { t: 'p', v: 'A signal is credible only if it is costly to fake. Education as a signal: if the cost of acquiring a degree is lower for high-ability workers, only they will acquire it — separating equilibrium.' },
      { t: 'h3', v: 'Moral Hazard (Hidden Action)' },
      { t: 'p', v: 'After contracting, the agent may take unobservable actions (e.g., shirk). Solutions: monitoring, performance pay, efficiency wages (pay above market to raise the cost of being fired).' },
      { t: 'tip', v: 'Principal-Agent Theory: optimal contract trades off incentive provision (high powered pay) against risk-sharing (fixed salary). Risk-averse agents prefer low-powered pay; principals prefer high-powered.' },
    ],
  },
  {
    id: 'str-6',
    title: '4.6 Co-opetition',
    blocks: [
      { t: 'p', v: 'Co-opetition (Brandenburger & Nalebuff, 1996) describes simultaneous cooperation and competition between firms. The Value Net extends Porter\'s framework to include Complementors.' },
      { t: 'h3', v: 'The Value Net' },
      { t: 'ul', items: [
        'Customers: buy the product',
        'Suppliers: provide inputs',
        'Competitors: offer substitutes (reduce your value)',
        'Complementors: offer products/services that increase the value of yours (e.g., Intel and Microsoft; Visa and retailers)',
      ]},
      { t: 'p', v: 'A player is your complementor if customers value your product more when they also have the complementor\'s product, and suppliers are more attracted to your business when they also deal with the complementor.' },
      { t: 'h3', v: 'Strategic Implications' },
      { t: 'p', v: 'Expand the pie (co-operate to grow the market) and compete to divide the pie. Coopetition is common in standards setting (e.g., joint development of USB standard), joint R&D, and supply-chain collaboration.' },
      { t: 'tip', v: 'The PARTS framework: Players, Added Value, Rules, Tactics, Scope — each element can be changed to reshape the game in your favour.' },
    ],
  },
  {
    id: 'str-7',
    title: '4.7 Resource-Based View (RBV)',
    blocks: [
      { t: 'p', v: "The Resource-Based View (Barney, 1991; Penrose, 1959) explains sustained competitive advantage through heterogeneous, immobile firm resources and capabilities rather than industry structure (Porter)." },
      { t: 'h3', v: 'VRIN Framework' },
      { t: 'table', cols: ['Criterion', 'Description'], rows: [
        ['Valuable (V)', 'Resource enables the firm to exploit opportunities or neutralise threats'],
        ['Rare (R)', 'Not possessed by many current or potential competitors'],
        ['Inimitable (I)', 'Cannot be easily imitated (due to path dependence, causal ambiguity, social complexity)'],
        ['Non-substitutable (N)', 'No strategically equivalent substitute exists'],
      ]},
      { t: 'h3', v: 'Dynamic Capabilities' },
      { t: 'p', v: "Teece et al. (1997): in fast-changing environments, the ability to sense opportunities, seize them, and reconfigure resources matters more than any static resource stock. 'Dynamic capabilities' are the firm's capacity to purposefully create, extend, and modify its resource base." },
      { t: 'tip', v: "Barney's later update replaced 'Non-substitutable' with 'Organisation' (VRIO) — whether the firm is organised to capture the value of its resources (governance, processes, culture)." },
    ],
  },
]

// ─── PEOPLE & ORGANIZATION ────────────────────────────────────────────────────

const peopleArticles: Article[] = [
  {
    id: 'ppl-1',
    title: '5.1 Recruitment',
    blocks: [
      { t: 'p', v: 'Recruitment is the process of attracting a pool of qualified candidates for a position. Internal recruitment (promotions, transfers) and external recruitment (job boards, social media, headhunting) have different cost-quality trade-offs.' },
      { t: 'h3', v: 'Employer Branding' },
      { t: 'p', v: "The firm's reputation as an employer influences the quality and quantity of applicants. A strong employer brand reduces recruitment costs and attracts candidates whose values fit the organisation." },
      { t: 'h3', v: 'Recruitment Channels' },
      { t: 'table', cols: ['Channel', 'Best For', 'Drawback'], rows: [
        ['Internal postings', 'Known competencies, motivation', 'May create internal conflict'],
        ['Employee referrals', 'Cultural fit, fast', 'Homogeneity, in-group bias'],
        ['LinkedIn/job boards', 'Large reach', 'High volume, screening effort'],
        ['Executive search', 'Senior roles', 'Expensive'],
        ['Internship pipelines', 'Entry-level, cultural fit', 'Long lead time'],
      ]},
      { t: 'tip', v: 'Realistic Job Previews (RJP): sharing both positive and negative aspects of the job before hiring. Evidence shows RJPs reduce early turnover by managing expectations.' },
    ],
  },
  {
    id: 'ppl-2',
    title: '5.2 Selection Validity & Assessment',
    blocks: [
      { t: 'p', v: 'Selection is the process of choosing the best candidate. Two statistical properties matter: reliability (consistency of measurement) and validity (does it predict job performance?).' },
      { t: 'h3', v: 'Validity of Common Selection Methods (Schmidt & Hunter, 1998)' },
      { t: 'table', cols: ['Method', 'Validity (r)', 'Notes'], rows: [
        ['Work sample tests', '~0.54', 'High predictive validity'],
        ['Cognitive ability tests (GMA)', '~0.51', 'Best single predictor'],
        ['Structured interviews', '~0.51', 'Consistent, behavioural questions'],
        ['Unstructured interviews', '~0.38', 'Common but lower validity'],
        ['Assessment centres', '~0.37', 'Multi-exercise, multiple assessors'],
        ['Personality tests (Conscientiousness)', '~0.31', 'Big Five, especially C'],
        ['Years of experience', '~0.18', 'Weak predictor'],
        ['References', '~0.26', 'Inflated by social desirability'],
      ]},
      { t: 'h3', v: 'Assessment Centres' },
      { t: 'p', v: 'AC use multiple exercises (in-basket, role play, group discussion, presentation) assessed by multiple trained raters. They are expensive but have good construct validity and face validity.' },
      { t: 'tip', v: 'Incremental validity: combining GMA with structured interview adds predictive power beyond either alone. The combination is the gold standard for important positions.' },
    ],
  },
  {
    id: 'ppl-3',
    title: '5.3 Training & Development',
    blocks: [
      { t: 'p', v: 'Training improves skills for current job requirements; development focuses on future capabilities. Both are investments in human capital.' },
      { t: 'h3', v: 'Kirkpatrick\'s Four Levels of Evaluation' },
      { t: 'table', cols: ['Level', 'What is measured', 'Method'], rows: [
        ['1. Reaction', 'Trainee satisfaction', 'Post-training survey'],
        ['2. Learning', 'Knowledge/skill acquisition', 'Pre/post test'],
        ['3. Behaviour', 'Transfer to job performance', '360° feedback, supervisor ratings'],
        ['4. Results', 'Business impact (ROI)', 'KPIs, productivity, turnover data'],
      ]},
      { t: 'h3', v: 'Transfer of Training' },
      { t: 'p', v: 'Learning transfer is enhanced by: identical elements between training and job, general principles taught (not just procedures), practice with feedback, and supportive supervisors / climate for transfer.' },
      { t: 'tip', v: 'General (transferable) training raises worker productivity on the market → workers can negotiate higher wages elsewhere → firms may under-invest in general training (Becker 1964). Firm-specific training raises productivity only at the current firm → firm and worker share the investment.' },
    ],
  },
  {
    id: 'ppl-4',
    title: '5.4 Compensation & Incentives',
    blocks: [
      { t: 'p', v: 'Compensation systems must attract, retain, and motivate employees. The design trades off risk (variable pay is risky for employees) against incentives (fixed pay reduces effort).' },
      { t: 'h3', v: 'Pay-for-Performance' },
      { t: 'ul', items: [
        'Piece rates: pay per unit produced — strong incentive but ignores quality',
        'Profit sharing: aligns workers with firm performance — free-rider problem in large firms',
        'Stock options: link pay to share price — encourages excessive risk-taking; Black-Scholes value ≠ subjective value to risk-averse employee',
        'Tournament theory (Lazear & Rosen): relative pay (promotions) creates effort incentives across all levels',
      ]},
      { t: 'h3', v: 'Efficiency Wages' },
      { t: 'p', v: 'Paying above the market wage increases the cost of job loss, reducing shirking (Shapiro-Stiglitz). It also attracts higher-ability workers (adverse selection argument). Predicts involuntary unemployment.' },
      { t: 'tip', v: 'Multitasking problem (Holmström & Milgrom): when agents do multiple tasks, strong incentives on measurable tasks cause agents to neglect immeasurable ones. Solution: weaker incentives or measure and reward all tasks.' },
    ],
  },
  {
    id: 'ppl-5',
    title: '5.5 Motivation Theories',
    blocks: [
      { t: 'p', v: 'Motivation theories explain what drives employees to exert effort. They inform HR practices in job design, pay, and management.' },
      { t: 'h3', v: 'Content Theories' },
      { t: 'ul', items: [
        "Maslow's Hierarchy (1943): Physiological → Safety → Social → Esteem → Self-actualisation. Lower needs must be satisfied before higher-order needs motivate.",
        "Herzberg's Two-Factor Theory: Hygiene factors (pay, working conditions) prevent dissatisfaction but don't motivate. Motivators (recognition, responsibility, growth) drive satisfaction and effort.",
        "Alderfer's ERG: Existence, Relatedness, Growth — more flexible, regression is possible.",
      ]},
      { t: 'h3', v: 'Process Theories' },
      { t: 'ul', items: [
        "Vroom's Expectancy Theory: Motivation = Expectancy × Instrumentality × Valence. Expectancy: effort leads to performance; Instrumentality: performance leads to reward; Valence: value of reward.",
        "Adams' Equity Theory: employees compare their input/outcome ratio to a reference person. Perceived inequity causes tension and behavioural adjustment.",
        "Locke's Goal-Setting Theory: specific, challenging goals with feedback outperform vague 'do your best' goals.",
      ]},
      { t: 'tip', v: 'Intrinsic vs. extrinsic motivation: excessive external rewards can crowd out intrinsic motivation (overjustification effect, Deci & Ryan).' },
    ],
  },
  {
    id: 'ppl-6',
    title: '5.6 Job Design',
    blocks: [
      { t: 'p', v: "Hackman & Oldham's Job Characteristics Model (1976) identifies five core job dimensions that produce critical psychological states, which in turn drive positive work and personal outcomes." },
      { t: 'h3', v: 'Five Core Job Dimensions' },
      { t: 'table', cols: ['Dimension', 'Description', 'Psychological State'], rows: [
        ['Skill Variety', 'Range of skills required', 'Experienced Meaningfulness'],
        ['Task Identity', 'Completion of a whole, identifiable piece of work', 'Experienced Meaningfulness'],
        ['Task Significance', 'Impact of job on others', 'Experienced Meaningfulness'],
        ['Autonomy', 'Freedom and independence in scheduling and methods', 'Experienced Responsibility'],
        ['Feedback', 'Clear information about performance effectiveness', 'Knowledge of Results'],
      ]},
      { t: 'formula', v: 'MPS (Motivating Potential Score) = [(Skill Variety + Task Identity + Task Significance) / 3] × Autonomy × Feedback' },
      { t: 'tip', v: 'Job enlargement: horizontal expansion (more tasks at same level). Job enrichment: vertical expansion (more autonomy, responsibility). Enrichment is more motivating according to the model.' },
    ],
  },
  {
    id: 'ppl-7',
    title: '5.7 Internal vs. External Labour Markets',
    blocks: [
      { t: 'p', v: 'Firms can fill positions internally (promotions, transfers) or externally (hiring). Both have distinct advantages and information-related trade-offs.' },
      { t: 'table', cols: ['Dimension', 'Internal Hiring', 'External Hiring'], rows: [
        ['Information', 'Better info about candidate ability and fit', 'Unknown quality (adverse selection)'],
        ['Motivation', 'Signals promotion prospects, motivates incumbents', 'Brings fresh perspectives'],
        ['Cost', 'Lower search cost, but creates vacancy chains', 'Higher search/screening cost'],
        ['Flexibility', 'Limited to current employee pool', 'Can acquire scarce skills immediately'],
        ['Culture', 'Preserves culture', 'Risks culture disruption'],
      ]},
      { t: 'h3', v: 'Tournament Theory' },
      { t: 'p', v: "Lazear & Rosen (1981): promotion as a tournament where the winner gets a large pay jump. This provides strong incentives without requiring the firm to perfectly observe effort — relative performance is easier to observe than absolute output." },
      { t: 'tip', v: 'Promotion from within (ILM) creates rent: employees earn below-market pay early in career and above-market pay later, making voluntary departure costly and reducing shirking.' },
    ],
  },
  {
    id: 'ppl-8',
    title: '5.8 Leadership',
    blocks: [
      { t: 'p', v: 'Leadership research has evolved from trait theories to behavioural, situational, and more recently transformational/transactional models.' },
      { t: 'h3', v: 'Transformational vs. Transactional Leadership' },
      { t: 'table', cols: ['Dimension', 'Transformational', 'Transactional'], rows: [
        ['Mechanism', '4 Is: Idealised Influence, Inspirational Motivation, Intellectual Stimulation, Individualised Consideration', 'Contingent reward, MBE (active/passive)'],
        ['Focus', 'Long-term vision, change, intrinsic motivation', 'Short-term goals, compliance, extrinsic reward'],
        ['Follower effect', 'Exceeds expectations (extra effort)', 'Meets expectations'],
        ['When effective', 'Change, innovation, crisis', 'Stable, routine environments'],
      ]},
      { t: 'h3', v: 'Fiedler\'s Contingency Model' },
      { t: 'p', v: "Leadership effectiveness depends on the match between leader style (task-oriented LPC vs. relationship-oriented LPC) and situational favorability (leader-member relations, task structure, position power). Task-oriented leaders excel in very high and very low favorability; relationship-oriented leaders excel in moderate favorability." },
      { t: 'tip', v: 'Authentic leadership and servant leadership are recent additions to leadership theory. Both emphasise self-awareness, integrity, and follower development over personal power.' },
    ],
  },
  {
    id: 'ppl-9',
    title: '5.9 Gender, Diversity & Bias',
    blocks: [
      { t: 'p', v: 'Despite advances, gender pay gaps and glass ceilings persist across industries. Understanding biases and structural factors is important for equitable HR practice.' },
      { t: 'h3', v: 'Sources of Gender Pay Gap' },
      { t: 'ul', items: [
        'Occupational segregation: women disproportionately in lower-paid occupations',
        'Industry segregation: underrepresentation in high-paying sectors',
        'Negotiation gap: women negotiate less aggressively (social penalties)',
        'Motherhood penalty vs. fatherhood bonus',
        'Implicit bias in performance evaluations and promotion decisions',
      ]},
      { t: 'h3', v: 'Implicit Association Test (IAT)' },
      { t: 'p', v: 'The IAT measures the strength of automatic associations between concepts (e.g., women–family; men–career). Even people with egalitarian explicit attitudes show implicit biases that influence judgements.' },
      { t: 'tip', v: 'Structured processes, blind screening, diverse interview panels, and objective criteria reduce the influence of implicit bias in hiring and promotion decisions.' },
    ],
  },
  {
    id: 'ppl-10',
    title: '5.10 Work Teams',
    blocks: [
      { t: 'p', v: 'Teams outperform individuals on complex, interdependent tasks. But teams also face coordination losses (process losses) and social loafing.' },
      { t: 'h3', v: 'Team Effectiveness Model (Hackman)' },
      { t: 'ul', items: [
        'Conditions for effectiveness: real team (bounded, stable), compelling direction, enabling structure (norms, diversity, size), supportive organisation (rewards, coaching), expert team coaching',
        'Process gains: synergy, creative combination of perspectives',
        'Process losses: coordination costs, social loafing, groupthink',
      ]},
      { t: 'h3', v: 'Groupthink (Janis)' },
      { t: 'p', v: "Cohesive groups may suppress dissent and develop illusions of invulnerability, leading to poor decisions. Symptoms: illusion of unanimity, self-censorship, stereotyping out-groups." },
      { t: 'h3', v: 'Tuckman\'s Stages' },
      { t: 'ul', items: ['Forming → Storming → Norming → Performing → (Adjourning)'] },
      { t: 'tip', v: 'Optimal team size: 5–7 members for most tasks. Larger teams increase coordination costs faster than productivity gains. Amazon\'s "two-pizza rule" captures this.' },
    ],
  },
]

// ─── INTERNATIONAL MANAGEMENT ─────────────────────────────────────────────────

const internationalArticles: Article[] = [
  {
    id: 'int-1',
    title: '6.1 International Trade Theory',
    blocks: [
      { t: 'p', v: 'Trade theory explains why countries trade and what determines the pattern of specialisation.' },
      { t: 'h3', v: 'Key Theories' },
      { t: 'table', cols: ['Theory', 'Key Idea'], rows: [
        ['Absolute Advantage (Smith)', 'Countries export what they produce at lower absolute cost'],
        ['Comparative Advantage (Ricardo)', 'Countries gain from specialising in goods with lower opportunity cost, even if absolutely less efficient at everything'],
        ['Heckscher-Ohlin (H-O)', 'Countries export goods intensive in their abundant factor (capital-rich → capital-intensive exports)'],
        ["Leontief Paradox", 'Empirical finding: the US (capital-rich) exported labour-intensive goods — challenges H-O'],
        ["Porter's Diamond", 'National competitive advantage from: Factor conditions, Demand conditions, Related industries, Firm strategy/rivalry'],
      ]},
      { t: 'h3', v: 'New Trade Theory (Krugman)' },
      { t: 'p', v: 'With economies of scale and product differentiation, countries may specialise in varieties of a product even without factor endowment differences. Trade in similar goods between similar countries (intra-industry trade) is explained.' },
      { t: 'tip', v: "Porter's Diamond: government is an external influence (not one of the four determinants). Random chance is the fifth factor in some versions." },
    ],
  },
  {
    id: 'int-2',
    title: '6.2 Entry Mode Strategies',
    blocks: [
      { t: 'p', v: 'When entering a foreign market, firms choose from a spectrum of modes that differ in control, resource commitment, and risk.' },
      { t: 'table', cols: ['Mode', 'Control', 'Resource Commitment', 'Example'], rows: [
        ['Exporting (indirect)', 'Low', 'Low', 'Via trading company'],
        ['Exporting (direct)', 'Moderate', 'Low-Medium', 'Own sales subsidiary'],
        ['Licensing', 'Low', 'Very Low', 'IP license to local firm'],
        ['Franchising', 'Low-Medium', 'Low', 'McDonald\'s'],
        ['Joint Venture (JV)', 'Shared', 'Medium-High', '50/50 with local partner'],
        ['Wholly Owned Subsidiary (WOS)', 'Full', 'High', 'Greenfield or acquisition'],
      ]},
      { t: 'h3', v: 'Factors Influencing Mode Choice' },
      { t: 'ul', items: [
        'Transaction costs: market imperfections (IP protection, opportunism) push towards internalisation',
        'Country risk and cultural distance favour lower-commitment modes',
        'Need for local responsiveness favours JV or WOS',
        'Speed of entry favours acquisition over greenfield',
      ]},
      { t: 'tip', v: "Licensing risks: the licensee may become a future competitor or may not maintain quality. Strong IP regimes make licensing less risky." },
    ],
  },
  {
    id: 'int-3',
    title: '6.3 Integration-Responsiveness (I-R) Framework',
    blocks: [
      { t: 'p', v: 'The I-R framework (Prahalad & Doz, 1987) maps the dual pressures firms face: global integration (efficiency through standardisation) vs. local responsiveness (adapting to local markets).' },
      { t: 'table', cols: ['Strategy', 'Integration', 'Responsiveness', 'Example'], rows: [
        ['Global', 'High', 'Low', 'Intel, Boeing — standardised products'],
        ['Multi-domestic', 'Low', 'High', 'Nestlé (local food tastes), Unilever local brands'],
        ['Transnational', 'High', 'High', 'P&G — global scale + local adaptation'],
        ['International', 'Low', 'Low', 'Mature, simple products exported cheaply'],
      ]},
      { t: 'p', v: "Bartlett & Ghoshal's transnational solution: build a differentiated network that simultaneously achieves efficiency, responsiveness, and worldwide learning." },
      { t: 'tip', v: 'Drivers of global integration: scale economies, uniform customer needs, competition from global rivals. Drivers of local responsiveness: taste differences, local regulations, distribution infrastructure.' },
    ],
  },
  {
    id: 'int-4',
    title: '6.4 Foreign Exchange Risk',
    blocks: [
      { t: 'p', v: 'FX risk arises when a firm\'s cash flows, assets, or liabilities are denominated in a foreign currency.' },
      { t: 'h3', v: 'Types of FX Exposure' },
      { t: 'table', cols: ['Type', 'Definition', 'Hedging Tool'], rows: [
        ['Transaction Exposure', 'Risk of exchange rate change between deal date and settlement', 'Forward contracts, FX options'],
        ['Translation Exposure', 'Accounting risk when consolidating foreign subsidiary financials', 'Balance-sheet hedging'],
        ['Economic (Operating) Exposure', 'Long-run impact on firm value from structural competitive effects', 'Operational hedging (production relocation), currency matching'],
      ]},
      { t: 'h3', v: 'Purchasing Power Parity (PPP)' },
      { t: 'formula', v: 'E[S_T] / S_0 = (1 + i_d) / (1 + i_f)' },
      { t: 'p', v: 'PPP predicts that exchange rates adjust to offset inflation differentials in the long run. Interest Rate Parity (IRP) links interest rate differentials to expected exchange rate changes (covered IRP is arbitrage-free).' },
      { t: 'tip', v: 'Natural hedging: match currency of revenues with currency of costs (e.g., produce in the same country where you sell). Reduces the need for financial hedges.' },
    ],
  },
  {
    id: 'int-5',
    title: '6.5 Hofstede\'s Cultural Dimensions',
    blocks: [
      { t: 'p', v: "Hofstede (1980, 2001) identified cultural dimensions based on IBM employee surveys across 50+ countries. They predict differences in management practices, communication, and organisational structures." },
      { t: 'table', cols: ['Dimension', 'Low', 'High', 'Example (High)'], rows: [
        ['Power Distance (PDI)', 'Flat hierarchies, participation', 'Autocratic, subordinates defer to superiors', 'Malaysia, Philippines'],
        ['Individualism vs. Collectivism (IDV)', 'Group loyalty, in-group preference', 'Personal achievement, individual rights', 'USA, Australia'],
        ['Masculinity vs. Femininity (MAS)', 'Cooperation, quality of life', 'Competition, performance, assertiveness', 'Japan, Austria'],
        ['Uncertainty Avoidance (UAI)', 'Flexible, tolerates ambiguity', 'Rigid rules, low risk tolerance', 'Greece, Japan'],
        ['Long-Term Orientation (LTO)', 'Tradition, quick results', 'Perseverance, future focus', 'China, Japan'],
        ['Indulgence vs. Restraint (IVR)', 'Strict social norms', 'Freedom, enjoy life', 'Mexico, Sweden'],
      ]},
      { t: 'tip', v: "Criticism: Hofstede's data is from one company (IBM) in the 1970s; cultures change over time; within-country variance may exceed between-country variance. GLOBE study (House et al., 2004) is a more recent alternative with 9 dimensions." },
    ],
  },
  {
    id: 'int-6',
    title: '6.6 Political Risk',
    blocks: [
      { t: 'p', v: 'Political risk refers to the possibility that government actions, political instability, or civil unrest will impair a firm\'s operations or returns in a foreign country.' },
      { t: 'h3', v: 'Types of Political Risk' },
      { t: 'ul', items: [
        'Expropriation / nationalisation: government seizes assets (may be compensated or not)',
        'Regulatory change: new taxes, tariffs, local content requirements',
        'Currency inconvertibility: inability to repatriate profits',
        'Political instability: coups, civil wars, terrorism',
        'Corruption: bribery requirements (FCPA/UK Bribery Act compliance)',
      ]},
      { t: 'h3', v: 'Mitigation Strategies' },
      { t: 'ul', items: [
        'Political risk insurance (e.g., MIGA, private insurers)',
        'Local partnerships (JV with politically connected partner)',
        'Transfer pricing and thin capitalisation to reduce in-country assets',
        'Build local legitimacy (employment, CSR)',
        'Contractual protections (international arbitration clauses)',
      ]},
      { t: 'tip', v: 'Bilateral Investment Treaties (BITs) provide some legal protection against expropriation without compensation and grant access to international arbitration.' },
    ],
  },
  {
    id: 'int-7',
    title: '6.7 Internationalisation Theories',
    blocks: [
      { t: 'p', v: 'Several theories explain why and how firms internationalise.' },
      { t: 'h3', v: 'Uppsala Model (Johanson & Vahlne, 1977)' },
      { t: 'p', v: 'Firms internationalise incrementally: first exporting to psychically close markets, then establishing sales subsidiaries, then production. They accumulate experiential knowledge before increasing commitment.' },
      { t: 'h3', v: "Dunning's Eclectic Paradigm (OLI)" },
      { t: 'table', cols: ['Factor', 'Description', 'Implication'], rows: [
        ['Ownership (O)', 'Firm-specific advantages: brand, technology, management', 'Necessary to overcome foreigner disadvantage'],
        ['Location (L)', 'Country-specific advantages: resources, market size, labour cost', 'Determines where to invest'],
        ['Internalisation (I)', 'Benefits of owning vs. licensing: property rights, quality control', 'Determines how to enter (FDI vs. licensing)'],
      ]},
      { t: 'p', v: 'FDI occurs when a firm has O and I advantages and there is a L advantage in the foreign country. If only O exists, license. If O and L but not I, export.' },
      { t: 'h3', v: 'Transaction Cost Theory (Buckley & Casson)' },
      { t: 'p', v: 'MNCs exist because internalising cross-border transactions is cheaper than using markets, due to knowledge externalities, opportunism, and asset specificity.' },
      { t: 'tip', v: 'Born globals (Oviatt & McDougall, 1994): some firms, particularly technology startups, internationalise from inception, challenging the Uppsala incremental model.' },
    ],
  },
]

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const LERNHEFT: SubjectLernheft[] = [
  { subject: 'risk', articles: riskArticles },
  { subject: 'accounting', articles: accountingArticles },
  { subject: 'digital', articles: digitalArticles },
  { subject: 'strategy', articles: strategyArticles },
  { subject: 'people', articles: peopleArticles },
  { subject: 'international', articles: internationalArticles },
]
