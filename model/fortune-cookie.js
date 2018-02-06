// add this import at the top
import fetch from 'node-fetch'

// add this somewhere in the middle
const FortuneCookie = {
  getOne () {
    return fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
      .then(res => res.json())
      .then(res => {
        return res[0].fortune.message
      })
  }
}

export { FortuneCookie }
