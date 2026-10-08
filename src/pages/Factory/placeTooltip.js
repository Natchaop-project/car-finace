export const TOOLTIP_W = 280
const OFFSET = 16

// Place the tooltip next to the pointer, flipping to stay inside the viewport.
// Called directly on pointer move so following the mouse never re-renders React.
export function placeTooltip(el, { x, y }) {
  const h = el.offsetHeight
  const left = x + OFFSET + TOOLTIP_W > window.innerWidth ? x - OFFSET - TOOLTIP_W : x + OFFSET
  const top = y + OFFSET + h > window.innerHeight ? y - OFFSET - h : y + OFFSET
  el.style.left = `${Math.max(8, left)}px`
  el.style.top = `${Math.max(8, top)}px`
}
