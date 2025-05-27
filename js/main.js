let header
let rodeoPic
let slider
let content // contains header, main, footer
let sliderItems
let scrolled = 0
let scrollingUp = false
let scrollingDown = false
let rem // font-size, assigned after load

const state = {
  locale: getLang(),
  language: getLang().includes('de') ? 'deutsch' : 'english',
  scrolled: false,
  sliderVisible: false,
  byeCowboy: false,
  contentAligned: false,
}

/*
  lazy loading of background image
  see https://web.dev/lazy-loading-images/#images-css
  no visible effect – probably same as without all this
  2.11.23: fürs erste entfernt, ev. später wieder rein
*/

console.clear()

// try adding date to path in order to circumvent cacheing
let imgs = document.querySelectorAll('#slider img')
const time = Date.now()
for (const img of imgs) {
  img.src = img.src + '?' + time
}

window.addEventListener('load', (event) => {
  // Fires when page fully loaded, including images.
  // console.log('all loaded')
  // Not however, the lazy loading images!

  // overwrite inline css in <main> to hide text until bg loaded
  document.body.style.opacity = 1

  rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  // console.log("page fully loaded")
  slider = document.getElementById('slider')
  examples = document.getElementById('examples') // slider container
  sliderItems = document.querySelectorAll('.slider-item')
  header = document.querySelector('header')
  rodeoPic = document.getElementById('rodeo-pic')
  content = document.getElementById('content')
  footer = document.querySelector('footer')

  const headerHeight = header.offsetHeight

  // listen for transition of #examples
  // should fire, when user scrolls enough
  // see handler for scroll event further down
  examples.addEventListener('transitionstart', () => {
    // scroll to start, just in case
    slider.scrollBy(0, 0) // scroll to start
  })

  // adjust height of slider
  // height comes from min-width in css 🥲
  const sliderItemsArr = [...sliderItems] // spread node into array
  const sliderItemsHeights = sliderItemsArr.map((item) => {
    return item.querySelector('img').offsetHeight // not the li, but the img in the li
    // in my case (iphone SE): 152
  })
  // console.log(sliderItemsHeights)

  // set img dimensions
  // Prämisse: DIN Hochformat = standard
  // Breite für DIN Hochformat = 1/3 d. (Viewport - 2 * 5)
  // 1 : 1.41

  // width for portrait img = third of viewport minus borders
  const margins = 0.75 * rem * 2

  /* 27.5.2025: Versuch: Viewport messen, Desktop -> schmalere Bilder */
  let targetWidth
  let targetHeight
  if ( window.innerWidth > 800) { // should go in a function and happen on resize, too
    targetWidth = Math.trunc((window.innerWidth - margins) / 7) // good for Mobile
    targetHeight = targetWidth * Math.SQRT2 // DIN-A Aspect-Ratio
  } else {
    targetWidth = Math.trunc((window.innerWidth - margins) / 3) // good for Mobile
    targetHeight = targetWidth * Math.SQRT2 // DIN-A Aspect-Ratio
  }
  console.log(targetHeight)

  const sliderImages = document.querySelectorAll('.slider-item img')
  sliderImages.forEach((img, i) => {
    // add counter to slider items (debugging purposes)
    // before loaded …
    // addCounter(img, i)

    if (img.complete) { // img alredy loadedu
      sizeSliderImg(img, i, targetWidth, targetHeight)
      // add counter to slider items (debugging purposes)
      // addCounter(img, i)
    } else {
      img.onload = (e) => {
        sizeSliderImg(img, i, targetWidth, targetHeight)
        // add counter to slider items (debugging purposes)
        // addCounter(img, i)
      } // end img.load()
    }
  }) // end forEach()

  // const sliderHeight = Math.max(...sliderItemsHeights)
  // spread array as arguments
  const sliderHeight = targetHeight // image height + border
  slider.setAttribute('style', `--slider-height: ${sliderHeight}px`)
  footer.setAttribute('style', `--slider-height: ${sliderHeight}px`)

  // und fürs padding
  document.body.setAttribute('style', `--slider-height: ${sliderHeight}px`)
  examples.setAttribute('style', `--examples-offset: ${sliderHeight}px`)

  // handle scroll event
  document.addEventListener(
    'scroll',
    (event) => {
      if (scrolled > sliderHeight) {
        // shouldn't this be viewportheight?
        // console.log(scrolled)
        state.scrolled = true // so it has begun
      }
      // slider moves into viewport
      // bescheuert: weil wird jedesmal abgefragt. geht das besser?
      if (state.scrolled && !examples.classList.contains('visible')) {
        examples.classList.add('visible')
        state.sliderVisible = true
      }

      // handle scroll data, when body is scrolled
      const scrolledAmount = window.scrollY
      const scrollDifference = scrolledAmount - scrolled
      if (scrollDifference > 0) {
        scrollingUp = false
        scrollingDown = true
      } else if (scrollDifference < 0) {
        scrollingUp = true
        scrollingDown = false
      } else {
        // scrolling stopped!?
        scrollingUp = false
        scrollingDown = false
      }
      scrolled = scrolledAmount

      /* Sobald der Header den oberen Rand erreicht hat,
       * brauchts keinen Cowboy mehr.
       * - Header soll künftig oben angeschlagen sein
       * - Bilder werden erst jetzt von unten eingeschoben
       * - bescheuert: content muss gescrollt werden, um
       *   fehlenden margin auszugleichen.
       */
      if (content.getBoundingClientRect().top <= 0) {
        state.byeCowboy = true // Cowboy not needed anymore
        content.classList.add('got-to-top')
        if (!state.contentAligned) {
          // align content with top
          window.scrollTo(0, 0)
          state.contentAligned = true
          // hide cowboy
          rodeoPic.style.background = 'black'
          rodeoPic.style.backgroundImage = 'none'
        }
        // console.log(`scrolled content to ${headerHeight}`)
        // das führt zu einem Sprung!
        // obsolet, oder?
      }

      // get slider’s scrolled data
      // slider.offsetWidth is the viewport’s width, so useless
      // achtung
      // achtung
      // achtung, dies sollte nicht teil es event handlers sein!
      // const sliderWidth = sliderItems.length * sliderItems[0].offsetWidth
      const sliderWidth = [...sliderItems]
        .map((li) => {
          return li.children[0].width
        })
        .reduce((a, b) => {
          return a + b + rem * 0.75
        })
      // console.log(sliderWidth)
      // translate scroll to slider
      // btw. what happens if slider is scrolled?
      // scrollHeight
      // scrollLeft
      // scrollLeftMax
      // scrollTop
      // scrollTopMax
      // scrollWidth

      slider.scrollBy({left: scrollDifference, top: 0, behaviour: 'smooth'})
      if (scrollingDown && slider.scrollLeft >= sliderWidth / 2) {
        // reset, when half through
        slider.scrollTo({left: 0, top: 0, behaviour: 'smooth'})
      }
      if (scrollingUp && slider.scrollLeft === 0) {
        slider.scrollBy({left: sliderWidth / 2, top: 0, behaviour: 'smooth'})
      }

      // handle header visibility
      if (scrollingDown && window.scrollY > 200) {
        // Letzteres wegen Unzuverlässigkeit
        header.classList.remove('scrolling-up')
        header.classList.add('scrolling-down')
      }
      if (scrollingUp || window.scrollY < 200) {
        // Letzteres wegen Unzuverlässigkeit
        header.classList.remove('scrolling-down')
        header.classList.add('scrolling-up')
      }
    },
    true
  ) // end scroll event listener

  // disable scroll on slider
  slider.addEventListener('pointerenter', (event) => {
    event.preventDefault()
  })

  // set language when first loaded
  setLanguage()

  // handle language switch
  // see state.locale and state.language
  const langSwitch = document.getElementById('language-switch')
  langSwitch.addEventListener('pointerdown', (e) => {
    e.preventDefault
    switchLanguage()
  })

  // set rodeo-pic height
  const rodeoPicHeight = window.innerHeight - headerHeight
  const contentMarginTop = rodeoPicHeight
  rodeoPic.setAttribute('style', `--rodeo-pic-height: ${rodeoPicHeight}px`)

  content.setAttribute(
    'style',
    `--content-margin-top: ${contentMarginTop}px; --header-height: ${headerHeight}px;`
  )
}) // end load event listener
