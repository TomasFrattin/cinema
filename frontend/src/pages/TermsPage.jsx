import termsContent from '../content/terms-and-conditions.md?raw'

function TermsPage() {
  const [title, ...bodyLines] = termsContent.trim().split(/\r?\n/)
  const body = bodyLines
    .join('\n')
    .trim()
    .replace(/\s+(?=\d+(?:\.\d+)*\.-|\d+-)\s*/g, '\n\n')

  return (
    <main className="terms-page">
      <p className="eyebrow">INFORMACIÓN LEGAL</p>
      <h1>{title}</h1>
      <article className="terms-document">{body}</article>
    </main>
  )
}

export default TermsPage