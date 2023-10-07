/**
 * Function to format and send response
 * @param {*} res
 * @param {*} code
 * @param {*} data
 * @param {*} type
 */
const sendResponse = (res, code, data, type = 'application/json') => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Content-Type': type,
    };
  
    res.writeHead(code, headers);
    res.write(JSON.stringify(data));
    res.end();
  };

export default { sendResponse }
