let slider
let sliderItems
let scrolled = 0
let scrollingUp = false
let scrollingDown = false

window.addEventListener('load', (event) => {
  // console.log("page is fully loaded")
  slider = document.getElementById('slider')
  sliderItems = document.querySelectorAll('.slider-item')

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
    console.log(slider.scrollLeft)
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
    console.log(`pointer on slider 😱`)
    event.preventDefault()
  })
}) // end load event listener
