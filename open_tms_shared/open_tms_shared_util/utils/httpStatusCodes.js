const HTTP_STATUS_CODES = {
  // 1xx Informational
  100: 'Continue', // The server has received the initial part of the request and is waiting for the client to send the rest.
  101: 'Switching Protocols', // The server agrees to switch protocols and the client should proceed with the request using the new protocol.
  102: 'Processing', // The server is still processing the request, but has received and understood the headers and should not wait for the request to complete.
  103: 'Early Hints', // The server is sending some response headers before finalizing the response.

  // 2xx Success
  200: 'OK', // The request was successful, and the server has returned the requested resource.
  201: 'Created', // The request was successful, and a new resource was created as a result.
  202: 'Accepted', // The request has been accepted for processing, but the processing has not been completed.
  203: 'Non-Authoritative Information', // The server is a transforming proxy that received a 200 OK response from its origin but is returning a modified version.
  204: 'No Content', // The request was successful, but there is no content to return.
  205: 'Reset Content', // The server instructs the client to reset the view that sent the request.
  206: 'Partial Content', // The server is delivering only part of the resource due to a range header sent by the client.
  207: 'Multi-Status', // The message body that follows is an XML message and can contain multiple response codes.
  208: 'Already Reported', // The members of a DAV binding have already been enumerated in a preceding part of the response.
  226: 'IM Used', // The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.

  // 3xx Redirection
  300: 'Multiple Choices', // Indicates multiple options for the requested resource, each with its own specific location.
  301: 'Moved Permanently', // The requested resource has been permanently moved to a new location.
  302: 'Found', // The requested resource has been temporarily moved to a different location.
  303: 'See Other', // The response to the request can be found under a different URI.
  304: 'Not Modified', // The requested resource has not been modified since the last request.
  305: 'Use Proxy', // The requested resource must be accessed through the proxy given by the location field.
  307: 'Temporary Redirect', // The requested resource has been temporarily moved to a different location.
  308: 'Permanent Redirect', // The requested resource has been permanently moved to a different location.

  // 4xx Client Errors
  400: 'Bad Request', // The server cannot process the request due to a client error.
  401: 'Unauthorized', // The request requires user authentication.
  402: 'Payment Required', // Reserved for future use.
  403: 'Forbidden', // The server understands the request, but refuses to authorize it.
  404: 'Not Found', // The requested resource could not be found on the server.
  405: 'Method Not Allowed', // The method specified in the request is not allowed for the resource.
  406: 'Not Acceptable', // The server cannot produce a response matching the list of acceptable values defined in the request's headers.
  407: 'Proxy Authentication Required', // The client must first authenticate itself with the proxy.
  408: 'Request Timeout', // The server timed out waiting for the request.
  409: 'Conflict', // The request could not be completed due to a conflict with the current state of the target resource.
  410: 'Gone', // The requested resource is no longer available and will not be available again.
  411: 'Length Required', // The server requires the request to be valid and to contain a valid Content-Length header.
  412: 'Precondition Failed', // The server does not meet one of the preconditions specified by the client.
  413: 'Payload Too Large', // The server refuses to process the request because the payload is too large.
  414: 'URI Too Long', // The server refuses to process the request because the URI is too long.
  415: 'Unsupported Media Type', // The server refuses to process the request because the payload format is unsupported.
  416: 'Range Not Satisfiable', // The client has asked for a portion of the file, but the server cannot supply that portion.
  417: 'Expectation Failed', // The server cannot meet the requirements of the Expect request-header field.
  418: "I'm a teapot", // This code was defined in 1998 as an April Fools' joke and is not expected to be implemented.
  421: 'Misdirected Request', // The server is not able to produce a response for this request due to a malformed request.
  422: 'Unprocessable Entity', // The request was well-formed but was unable to be followed due to semantic errors.
  423: 'Locked', // The resource that is being accessed is locked.
  424: 'Failed Dependency', // The request failed due to failure of a previous request.
  425: 'Too Early', // Indicates that the server is unwilling to risk processing a request that might be replayed.
  426: 'Upgrade Required', // The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
  428: 'Precondition Required', // The origin server requires the request to be conditional.
  429: 'Too Many Requests', // The user has sent too many requests in a given amount of time.
  431: 'Request Header Fields Too Large', // The server is unwilling to process the request because its header fields are too large.
  451: 'Unavailable For Legal Reasons', // The server is denying access to the resource as a consequence of a legal demand.

  // 5xx Server Errors
  500: 'Internal Server Error', // The server encountered an unexpected condition that prevented it from fulfilling the request.
  501: 'Not Implemented', // The server does not support the functionality required to fulfill the request.
  502: 'Bad Gateway', // The server acting as a gateway or proxy received an invalid response from an upstream server.
  503: 'Service Unavailable', // The server is currently unable to handle the request due to maintenance or overload.
  504: 'Gateway Timeout', // The server acting as a gateway or proxy did not receive a timely response from an upstream server.
  505: 'HTTP Version Not Supported', // The server does not support the HTTP protocol version used in the request.
  506: 'Variant Also Negotiates', // Transparent content negotiation for the request results in a circular reference.
  507: 'Insufficient Storage', // The server is unable to store the representation needed to complete the request.
  508: 'Loop Detected', // The server detected an infinite loop while processing the request.
  510: 'Not Extended', // Further extensions to the request are required for the server to fulfill it.
  511: 'Network Authentication Required', // The client needs to authenticate to gain network access.
}

export default HTTP_STATUS_CODES
