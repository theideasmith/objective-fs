function objectForPath(path, map){
  if (!map) throw new Error(
    "Cannot search " +
     typeof map      +
     " for path "    +
     path.toString()
   )

  if (path === null || path === undefined)
    throw new Error("Cannot search for null path in object")

  var searched = []
  var pathified = path.split(".")

  if (pathified.length === 0) return map

  var currObj = map
  var target

  while(directory = pathified.shift()){

    searched.push(directory.toString())

    target = currObj[directory]

    if (!target) throw new Error(
      "Given path " +
      path +
      " does not exist in object " +
      JSON.stringify(map))

    currObj = target
  }

  return currObj

}
