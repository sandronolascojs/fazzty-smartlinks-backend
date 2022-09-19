export const dateFormat = (baseDates) => baseDates.map((date) => {
  const convertedDate = new Date(date)
  return `${convertedDate.getMonth() + 1}/${convertedDate.getDate()}/${convertedDate.getFullYear()}`
})

export const visitsCounter = (dateFormated) => {
  const counts = []
  dateFormated.forEach(function (x) { counts[x] = (counts[x] || 0) + 1 })
  return counts
}
