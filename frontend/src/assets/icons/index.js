// Create a “map” of png/jpg icons:
//   keys are the filenames (e.g. 'home.png')
//   values are the resolved URLs.
const icons = require.context(
  '.',          // look in THIS folder (i.e. src/assets/icons)
  false,        // don’t recurse into sub-folders
  /\.(png|jpe?g)$/ // only grab .png/.jpg/.jpeg
).keys().reduce((map, filename) => {
  // strip the leading './' off the filename key
  const cleanName = filename.replace('./', '')
  map[cleanName] = require.context(
    '.', false, /\.(png|jpe?g)$/
  )(filename)
  return map
}, {})

export default icons