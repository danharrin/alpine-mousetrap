import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'

export default (Alpine) => {
    Alpine.directive('mousetrap', (el, { modifiers, expression }, { evaluate }) => {
        const action = () => expression ? evaluate(expression) : el.click()

        modifiers = modifiers.map((modifier) => modifier.replace('-', '+'))

        if (modifiers.includes('global')) {
            modifiers = modifiers.filter((modifier) => modifier !== 'global')

            Mousetrap.bindGlobal(modifiers, ($event) => {
                $event.preventDefault()

                action()
            })
        }

        Mousetrap.bind(modifiers, ($event) => {
            $event.preventDefault()

            action()
        })
    })
}