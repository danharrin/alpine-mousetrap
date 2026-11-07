import AlpinePackage from 'alpinejs'
import Mousetrap from '../dist/module.esm.js'

const { Alpine } = AlpinePackage

Alpine.plugin(Mousetrap)

const press = (target = document) => {
    const event = new KeyboardEvent('keydown', {
        key: 'k',
        keyCode: 75,
        which: 75,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
    })

    target.dispatchEvent(event)

    return event
}

afterEach(() => {
    Alpine.destroyTree(document.body)
    document.body.innerHTML = ''
})

test.each(['', '.global'])('registers and cleans up %s shortcuts', (modifier) => {
    document.body.innerHTML = `<div x-data="{ count: 0 }">
        <button x-mousetrap${modifier}.ctrl-k="count++"></button>
        <input>
    </div>`
    Alpine.initTree(document.body)

    const component = document.querySelector('[x-data]')
    const data = Alpine.$data(component)
    const target = modifier ? document.querySelector('input') : document

    expect(press(target).defaultPrevented).toBe(true)
    expect(data.count).toBe(1)

    Alpine.destroyTree(component)

    expect(press(target).defaultPrevented).toBe(false)
    expect(data.count).toBe(1)
})

test.each(['', '.global'])('keeps %s shortcuts on the live element after cloning', (modifier) => {
    document.body.innerHTML = `<div x-data>
        <input x-mousetrap${modifier}.ctrl-k="$el.focus()">
    </div>`
    Alpine.initTree(document.body)

    const input = document.querySelector('input')

    press()
    expect(document.activeElement).toBe(input)
    input.blur()

    const clone = input.cloneNode(true)
    Alpine.cloneNode(input, clone)

    press()
    expect(document.activeElement).toBe(input)
    input.blur()

    // Destroying the detached clone must not unbind the live shortcut.
    Alpine.destroyTree(clone)
    press()
    expect(document.activeElement).toBe(input)
    input.blur()

    Alpine.destroyTree(input)
    expect(press().defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(document.body)
})

test('clicks the element when no expression is provided', () => {
    document.body.innerHTML = '<div x-data><button x-mousetrap.ctrl-k></button></div>'
    Alpine.initTree(document.body)

    const button = document.querySelector('button')
    let clicks = 0
    button.addEventListener('click', () => clicks++)

    press()
    expect(clicks).toBe(1)

    const clone = button.cloneNode(true)
    Alpine.cloneNode(button, clone)
    press()
    expect(clicks).toBe(2)

    Alpine.destroyTree(button)
    press()
    expect(clicks).toBe(2)
})
