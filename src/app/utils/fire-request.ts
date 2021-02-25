
const fire = async function <T>(f): Promise<T> {
  try {
    return f.toPromise();
  }
  catch (err) {
    if (err.error && err.error.message) {
      throw new Error(err.error.message);
    }
    if (err.statusText) {
      throw new Error(err.statusText);
    }
      throw new Error(err.message);
  }
}

export default fire;