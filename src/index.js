const Mousetrap = require('mousetrap')

export default (Alpine) => {
    Alpine.directive('mousetrap', (el, { modifiers, expression }, { evaluate }) => {
        Mousetrap.bindGlobal(modifiers, ($event) => {
            $event.preventDefault()

            expression ? evaluate(expression) : el.click()

            return false
        })
    })
}