function saveSearchRecord(item) {
  const records = localStorage.getItem('records')
  if (records) {
    const recordsArr = records.split(',')
    const recordIndex = recordsArr.findIndex(record => record === item)
    if (recordIndex === -1) {
      localStorage.setItem('records', [item, ...recordsArr].toString())
    } else {
      recordsArr.splice(recordIndex, 1)
      recordsArr.unshift(item)
      localStorage.setItem('records', recordsArr.toString())
    }

  } else {
    localStorage.setItem('records', [item].toString())
  }
}

function getSearchRecord() {
  const records = localStorage.getItem('records')
  return records ? records.split(',') : []
}

function removeTag(item) {
  const records = localStorage.getItem('records')
  if (records) {
    const recordsArr = records.split(',')
    const recordIndex = recordsArr.findIndex(record => record === item)
    recordsArr.splice(recordIndex, 1)
    localStorage.setItem('records', recordsArr.toString())
  }
}