import fs from 'fs'

function buildSummary() {
  const src = 'kcet_cutoffs_consolidated.json'
  if (!fs.existsSync(src)) {
    console.error('Missing consolidated file:', src)
    process.exit(1)
  }
  const raw = JSON.parse(fs.readFileSync(src, 'utf8'))
  const arr = Array.isArray(raw) ? raw : (raw.cutoffs || [])
  const meta = Array.isArray(raw) ? {} : (raw.metadata || {})

  const years = {}
  const categories = {}
  const collegeSet = new Set()
  const branchSet = new Set()

  for (const r of arr) {
    const y = (r.year || '').toString()
    if (y) years[y] = (years[y] || 0) + 1
    const c = (r.category || '').toString()
    if (c) categories[c] = (categories[c] || 0) + 1
    if (r.institute_code) collegeSet.add(r.institute_code)
    if (r.course) branchSet.add(r.course)
  }

  const out = {
    metadata: {
      last_updated: meta.last_updated || new Date().toISOString(),
      source: 'kcet_cutoffs_consolidated.json'
    },
    totals: {
      records: arr.length,
      colleges: collegeSet.size,
      branches: branchSet.size,
      years: Object.keys(years).length
    },
    years,
    categories
  }

  const outPath = 'public/data/cutoffs-summary.json'
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
  console.log('Wrote summary to', outPath)
}

buildSummary()


