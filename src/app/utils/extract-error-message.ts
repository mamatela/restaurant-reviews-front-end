
const extractMessage = function(e) {
  if (e.error && e.error.message) return e.error.message;
  if (e.statusText) return e.statusText;
  return e.message;
}

export default extractMessage;