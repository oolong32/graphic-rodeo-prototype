let header
let slider
let sliderItems
let scrolled = 0
let scrollingUp = false
let scrollingDown = false

window.addEventListener('load', (event) => {
  // fires when all is loaded, including images
  console.log('all loaded')
 
  // console.log("page is fully loaded")
  slider = document.getElementById('slider')
  sliderItems = document.querySelectorAll('.slider-item')
  header = document.querySelector('header')

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
  // set img dimensions
  const sliderImages = document.querySelectorAll('.slider-item img')
  sliderImages.forEach(img => {
  // img ACHTUNG Stimmt das Seitenverhältnis?
  })
  // und fürs padding
  document.body.setAttribute('style', `--slider-height: ${sliderHeight}px`)

  // scroll to center of slider
  slider.scrollBy(-slider.scrollLeftMax/2, 0)
  console.log(`scrolled by ${slider.scrollLeftMax/2}`)

  // handle scroll event
  document.addEventListener('scroll', (event) => {
    // handle scroll data, when body is scrolled
    const scrolledAmount = window.scrollY
    const scrollDifference = scrolledAmount - scrolled
    if (scrollDifference > 0) {
      scrollingUp = false
      scrollingDown = true
    } else if (scrollDifference < 0) {
      scrollingUp = true
      scrollingDown = false
    } else { // scrolling stopped!?
      scrollingUp = false
      scrollingDown = false
    }
    scrolled = scrolledAmount

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
    if (scrollingDown && slider.scrollLeft >= sliderWidth / 2) { // reset, when half throught
      slider.scrollTo(0, 0)
    }
    if (scrollingUp && slider.scrollLeft === 0) {
      slider.scrollBy(sliderWidth/2, 0)
    }

    // handle header visibility
    if (scrollingDown && window.scrollY > 200) { // Letzteres wegen Unzuverlässigkeit
      header.classList.remove('scrolling-up')
      header.classList.add('scrolling-down')
    }
    if (scrollingUp || window.scrollY < 200) { // Letzteres wegen Unzuverlässigkeit
      header.classList.remove('scrolling-down')
      header.classList.add('scrolling-up')
    }

  }) // end scroll event listener

  // disable scroll on slider
  slider.addEventListener('pointerenter', (event) => {
    event.preventDefault()
  })

}) // end load event listener

