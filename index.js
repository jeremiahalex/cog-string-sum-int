const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const packageJson = require('./package.json')
const cogMeta = {
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version
}

app.use(cors())
app.use(bodyParser.json())

function charToInt (char) {
  switch (char) {
    case 'a': case 'j': case 's':
      return 1
    case 'b': case 'k': case 't':
      return 2
    case 'c': case 'l': case 'u':
      return 3
    case 'd': case 'm': case 'v':
      return 4
    case 'e': case 'n': case 'w':
      return 5
    case 'f': case 'o': case 'x':
      return 6
    case 'g': case 'p': case 'y':
      return 7
    case 'h': case 'q': case 'z':
      return 7
    case 'i': case 'r':
      return 9
  }
  return 0
}
// This is the main logic of our cog - it takes a string and reverses it
function nameToId (prop) {
  if (!prop['name'] || typeof prop['name'] !== 'string') return prop

  prop['id'] = 0
  prop['name'].toLowerCase().split('').forEach((char) => {
    prop['id'] += charToInt(char)
  })
  console.log(prop['id'])
  while (prop['id'] > 9 && prop['id'] !== 11 && prop['id'] !== 22) {
    let arr = prop['id'].toString().split('')
    console.log(arr)
    prop['id'] = +arr[0] + +arr[1]
  }

  return prop
}

// we define a single post route called connect, which takes in a json file and returns a replacement
app.post('/connect', (req, res) => {
  let data = req.body

  // if we don't have the data we need then just return it as is
  if (!data || !data.props) {
    return res.json(data)
  }

  // if we have props, apply this cog to the list of transforms
  if (!data.transforms) data.transforms = []
  var transform = Object.assign({order: data.transforms.length}, cogMeta)
  data.transforms.push(transform)

  // we then do what it is that we do and return the new version of the props
  data.props = data.props.map(nameToId)
  res.json(data)
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Cog Ready`)
})
