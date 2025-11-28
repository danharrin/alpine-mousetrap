import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'

const getOpenModal = () => Array.from(
    document.querySelectorAll('[aria-modal="true"]')
).find(modal => window.getComputedStyle(modal).display !== 'none')

export default (Alpine) => {
    Alpine.directive('mousetrap', (el, { modifiers, expression }, { evaluate }) => {
        const action = () => expression ? evaluate(expression) : el.click()

        modifiers = modifiers.map((modifier) => modifier
            .replace(/--/g, ' ')
            .replace(/-/g, '+')
            .replace(/\bslash\b/g, '/'))

        if (modifiers.includes('global')) {
            modifiers = modifiers.filter((modifier) => modifier !== 'global')

            Mousetrap.bindGlobal(modifiers, ($event) => {
                const openModal = getOpenModal()
                if (openModal && !openModal.contains(el)) {
                    return
                }

                $event.preventDefault()

                action()
            })
        }

        Mousetrap.bind(modifiers, ($event) => {
            const openModal = getOpenModal()
            if (openModal && !openModal.contains(el)) {
                return
            }

            $event.preventDefault()

            action()
        })

        document.addEventListener(
            'livewire:navigating',
            () => {
                Mousetrap.unbind(modifiers)
            },
            { once: true },
        )
    })
}
