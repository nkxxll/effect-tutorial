import { Effect, Data } from "effect";
import { func } from "effect/FastCheck";

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

const program = Effect.gen(function* () {
  const response = yield* fetchPokomon;
  if (!response.ok) {
    return yield* new FetchError();
  }

  const json = yield* responseJson(response);
  return json;
});

// run the program
Effect.runPromise(program).then(console.log);

