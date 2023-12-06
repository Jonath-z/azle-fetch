# azle-fetch

Custom fetch function for Azle framework with Inter-Canister Calls (ICP)

## Installation

```bash
npm install azle-fetch
```

```javascript
import azleFetch from "azle-fetch";
import { Some } from "azle";

// Example usage
const url = "https://example.com/api";
const inits = {
  method: "GET",
  transform: "your_transform_function",
  max_response_bytes: Some(200_000n),
};

const result = await azleFetch(url, inits);
console.log(result);
```

### Parameters

- url: The URL to make the request.
- inits: Initialization options, including method, transform function, and others.

### Response

The function returns a Promise with the following structure:

```javascript
{
  status: number; // HTTP status code
  data: TData; // Response data, parsed JSON or any other type
  error: {
    message: string | null; // Error message, if any
  }
}
```

### Examples

```javascript
Copy code
// TODO: Add examples
Save to grepper
```

### License

This project is licensed under the MIT License - see the LICENSE file for details.
