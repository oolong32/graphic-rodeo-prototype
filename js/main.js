let slider
let sliderItems
let scrolled = 0
let scrollingUp = false
let scrollingDown = false

window.addEventListener('load', (event) => {
  // console.log("page is fully loaded")
  slider = document.getElementById('slider')
  sliderItems = document.querySelectorAll('.slider-item')

  // adjust height of slider
  const sliderItemsArr = [...sliderItems] // spread node into array
  const sliderItemsHeights = sliderItemsArr.map((item) => {
    return item.firstChild.offsetHeight // not the li, but the img in the li
  })
  const sliderHeight = Math.max(...sliderItemsHeights) // spread array as arguments
  slider.setAttribute('style', `--slider-height: ${sliderHeight}px`)
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

  }) // end scroll event listener

  // disable scroll on slider
  slider.addEventListener('pointerenter', (event) => {
    event.preventDefault()
  })
}) // end load event listener
