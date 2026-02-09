const BASE_URL = ''

export async function generateMusic({
  prompt,
  customMode,
  instrumental,
  model,
  style,
  title,
  vocalGender,
  negativeTags,
}) {
  const body = { prompt, customMode, instrumental, model }

  if (customMode) {
    if (style) body.style = style
    if (title) body.title = title
    if (vocalGender) body.vocalGender = vocalGender
  }
  if (negativeTags) body.negativeTags = negativeTags

  const res = await fetch(`${BASE_URL}/webhook/dala-music-generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Generation failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function checkTaskStatus(taskId) {
  const res = await fetch(
    `${BASE_URL}/webhook/dala-music-status?taskId=${encodeURIComponent(taskId)}`
  )

  if (!res.ok) {
    throw new Error(`Status check failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
