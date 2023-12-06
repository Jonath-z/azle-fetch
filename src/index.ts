import { None, Opt, Principal, Some, ic } from "azle";
import {
  HttpHeader,
  HttpMethod,
  managementCanister,
} from "azle/canisters/management";

/**
 * Fetch option
 * @date 12/5/2023 - 6:25:20 PM
 *
 * @interface azleFetchInitType
 * @typedef {azleFetchInitType}
 * @extends {RequestInit}
 */
interface azleFetchInitType extends RequestInit {
  method: "GET" | "POST" | "HEAD";
  /**
   * The name function that transforms raw responses to sanitized responses,
   * and a byte-encoded context that is provided to the function upon
   * invocation, along with the response to be sanitized.
   */
  transform: string;
  max_response_bytes: Opt<bigint>;
  cycles?: bigint;
}

/**
 * Custom fetch function, built like javascript fetch funtion
 * @date 12/5/2023 - 6:24:47 PM
 *
 * @export
 * @async
 * @template [TData=any]
 * @param {string} url
 * @param {azleFetchInitType} inits
 * @returns {Promise<{ status: number; data: TData; error: { message: string | null } }>}
 */
export default async function azleFetch<TData = any>(
  url: string,
  inits: azleFetchInitType
): Promise<{ status: number; data: TData; error: { message: string | null } }> {
  // current supported request by azle
  const supportedRequest = {
    GET: "get",
    POST: "post",
    HEAD: "head",
  };

  /**
   * Format headers to be be supported by azle call
   * @returns {(typeof HttpHeader)[]}
   * @date 12/5/2023 - 6:25:58 PM
   **/
  const buildHeaders = (): (typeof HttpHeader)[] => {
    if (!inits?.headers) return [];
    const icpHeaders = Object.entries(inits.headers).map(([key, value]) => ({
      name: key,
      value,
    }));
    return icpHeaders;
  };

  const body = inits?.body;
  const response = await ic.call(managementCanister.http_request, {
    args: [
      {
        url,
        max_response_bytes: inits.max_response_bytes,
        body:
          inits.method === "GET"
            ? None
            : body
            ? Some(Buffer.from(JSON.stringify({ body }), "utf-8"))
            : Some(Buffer.from(JSON.stringify({}), "utf-8")),
        method: {
          [supportedRequest[inits?.method ?? "GET"]]: null,
        } as unknown as typeof HttpMethod,
        headers: buildHeaders(),
        transform: Some({
          function: [ic.id(), inits.transform] as [Principal, string],
          context: Uint8Array.from([]),
        }),
      },
    ],
    cycles: inits.cycles,
  });

  const formattedBody: TData = JSON.parse(
    Buffer.from(response.body.buffer).toString("utf-8")
  );

  const status = Number(response.status);
  console.log(formattedBody);
  return {
    status,
    data: formattedBody,
    error: {
      //@ts-ignore
      message: formattedBody?.error?.message ?? null,
    },
  };
}
