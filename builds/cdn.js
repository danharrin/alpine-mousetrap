import Mousetrap from '../src/index'

document.addEventListener('alpine:initializing', () => {
    Mousetrap(window.Alpine)
})
