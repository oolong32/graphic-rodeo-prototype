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

console.clear()

// try adding date to path in order to circumvent cacheing
let imgs = document.querySelectorAll('#slider img')
const time = Date.now()
for (const img of imgs) {
  img.src = img.src + '?' + time
}

window.addEventListener('load', (event) => {
  // Fires when page fully loaded, including images.
  console.log('all loaded')
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
    console.log('examples sliding in')

    // scroll to center of slider
    // 30. Oktober 2023: warum?
    // slider.scrollBy(-slider.scrollLeftMax / 2, 0) // fires the scroll event!?
    // console.log(`scrolled by ${slider.scrollLeftMax / 2}`)
    // 30.10.23, versuche beim Start zu beginnen
    slider.scrollBy(0, 0) // scroll to start
    console.log('scrolled to 0')
  })

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
  sliderImages.forEach((img, i) => {
    // add counter to slider items (debugging purposes)
    // before loaded …
    // addCounter(img, i)

    /* WIE GEHT CSS Höhe? Wär doch gelacht, wenn das nicht läuft!!! */

    // img.onload = (e) => {

      // const lTime = Date.now()
      // console.log(`${name} loaded after ${lTime - time} ms`)
      // wait for img to be loaded
      // get original measure
      const realSize = {
        w: img.naturalWidth,
        h: img.naturalHeight,
      }

      // get filenames (for debugging purposes)
      // const re = /\w+\.png/
      // const name = img.src.match(re)
      console.log(`${name} — w: ${realSize.w}, h: ${realSize.h}`)

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

      // add counter to slider items (debugging purposes)
      // after load …
      addCounter(img, i)

      
      // 2.11.23: crazy – folgendes scheint nicht immer zu passieren.
      // möglicherweise wird onload-event teils übergangen?
      // in diesem Fall sollte dieser Abschnitt nicht an 
      // diesen Event gekoppelt werde, oder?
      // Möglich: onload passiert nicht, weil eh schon geladen?
      img.setAttribute(
        'style',
        `--img-width: ${imgWidth}px; --img-height ${imgHeight}px`
      )
    // } // end img.load()
  }) // end forEach()

  // const sliderHeight = Math.max(...sliderItemsHeights) // spread array as arguments
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
      if (scrolled > sliderHeight) { // shouldn't this be viewportheight?
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
        console.log(sliderWidth)
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
