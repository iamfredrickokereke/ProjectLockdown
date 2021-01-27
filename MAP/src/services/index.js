import api from '../api'

export const fetchTotals = async (
  startDate,
  endDate,
  selectedDate,
  daysRange
) => {
  if (!startDate) {
    startDate = new Date(selectedDate).toISOString()
    // console.log('startDate', startDate)
  }
  if (!endDate) {
    const currDate = new Date(selectedDate)
    currDate.setDate(currDate.getDate() + daysRange)
    endDate = currDate.toISOString()
    // console.log('endDate', endDate)
  }

  try {
    const res = await api.get(`/totals/lockdown/${startDate}/${endDate}`)
    console.log(res.data)
    return res.data[selectedDate]
  } catch (e) {
    console.log('Error in fetchTotals', e)
  }
}
