const bindme = require('bindme')
const staticProps = require('static-props')

const Component = require('./Component')

/**
 * Display editable text
 */

class EditableText extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    // DOM Elements.
    // =================================================================

    const label = this.createElement('span')
    label.style.cursor = 'default'

    const editor = this.createElement('input')
    editor.style.display = 'none'

    // Event bindings.
    // =================================================================

    bindme(this,
      'onBlurEditor',
      'onClickLabel',
      'onKeydownEditor',
      'onMouseLeaveEditor'
    )

    editor.addEventListener('blur', this.onBlurEditor)
    editor.addEventListener('keydown', this.onKeydownEditor)
    editor.addEventListener('keyup', this.dropEvent)
    editor.addEventListener('mouseleave', this.onMouseLeaveEditor)
    label.addEventListener('click', this.onClickLabel)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      editor,
      label
    })
  }

  onBlurEditor () {
    this.submit()
  }

  onClickLabel () {
    if (this.editable) {
      this.startEditing()
    }
  }

  onKeydownEditor (event) {
    // Do not bubble up to Frame listener.
    event.stopPropagation()

    switch (event.key) {
      case 'Escape': this.stopEditing()
        break

      case 'Enter': this.submit()
        break

      default: break
    }
  }

  onMouseLeaveEditor () {
    this.stopEditing()
  }

  startEditing () {
    const {
      editor,
      label,
      text
    } = this

    editor.style.display = ''
    label.style.display = 'none'

    editor.value = text
    editor.focus()
  }

  stopEditing () {
    const {
      editor,
      label
    } = this

    editor.style.display = 'none'
    editor.value = ''
    label.style.display = ''
  }

  render (state) {
    const {
      label
    } = this

    const {
      editable,
      text
    } = state

    this.editable = editable

    const textChanged = this.text !== text

    // Label.
    // =================================================================

    if (textChanged) {
      this.text = text
      label.innerHTML = text
    }
  }

  submit () {
    const {
      action,
      editor
    } = this

    const value = editor.value.trim()

    if ((typeof action === 'function') && (value !== '')) {
      action(value)
    }

    this.stopEditing()
  }
}

module.exports = EditableText
