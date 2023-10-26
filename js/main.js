function getLang() {
  // wird in state gebraucht
  if (navigator.languages != undefined) return navigator.languages[0]
  return navigator.language
}

function setLanguage() {
  // set language according to locale
  // texts
  const contentDe = document.querySelector('.deutsch')
  const contentEn = document.querySelector('.english')
  // language selection links
  const languageSelectionDe = document.getElementById('language-selection-de')
  const languageSelectionEn = document.getElementById('language-selection-en')
  if (state.language === 'english') {
    // locale = en
    contentDe.style.display = 'none'
    contentEn.style.display = 'block'
    if (languageSelectionEn.classList.contains('active')) {
      // language-link should show "de"
      languageSelectionEn.classList.remove('active')
      languageSelectionDe.classList.add('active')
    }
  } else {
    // locale = de
    contentDe.style.display = 'block'
    contentEn.style.display = 'none'
    if (languageSelectionDe.classList.contains('active')) {
      // language-link should show "en"
      languageSelectionDe.classList.remove('active')
      languageSelectionEn.classList.add('active')
    }
  }
}

function switchLanguage() {
  // switch from one to the other language
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
}

let rem // font-size, assigned after load

function roundNumber(n) {
  return Math.round(n * 100) / 100
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

/*
  lazy loading of background image
  see https://web.dev/lazy-loading-images/#images-css
  no visible effect – probably same as without all this
*/
/*
document.addEventListener('DOMContentLoaded', () => {
  // fires when HTML parsed
  //  but before CSS and images have beend loaded
  console.log('html parsed')
  const rodeoPic = document.getElementById('rodeo-pic')
  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
          console.log(entry)
        }
      });
    });

    lazyBackgroundObserver.observe(rodeoPic);
  }
})
*/

// try prevent image caching (img size debug, oct 26 2023)
const sliderPics = document.querySelectorAll('.slider-item')
for (img of sliderPics) {
  // add funny number i.e. the date to the source path
  img.src = img.src + '?' + Date.now();
  // console.log img.src
}

window.addEventListener('load', (event) => {
  // fires when page fully loaded, including images
  console.log('all loaded')

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

  // adjust height of slider
  // height comes from min-width in css 🥲
  const sliderItemsArr = [...sliderItems] // spread node into array
  const sliderItemsHeights = sliderItemsArr.map((item) => {
    return item.querySelector('img').offsetHeight // not the li, but the img in the li
    // in my case (iphone SE) 152
  })
  // console.log(sliderItemsHeights)

  // set img dimensions
  // Prämisse: DIN Hochformat = standard
  // Breite für DIN Hochformat = 1/3 d. (Viewport - 2 * 5)
  // 1 : 1.41

  // width for portrait img = third of viewport minus borders
  const margins = 0.75 * rem * 2
  const targetWidth = Math.trunc((window.innerWidth - margins) / 3)
  const targetHeight = targetWidth * Math.SQRT2
  console.log(targetHeight)

  const sliderImages = document.querySelectorAll('.slider-item img')
  sliderImages.forEach((img) => {
    img.src = img.src + '?' + Date.now();
    console.log(img.src)
    img.onload = (e) => {
      // wait for img to be loaded
      // get original measure
      const realSize = {
        w: img.naturalWidth,
        h: img.naturalHeight,
      }

      // get filenames (for debugging purposes)
      const re = /\w+\.png/
      const name = img.src.match(re)
      // console.log(`${name} — w: ${realSize.w}, h: ${realSize.h}`)

      // add class describing aspect ratio
      if (realSize.w > realSize.h) {
        img.classList.add('querformat')
      } else if (realSize.w < realSize.h) {
        img.classList.add('hochformat')
      } else {
        img.classList.add('quadrat')
      }

      // how should the original measure be scaled down?
      const scaleFactor = targetHeight / realSize.h

      imgWidth = realSize.w * scaleFactor
      imgHeight = targetHeight

      // set img attribute and css dimensions
      img.width = imgWidth
      img.height = imgHeight
      // console.log(`foo ${imgWidth}`)
      img.setAttribute(
        'style',
        `--img-width: ${imgWidth}px; --img-height ${imgHeight}px`
      )
    } // end img.load()
  }) // end forEach()

  // const sliderHeight = Math.max(...sliderItemsHeights) // spread array as arguments
  const sliderHeight = targetHeight // image height + border
  slider.setAttribute('style', `--slider-height: ${sliderHeight}px`)
  footer.setAttribute('style', `--slider-height: ${sliderHeight}px`)

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
        // reset, when half through
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
