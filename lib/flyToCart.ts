import gsap from 'gsap'

export function flyToCart(sourceEl: HTMLElement): void {
  const cartBtn = document.querySelector<HTMLElement>('[data-cart-target]')
  if (!cartBtn) return

  const srcRect  = sourceEl.getBoundingClientRect()
  const cartRect = cartBtn.getBoundingClientRect()

  const startX = srcRect.left + srcRect.width  / 2
  const startY = srcRect.top  + srcRect.height / 2
  const endX   = cartRect.left + cartRect.width  / 2
  const endY   = cartRect.top  + cartRect.height / 2

  const size = Math.min(srcRect.width, srcRect.height, 110)

  const clone = document.createElement('div')
  clone.style.cssText = [
    `position:fixed`,
    `z-index:9999`,
    `width:${size}px`,
    `height:${size}px`,
    `left:${startX - size / 2}px`,
    `top:${startY  - size / 2}px`,
    `pointer-events:none`,
    `background:#0F0F0F`,
    `border:1px solid #1C1C1C`,
    `overflow:hidden`,
    `will-change:transform,opacity`,
  ].join(';')

  const img = sourceEl.querySelector('img')
  if (img) {
    const imgClone = img.cloneNode(true) as HTMLImageElement
    imgClone.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:10px;'
    clone.appendChild(imgClone)
  }

  document.body.appendChild(clone)

  const dx = endX - startX
  const dy = endY - startY
  // Arc peak: midpoint + 50px above the straight line (stays visible on screen)
  const arcPeakX = dx * 0.5
  const arcPeakY = dy * 0.5 - 50

  gsap.to(clone, {
    keyframes: [
      { x: arcPeakX, y: arcPeakY, scale: 0.55, duration: 0.38, ease: 'power2.out' },
      { x: dx,       y: dy,       scale: 0.08, opacity: 0, duration: 0.32, ease: 'power3.in' },
    ],
    onComplete() {
      clone.remove()

      // Bounce + green flash on cart icon
      gsap.killTweensOf(cartBtn)
      gsap.fromTo(
        cartBtn,
        { scale: 1.5, color: '#4DFFB4' },
        { scale: 1, color: '#E8E8E8', duration: 0.55, ease: 'elastic.out(1, 0.35)' }
      )
    },
  })
}
