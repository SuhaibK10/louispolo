'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/admin/media/page.tsx
// Internal Cloudflare Images browser — see every uploaded image, which
// product/color it belongs to, filter/search across them, copy delivery
// links (single or in bulk), and bulk-upload new files straight to
// Cloudflare. No delete yet — that's a separate follow-up if needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import JSZip from 'jszip'
import { adminThumbUrl, publicUrl } from '@/lib/cloudflareImages'
import { adminLogout } from '@/app/admin/actions'

interface ImageRef {
  productName: string
  productSlug: string
  category:    string
  color?:      string
}

interface AdminImage {
  id:       string
  filename: string
  uploaded: string
  usedBy:   ImageRef[]
}

const CATEGORY_LABELS: Record<string, string> = {
  trolley:      'Trolleys',
  set:          'Sets',
  backpack:     'Backpacks',
  'office-bag': 'Office Bags',
  vanity:       'Vanity Cases',
  kids:         'Kids',
  duffle:       'Duffle Bags',
  overnighter:  'Overnighters',
  organizer:    'Organizers',
}

export default function AdminMediaPage() {
  const [images, setImages]     = useState<AdminImage[] | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState<string>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [copied, setCopied]     = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadNote, setUploadNote] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<{ done: number; total: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function loadImages() {
    fetch('/api/admin/images')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setImages(data.images)
      })
      .catch(() => setError('Failed to load images'))
  }

  useEffect(loadImages, [])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const img of images ?? []) {
      if (img.usedBy.length === 0) {
        counts.set('unused', (counts.get('unused') ?? 0) + 1)
        continue
      }
      for (const ref of img.usedBy) {
        counts.set(ref.category, (counts.get(ref.category) ?? 0) + 1)
      }
    }
    return counts
  }, [images])

  const filtered = useMemo(() => {
    if (!images) return []
    const q = query.trim().toLowerCase()
    return images.filter((img) => {
      const matchesCategory =
        category === 'all' ||
        (category === 'unused' ? img.usedBy.length === 0 : img.usedBy.some((r) => r.category === category))
      if (!matchesCategory) return false
      if (!q) return true
      return (
        img.filename.toLowerCase().includes(q) ||
        img.id.toLowerCase().includes(q) ||
        img.usedBy.some((r) => r.productName.toLowerCase().includes(q))
      )
    })
  }, [images, query, category])

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAllFiltered() {
    setSelected(new Set(filtered.map((img) => img.id)))
  }

  function clearSelection() {
    setSelected(new Set())
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can silently fail depending on browser permissions —
      // the textarea below still shows the text either way, so it's never
      // a dead end, just a manual select-all/copy instead of automatic.
    }
    setCopiedText(text)
  }

  function copySingleLink(id: string) {
    copyToClipboard(publicUrl(id))
  }

  function copySelectedLinks() {
    const links = [...selected].map((id) => publicUrl(id)).join('\n')
    copyToClipboard(links)
  }

  // Pull the full-resolution "public" variant as a blob and save it — a plain
  // <a href download> is ignored cross-origin by the browser (it would just
  // open the image in a tab instead of saving it), so the file has to come
  // down as a blob first.
  async function fetchImageBlob(id: string): Promise<Blob> {
    const res = await fetch(publicUrl(id))
    if (!res.ok) throw new Error(`Failed to fetch ${id}`)
    return res.blob()
  }

  function triggerBlobDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  async function downloadSingle(img: AdminImage) {
    try {
      const blob = await fetchImageBlob(img.id)
      triggerBlobDownload(blob, img.filename || img.id)
    } catch {
      setUploadNote(`Couldn't download ${img.filename || img.id}.`)
    }
  }

  // Bulk download bundles everything selected into one .zip instead of
  // firing off N separate downloads, which browsers throttle/block past a
  // handful of simultaneous saves.
  async function downloadSelected() {
    const targets = filtered.filter((img) => selected.has(img.id))
    if (targets.length === 0) return
    setDownloading(true)
    setDownloadProgress({ done: 0, total: targets.length })

    try {
      const zip = new JSZip()
      const usedNames = new Set<string>()
      for (const img of targets) {
        const blob = await fetchImageBlob(img.id)
        let name = img.filename || img.id
        if (usedNames.has(name)) name = `${img.id}-${name}`
        usedNames.add(name)
        zip.file(name, blob)
        setDownloadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev))
      }
      const content = await zip.generateAsync({ type: 'blob' })
      triggerBlobDownload(content, `louispolo-media-${targets.length}.zip`)
    } catch {
      setUploadNote('Some images failed to download — try again or download individually.')
    } finally {
      setDownloading(false)
      setDownloadProgress(null)
    }
  }

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    setUploadNote(null)

    const formData = new FormData()
    for (const file of Array.from(fileList)) {
      formData.append('files', file)
    }

    try {
      const res = await fetch('/api/admin/images/upload', { method: 'POST', body: formData })
      const data = await res.json()
      const succeeded: string[] = (data.results ?? []).filter((r: { id?: string }) => r.id).map((r: { id: string }) => r.id)
      const failed = (data.results ?? []).filter((r: { error?: string }) => r.error)

      setUploadNote(
        `Uploaded ${succeeded.length} of ${fileList.length}.` +
        (failed.length ? ` ${failed.length} failed.` : '')
      )
      loadImages()
      // Auto-select the newly uploaded images so "Copy N links" is one click away.
      setSelected(new Set(succeeded))
    } catch {
      setUploadNote('Upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F0]">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h1 className="font-semibold text-lg text-[#1C1B19]">Louis Polo Media Library</h1>
          <div className="flex items-center gap-3">
            <a href="/admin/orders" className="text-xs text-gray-500 hover:text-[#1C1B19] underline">
              Orders
            </a>
            <form action={adminLogout}>
              <button type="submit" className="text-xs text-gray-500 hover:text-[#1C1B19] underline">
                Log out
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <input
            type="search"
            placeholder="Search by filename, image ID, or product name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-[200px] max-w-md border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#B99A62]"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
            id="bulk-upload-input"
          />
          <label
            htmlFor="bulk-upload-input"
            className="cursor-pointer bg-[#1C1B19] text-white rounded-md px-3 py-1.5 text-xs font-medium hover:opacity-90"
          >
            {uploading ? 'Uploading…' : 'Upload images'}
          </label>
          {uploadNote && <span className="text-xs text-gray-500">{uploadNote}</span>}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <FilterTab label={`All (${images?.length ?? 0})`} active={category === 'all'} onClick={() => setCategory('all')} />
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => {
            const count = categoryCounts.get(value) ?? 0
            if (count === 0) return null
            return (
              <FilterTab key={value} label={`${label} (${count})`} active={category === value} onClick={() => setCategory(value)} />
            )
          })}
          {(categoryCounts.get('unused') ?? 0) > 0 && (
            <FilterTab
              label={`Unused (${categoryCounts.get('unused')})`}
              active={category === 'unused'}
              onClick={() => setCategory('unused')}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={selectAllFiltered} className="text-xs text-gray-500 hover:text-[#1C1B19] underline">
            Select all shown ({filtered.length})
          </button>
          {selected.size > 0 && (
            <>
              <button type="button" onClick={clearSelection} className="text-xs text-gray-500 hover:text-[#1C1B19] underline">
                Clear selection
              </button>
              <button
                type="button"
                onClick={copySelectedLinks}
                className="bg-gray-100 text-[#1C1B19] rounded-md px-3 py-1 text-xs font-medium hover:bg-gray-200"
              >
                Copy {selected.size} link{selected.size === 1 ? '' : 's'}
              </button>
              <button
                type="button"
                onClick={downloadSelected}
                disabled={downloading}
                className="bg-[#1C1B19] text-white rounded-md px-3 py-1 text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                {downloading && downloadProgress
                  ? `Zipping ${downloadProgress.done}/${downloadProgress.total}…`
                  : `Download ${selected.size} as .zip`}
              </button>
            </>
          )}
          {copied && <span className="text-xs text-green-600">Copied</span>}
        </div>

        {copiedText && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              <span>
                Last copied ({copiedText.split('\n').length} link{copiedText.split('\n').length === 1 ? '' : 's'}) — select all and copy manually if the automatic copy didn't work:
              </span>
              <button type="button" onClick={() => setCopiedText(null)} className="text-gray-500 hover:text-[#1C1B19] underline shrink-0">
                Clear
              </button>
            </p>
            <textarea
              readOnly
              value={copiedText}
              onFocus={(e) => e.target.select()}
              rows={Math.min(6, copiedText.split('\n').length)}
              className="w-full max-w-lg border border-gray-300 rounded-md px-3 py-2 text-xs font-mono outline-none focus:border-[#B99A62]"
            />
          </div>
        )}
      </div>

      <div className="p-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!images && !error && <p className="text-sm text-gray-500">Loading images…</p>}
        {images && filtered.length === 0 && <p className="text-sm text-gray-500">No images match.</p>}

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {filtered.map((img) => {
            const isSelected = selected.has(img.id)
            return (
              <div
                key={img.id}
                className={`bg-white rounded-md border overflow-hidden ${isSelected ? 'border-[#B99A62] ring-1 ring-[#B99A62]' : 'border-gray-200'}`}
              >
                <div className="relative w-full aspect-square bg-gray-50">
                  <Image src={adminThumbUrl(img.id)} alt={img.filename} fill className="object-contain" unoptimized />
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelected(img.id)}
                    className="absolute top-2 left-2 w-4 h-4"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => downloadSingle(img)}
                      title="Download full-resolution original"
                      className="bg-white/90 rounded-md px-2 py-1 text-[0.62rem] font-medium text-[#1C1B19] border border-gray-200 hover:bg-white"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => copySingleLink(img.id)}
                      className="bg-white/90 rounded-md px-2 py-1 text-[0.62rem] font-medium text-[#1C1B19] border border-gray-200 hover:bg-white"
                    >
                      Copy link
                    </button>
                  </div>
                </div>
                <div className="p-2 space-y-0.5">
                  {img.usedBy.length > 0 ? (
                    img.usedBy.map((ref, i) => (
                      <p key={i} className="text-[0.7rem] text-[#1C1B19] leading-tight truncate">
                        {ref.productName}{ref.color ? ` · ${ref.color}` : ''}
                      </p>
                    ))
                  ) : (
                    <p className="text-[0.7rem] text-red-500 leading-tight">Not used by any product</p>
                  )}
                  <p className="text-[0.62rem] text-gray-400 truncate" title={img.id}>{img.id}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active ? 'bg-[#1C1B19] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}
