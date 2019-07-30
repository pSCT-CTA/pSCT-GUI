export function getErrorNumFromName (errorName) {
  let pattern = /\[[0-9]+]/ // extract pattern of "[errorNum]" from the error name string
  let errorNum = errorName.match(pattern)[0]
  errorNum = parseInt(errorNum.substring(1, errorNum.length - 1)) // strip leading and trailing "[} and "]" and convert to int
  return errorNum
}

export function getErrorSeverityFromName (errorName) {
  const pattern = /\[[a-zA-Z]+]/ // extract pattern of "[severity]" from the error name string
  let severity = errorName.match(pattern)[0]
  severity = severity.substring(1, severity.length - 1)
  let severityCode = null
  if (severity === 'Operable') {
    severityCode = 1
  } else if (severity === 'Fatal') {
    severityCode = 2
  }
  return [severityCode, severity]
}

export function getErrorDescFromName (errorName) {
  return errorName.split(']')[2]
}
