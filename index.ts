import { Effect, Data } from "effect";

// this is an example of custom parameters you can add to you tagged error
//class FetchError extends Data.TaggedError("FetchError")<{
//  customMessage: string;
//}> {}

class FetchError extends Data.TaggedError("FetchError") {}
class JsonError extends Data.TaggedError("JsonError") {}

const fetchPokomon = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"), // todo filter the ok respones out
  catch: (): FetchError => new FetchError(),
});

const responseJson = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => new JsonError(),
  });

const printResult = (result: string) => Effect.sync(() => console.log(result));

const program = fetchPokomon.pipe(
  Effect.filterOrFail(
    (res: Response) => res.ok,
    (): FetchError => new FetchError(),
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

