
export default function (f) {
  let cache = {}
  return {
    read(...args) {
      let key = args.join('|')
      if(key in cache) {
        return cache[key]
      }else {
        throw f(...args).then(val => {
          cache[key] = val
        })
      }
    }
  }
}