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

function addCounter(el, n) {
  const parent = el.parentElement
  parent.style.position = 'relative'
  const counter = document.createElement('p')
  counter.innerText = n
  parent.appendChild(counter)
  counter.style.position = 'absolute'
  counter.style.top = '0px'
  counter.style.right = '0px'
  counter.style.width = '20px'
  counter.style.padding = '0 2px'
  counter.style.fontSize = '10px'
  counter.style.textAlign = 'right'
  counter.style.background = parent.classList.contains('copy')
    ? 'black'
    : 'white'
  counter.style.color = parent.classList.contains('copy') ? 'white' : 'black'
  counter.style.zIndex = 1
}