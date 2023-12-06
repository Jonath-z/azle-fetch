import { Canister, Err, None, Ok, Result, Some, query, text } from "azle";
import azleFetch from "../../../src";
import { HttpResponse, HttpTransformArgs } from "azle/canisters/management";

export default Canister({
  fetchGithubProfile: query([text], Result(text, text), async (username) => {
    const { data, error } = await azleFetch<any>(
      `https://api.github.com/users/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json, charset=utf-8",
        },
        max_response_bytes: None,
        cycles: 50_000_000n,
        transform: "transform",
      }
    );
    if (error) {
      return Err(`${error.message}`);
    }

    return Ok(JSON.stringify(data));
  }),

  transform: query([HttpTransformArgs], HttpResponse, (args) => {
    return {
      ...args.response,
      headers: [],
    };
  }),
});
