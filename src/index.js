const zoid = require('zoid')
const QS = require('querystring')

const WidgetComponent = zoid.create({

  // The html tag used to render my component

  tag: 'zlick-widget',

  // The url that will be loaded in the iframe or popup, when someone includes my component on their page

  url: ({ props }) => {
    const params = {
      client_token: props.clientToken,
      env: props.env,
      purpose: props.purpose
    }
    if (props.purpose === 'purchase') {
      params.product_amount = props.product.amount
      params.product_id = props.product.id
    } else if (props.purpose === 'subscribe') {
      params.subscription_id = props.subscription.id
    }
    const qs = QS.stringify(params)
    const URLs = {
      sandbox: 'http://zlick-widget-staging.eu-west-1.elasticbeanstalk.com',
      live: 'http://live-url.com'
    }
    return `${URLs[props.env]}/zlick/load?${qs}`
  },

  // The size of the component on their page. Only px and % strings are supported

  dimensions: {
    width: '100%',
    height: '250px'
  },

  // The properties they can (or must) pass down to my component. This is optional.

  props: {
    env: {
      type: 'string',
      required: true,
      validate: ({ value }) => {
        if (!['sandbox', 'live'].includes(value)) {
          throw new TypeError('Value of parameter env must be either sandbox or live')
        }
      }
    },

    purpose: {
      type: 'string',
      required: true,
      validate: ({ value }) => {
        if (!['purchase', 'subscribe'].includes(value)) {
          throw new TypeError('Value of parameter purpose must be either purchase or subscribe')
        }
      }
    },

    clientToken: {
      type: 'string',
      required: true
    },

    onAuthenticated: {
      type: 'function',
      required: false
    },

    confirmPurchase: {
      type: 'function',
      required: false,
      default: () => () => true
    },

    onPaymentComplete: {
      type: 'function',
      required: true
    },

    product: {
      type: 'object',
      required: false,
      validate: ({ value, props }) => {
        if (props.mode === 'product' && !value) {
          throw new TypeError('Product params must be defined in product mode')
        }
        if (!value.id) {
          throw new TypeError('Product ID must be defined')
        }
        if (!value.amount) {
          throw new TypeError('Product price must be defined')
        }
      }
    }
  }
})

module.exports = WidgetComponent
