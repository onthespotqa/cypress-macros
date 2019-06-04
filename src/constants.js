import {format} from 'date-fns'

export function instantiate() {
  const now = new Date();

  return {
    today: {
      short: format(now, 'M/D/YY')
    }
  }
}
