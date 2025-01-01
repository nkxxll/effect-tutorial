import { Effect } from "effect";
import { filterOrFail } from "effect/STM";

interface FetchError {
  readonly _tag: "FetchError";
}

interface JsonError {
  readonly _tag: "JsonError";
}

const fetchError = {
  _tag: "FetchError" as const,
};

const jsonError = {
  _tag: "JsonError" as const,
};

const fetchPokomon = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"), // todo filter the ok respones out
  catch: (): FetchError => fetchError,
});

const responseJson = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => jsonError,
  });

const printResult = (result: string) => Effect.sync(() => console.log(result));

const program = fetchPokomon.pipe(
  Effect.filterOrFail(
    (res: Response) => res.ok,
    (): FetchError => fetchError,
  ),
  Effect.flatMap(responseJson),
  Effect.catchTag("FetchError", () =>
    Effect.succeed("There was an error while fetching"),
  ),
  Effect.catchTag("JsonError", () =>
    Effect.succeed("There was an error while jsoning"),
  ),
  Effect.flatMap(printResult),
);

// run the program
Effect.runPromise(program);

