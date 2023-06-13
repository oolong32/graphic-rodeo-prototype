function getLang() {
  // wird in state gebraucht
  if (navigator.languages != undefined) return navigator.languages[0]
  return navigator.language
}

let header
let rodeoPic
let slider
let content // contains header, main, footer
let sliderItems
let scrolled = 0
let scrollingUp = false
let scrollingDown = false

const state = {
  locale: getLang(),
  language: getLang().includes('de') ? 'deutsch' : 'english',
  scrolled: false,
  sliderVisible: false,
  byeCowboy: false,
  contentAligned: false,
}

window.addEventListener('load', (event) => {
  // fires when all is loaded, including images
  console.log('all loaded')

  // console.log("page fully loaded")
  slider = document.getElementById('slider')
  examples = document.getElementById('examples') // slider container
  sliderItems = document.querySelectorAll('.slider-item')
  header = document.querySelector('header')
  rodeoPic = document.getElementById('rodeo-pic')
  content = document.getElementById('content')

  const headerHeight = header.offsetHeight

  // header fixed, darum body-padding
  // document.body.style.paddingTop = `${8 + header.offsetHeight}px`

  // adjust height of slider
  // height comes from min-width in css 🥲
  const sliderItemsArr = [...sliderItems] // spread node into array
  const sliderItemsHeights = sliderItemsArr.map((item) => {
    console.log(item.querySelector('img').offsetHeight)
    return item.querySelector('img').offsetHeight // not the li, but the img in the li
  })
  const sliderHeight = Math.max(...sliderItemsHeights) // spread array as arguments
  slider.setAttribute('style', `--slider-height: ${sliderHeight}px`)
  document.querySelector('footer').setAttribute('style', `--slider-height: ${sliderHeight}px`)
  // set img dimensions
  const sliderImages = document.querySelectorAll('.slider-item img')
  sliderImages.forEach((img) => {
    // img ACHTUNG Stimmt das Seitenverhältnis?
  })
  // und fürs padding
  document.body.setAttribute('style', `--slider-height: ${sliderHeight}px`)
  examples.setAttribute('style', `--examples-offset: ${sliderHeight}px`)

  // scroll to center of slider
  slider.scrollBy(-slider.scrollLeftMax / 2, 0) // fires the scroll event!?
  // console.log(`scrolled by ${slider.scrollLeftMax / 2}`)

  // handle scroll event
  document.addEventListener(
    'scroll',
    (event) => {
      if (scrolled > sliderHeight) {
        state.scrolled = true // so it has begun
      }
      // slider moves into viewport
      // das ist bescheuert (strukturell) geht das besser?
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
        console.log(`scrolled content to ${headerHeight}`)
        // shit shit shit
        // das führt zu einem Sprung!
      }

      // get slider’s scrolled data
      const sliderWidth = sliderItems.length * sliderItems[0].offsetWidth

      // translate scroll to slider
      // btw. what happens if slider is scrolled?
      // scrollHeight
      // scrollLeft
      // scrollLeftMax
      // scrollTop
      // scrollTopMax
      // scrollWidth

      slider.scrollBy(scrollDifference, 0)
      if (scrollingDown && slider.scrollLeft >= sliderWidth / 2) {
        // reset, when half throught
        slider.scrollTo(0, 0)
      }
      if (scrollingUp && slider.scrollLeft === 0) {
        slider.scrollBy(sliderWidth / 2, 0)
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

  // slider.addEventListener('scroll', (event) => {
  // console.log(`slider-slide detected: ${scrolled}`)
  // })

  // handle language switch
  // see state.locale and state.language
  const langSwitch = document.getElementById('language-switch')
  langSwitch.addEventListener('pointerdown', (e) => {
    e.preventDefault
    if (state.language === 'english') {
      // was EN switch to DE
      state.language = 'deutsch'
      document.querySelector('.deutsch').style.display = 'block'
      document.querySelector('.english').style.display = 'none'
    } else {
      // was DE, switch to EN
      state.language = 'english'
      document.querySelector('.deutsch').style.display = 'none'
      document.querySelector('.english').style.display = 'block'
    }
    document.querySelectorAll('#language-selection a').forEach((a) => {
      a.classList.toggle('active')
    })
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
