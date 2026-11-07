import AlpinePackage from 'alpinejs'
import Mousetrap from '../dist/module.esm.js'

const { Alpine } = AlpinePackage

Alpine.plugin(Mousetrap)

// Keep regular and global combinations distinct: Mousetrap's global-bind
// extension retains its global-combination flags even after unbinding.
const bindings = [['regular', '', 'j'], ['global', '.global', 'k']]

const press = (key, { target = document, type = 'keydown', ...options } = {}) => {
    const code = (type === 'keypress' ? key : key.toUpperCase()).charCodeAt(0)
    const event = new KeyboardEvent(type, {
        key,
        keyCode: code,
        which: code,
        bubbles: true,
        cancelable: true,
        ...options,
    })

    target.dispatchEvent(event)

    return event
}

afterEach(() => {
    Alpine.destroyTree(document.body)
    document.body.innerHTML = ''
})

describe('Shortcut registration', () => {
    describe.each(bindings)('%s bindings', (_name, modifier, key) => {
        test('evaluates the expression only for a matching shortcut and prevents its default', () => {
            document.body.innerHTML = `<div x-data="{ count: 0 }">
                <button x-mousetrap${modifier}.ctrl-${key}="count++"></button>
            </div>`
            Alpine.initTree(document.body)

            const button = document.querySelector('button')
            const data = Alpine.$data(button)
            let clicks = 0
            button.addEventListener('click', () => clicks++)

            expect(press('x', { ctrlKey: true }).defaultPrevented).toBe(false)
            expect(press(key, { type: 'keypress' }).defaultPrevented).toBe(false)
            expect(data.count).toBe(0)

            expect(press(key, { ctrlKey: true }).defaultPrevented).toBe(true)
            expect(data.count).toBe(1)
            expect(clicks).toBe(0)

            Alpine.destroyTree(document.querySelector('[x-data]'))
            expect(press(key, { ctrlKey: true }).defaultPrevented).toBe(false)
            expect(data.count).toBe(1)
        })

        test('clicks the element when no expression is provided and stops after cleanup', () => {
            document.body.innerHTML = `<div x-data><button x-mousetrap${modifier}.ctrl-${key}></button></div>`
            Alpine.initTree(document.body)

            const button = document.querySelector('button')
            let clicks = 0
            button.addEventListener('click', () => clicks++)

            press(key, { ctrlKey: true })
            expect(clicks).toBe(1)

            Alpine.destroyTree(button)
            press(key, { ctrlKey: true })
            expect(clicks).toBe(1)
        })

        test('cleans up only its own shortcut and allows a replacement to register it', () => {
            const otherKey = modifier ? 'm' : 'l'
            document.body.innerHTML = `<div x-data="{ first: 0, other: 0, replacement: 0 }">
                <button id="first" x-mousetrap${modifier}.ctrl-${key}="first++"></button>
                <button x-mousetrap${modifier}.ctrl-${otherKey}="other++"></button>
            </div>`
            Alpine.initTree(document.body)

            const component = document.querySelector('[x-data]')
            const data = Alpine.$data(component)
            const first = document.querySelector('#first')

            press(key, { ctrlKey: true })
            press(otherKey, { ctrlKey: true })
            expect(data.first).toBe(1)
            expect(data.other).toBe(1)

            Alpine.destroyTree(first)
            first.remove()
            expect(press(key, { ctrlKey: true }).defaultPrevented).toBe(false)
            expect(data.first).toBe(1)
            press(otherKey, { ctrlKey: true })
            expect(data.other).toBe(2)

            const replacement = document.createElement('button')
            replacement.setAttribute(`x-mousetrap${modifier}.ctrl-${key}`, 'replacement++')
            component.append(replacement)
            Alpine.initTree(replacement)

            expect(press(key, { ctrlKey: true }).defaultPrevented).toBe(true)
            expect(data.replacement).toBe(1)
            expect(data.first).toBe(1)
            expect(data.other).toBe(2)
        })

        test.each(['input', 'textarea', 'select'])('handles shortcuts originating in %s according to global mode', (tag) => {
            document.body.innerHTML = `<div x-data="{ count: 0 }">
                <button x-mousetrap${modifier}.ctrl-${key}="count++"></button>
                <${tag}></${tag}>
            </div>`
            Alpine.initTree(document.body)

            const target = document.querySelector(tag)
            const data = Alpine.$data(target)
            const global = modifier === '.global'

            expect(press(key, { target, ctrlKey: true }).defaultPrevented).toBe(global)
            expect(data.count).toBe(global ? 1 : 0)

            Alpine.destroyTree(document.querySelector('button'))
            expect(press(key, { target, ctrlKey: true }).defaultPrevented).toBe(false)
            expect(data.count).toBe(global ? 1 : 0)
        })
    })
})

describe('Shortcut syntax', () => {
    test('registers multiple combinations, translates modifiers, and cleans up every alias', () => {
        document.body.innerHTML = `<div x-data="{ count: 0 }">
            <button x-mousetrap.ctrl-j.command-j.alt-shift-j="count++"></button>
        </div>`
        Alpine.initTree(document.body)

        const button = document.querySelector('button')
        const data = Alpine.$data(button)

        expect(press('j', { ctrlKey: true }).defaultPrevented).toBe(true)
        expect(data.count).toBe(1)
        expect(press('j', { metaKey: true }).defaultPrevented).toBe(true)
        expect(data.count).toBe(2)
        expect(press('j', { altKey: true, shiftKey: true }).defaultPrevented).toBe(true)
        expect(data.count).toBe(3)
        expect(press('j', { altKey: true }).defaultPrevented).toBe(false)
        expect(data.count).toBe(3)

        Alpine.destroyTree(button)
        expect(press('j', { ctrlKey: true }).defaultPrevented).toBe(false)
        expect(press('j', { metaKey: true }).defaultPrevented).toBe(false)
        expect(press('j', { altKey: true, shiftKey: true }).defaultPrevented).toBe(false)
        expect(data.count).toBe(3)
    })

    test('translates double hyphens into a sequence and requires the complete sequence', () => {
        document.body.innerHTML = `<div x-data="{ count: 0 }">
            <button x-mousetrap.g--i="count++"></button>
        </div>`
        Alpine.initTree(document.body)

        const button = document.querySelector('button')
        const data = Alpine.$data(button)

        press('g', { type: 'keypress' })
        expect(data.count).toBe(0)
        press('x', { type: 'keypress' })
        press('i', { type: 'keypress' })
        expect(data.count).toBe(0)

        press('g', { type: 'keypress' })
        expect(press('i', { type: 'keypress' }).defaultPrevented).toBe(true)
        expect(data.count).toBe(1)

        Alpine.destroyTree(button)
        press('g', { type: 'keypress' })
        expect(press('i', { type: 'keypress' }).defaultPrevented).toBe(false)
        expect(data.count).toBe(1)
    })

    test('translates slash both on its own and in a modifier combination', () => {
        document.body.innerHTML = `<div x-data="{ count: 0 }">
            <button x-mousetrap.slash.ctrl-slash="count++"></button>
        </div>`
        Alpine.initTree(document.body)

        const button = document.querySelector('button')
        const data = Alpine.$data(button)

        expect(press('/', { type: 'keypress' }).defaultPrevented).toBe(true)
        expect(data.count).toBe(1)
        expect(press('/', { ctrlKey: true, keyCode: 191, which: 191 }).defaultPrevented).toBe(true)
        expect(data.count).toBe(2)

        Alpine.destroyTree(button)
        expect(press('/', { type: 'keypress' }).defaultPrevented).toBe(false)
        expect(press('/', { ctrlKey: true, keyCode: 191, which: 191 }).defaultPrevented).toBe(false)
        expect(data.count).toBe(2)
    })
})

describe('Modal scoping', () => {
    describe.each(bindings)('%s bindings', (_name, modifier, key) => {
        test.each(['visible', 'hidden', 'non-modal'])('scopes shortcuts around a %s dialog', (state) => {
            const insideKey = modifier ? 'm' : 'l'
            document.body.innerHTML = `<div x-data="{ background: 0, inside: 0 }">
                <button x-mousetrap${modifier}.ctrl-${key}="background++"></button>
                <div aria-modal="true" style="display: none"></div>
                <div id="dialog" aria-modal="${state === 'non-modal' ? 'false' : 'true'}" style="display: ${state === 'hidden' ? 'none' : 'block'}">
                    <button x-mousetrap${modifier}.ctrl-${insideKey}="inside++"></button>
                </div>
            </div>`
            Alpine.initTree(document.body)

            const data = Alpine.$data(document.querySelector('[x-data]'))
            const blocked = state === 'visible'

            expect(press(key, { ctrlKey: true }).defaultPrevented).toBe(!blocked)
            expect(data.background).toBe(blocked ? 0 : 1)
            expect(press(insideKey, { ctrlKey: true }).defaultPrevented).toBe(true)
            expect(data.inside).toBe(1)

            document.querySelector('#dialog').style.display = 'none'
            expect(press(key, { ctrlKey: true }).defaultPrevented).toBe(true)
            expect(data.background).toBe(blocked ? 1 : 2)
        })
    })
})

describe('Alpine cloning', () => {
    describe.each(bindings)('%s bindings', (_name, modifier, key) => {
        test.each(['cloneNode', 'clone'])('keeps the live expression and cleanup intact during %s', (method) => {
            document.body.innerHTML = `<div x-data>
                <input x-mousetrap${modifier}.ctrl-${key}="$el.focus()">
            </div>`
            Alpine.initTree(document.body)

            const input = document.querySelector('input')

            press(key, { ctrlKey: true })
            expect(document.activeElement).toBe(input)
            input.blur()

            const clone = input.cloneNode(true)
            Alpine[method](input, clone)

            press(key, { ctrlKey: true })
            expect(document.activeElement).toBe(input)
            input.blur()

            Alpine.destroyTree(clone)
            press(key, { ctrlKey: true })
            expect(document.activeElement).toBe(input)
            input.blur()

            Alpine.destroyTree(input)
            expect(press(key, { ctrlKey: true }).defaultPrevented).toBe(false)
            expect(document.activeElement).toBe(document.body)
        })

        test('keeps the click fallback on the live element after cloning', () => {
            document.body.innerHTML = `<div x-data><button x-mousetrap${modifier}.ctrl-${key}></button></div>`
            Alpine.initTree(document.body)

            const button = document.querySelector('button')
            let clicks = 0
            button.addEventListener('click', () => clicks++)

            const clone = button.cloneNode(true)
            Alpine.cloneNode(button, clone)
            press(key, { ctrlKey: true })
            expect(clicks).toBe(1)

            Alpine.destroyTree(clone)
            press(key, { ctrlKey: true })
            expect(clicks).toBe(2)

            Alpine.destroyTree(button)
            press(key, { ctrlKey: true })
            expect(clicks).toBe(2)
        })
    })
})
