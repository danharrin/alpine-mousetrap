const Mousetrap = require('mousetrap')

export default (Alpine) => {
    Alpine.directive('mousetrap', (el, { modifiers, expression }, { evaluate }) => {
        Mousetrap.bind(modifiers, () => {
            expression ? evaluate(expression) : el.click()

            return false
        })
    })
}