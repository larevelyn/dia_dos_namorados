const carousel = document.getElementById("carousel")
const cards = document.querySelectorAll(".card")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")
const totalCards = cards.length

let radius = 180
let currentAngle = 0
let focusedCardIndex = null

function positionCards(animate = false) {
  cards.forEach((card, index) => {
    const angle = (index / totalCards) * 360 + currentAngle
    const x = radius * Math.cos((angle * Math.PI) / 180)
    const z = radius * Math.sin((angle * Math.PI) / 180)

    const props = {
      x,
      z,
      rotationY: -angle,
      transformOrigin: "center center"
    }

    if (animate) {
      gsap.to(card, { ...props, duration: 0.8, ease: "power2.inOut" })
    } else {
      gsap.set(card, props)
    }
  })
}

cards.forEach((card, index) => {
  gsap.from(card, {
    opacity: 0,
    scale: 0.5,
    y: 100,
    rotationX: 45,
    delay: index * 0.1,
    duration: 1,
    ease: "power3.out"
  })
})

setTimeout(() => positionCards(false), 1500)

function updateCarousel(direction) {
  if (focusedCardIndex !== null) unfocusCard()

  if (direction === "next") {
    currentAngle -= 360 / totalCards
  } else if (direction === "prev") {
    currentAngle += 360 / totalCards
  }

  positionCards(true)
}

nextBtn.addEventListener("click", () => updateCarousel("next"))
prevBtn.addEventListener("click", () => updateCarousel("prev"))

function adjustRadius() {
  const w = window.innerWidth
  radius = Math.max(180, Math.min(w * 0.45, 350))
  positionCards(true)
}

window.addEventListener("resize", adjustRadius)
adjustRadius()

function unfocusCard() {
  focusedCardIndex = null
  cards.forEach(c => {
    c.style.pointerEvents = 'auto'
    c.style.opacity = 1
  })
  positionCards(true)
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (focusedCardIndex === index) {
      unfocusCard()
      return
    }

    focusedCardIndex = index

    cards.forEach((c, i) => {
      if (i === index) {
        const screenW = window.innerWidth
        const maxZ = Math.min(300, screenW * 0.4)
        const maxScale = screenW < 480 ? 1 : screenW < 768 ? 1.15 : 1.3

        gsap.to(c, {
          x: 0,
          z: maxZ,
          rotationY: 0,
          scale: maxScale,
          duration: 0.8,
          ease: 'power2.inOut'
        })
      } else {
        gsap.to(c, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.5
        })
      }
    })
  })
})

cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    if (focusedCardIndex !== null) return
    gsap.to(card, {
      scale: 1.1,
      z: "+=50",
      duration: 0.3,
      ease: "power2.out"
    })
  })

  card.addEventListener("mouseleave", () => {
    if (focusedCardIndex !== null) return
    gsap.to(card, {
      scale: 1,
      z: "-=50",
      duration: 0.3,
      ease: "power2.out"
    })
  })
})
