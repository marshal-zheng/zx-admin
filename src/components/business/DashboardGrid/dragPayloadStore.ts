// Simple shared store for current drag payload during HTML5 DnD
// Some browsers don't expose dataTransfer.getData during dragover reliably.
// Using a module-level variable ensures both palette and grid can access it.

let currentPayload = null

export function setDragPayload(payload) {
  currentPayload = payload || null
}

export function getDragPayload() {
  return currentPayload
}

export function clearDragPayload() {
  currentPayload = null
}
