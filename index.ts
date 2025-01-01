import { Effect, Data, Schema } from "effect";
import { decodeUnknown } from "effect/Duration";
import { func } from "effect/FastCheck";

// this is an example of custom parameters you can add to you tagged error
//class FetchError extends Data.TaggedError("FetchError")<{
//  customMessage: string;
//}> {}

class FetchError extends Data.TaggedError("FetchError") {}
class JsonError extends Data.TaggedError("JsonError") {}

class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number,
}) {}

const fetchPokomon = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: (): FetchError => new FetchError(),
});

const responseJson = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => new JsonError(),
  });

const decodePokemon = Schema.decodeUnknown(Pokemon);

const program = Effect.gen(function* () {
  const response = yield* fetchPokomon;
  if (!response.ok) {
    return yield* new FetchError();
  }

  const json = yield* responseJson(response);
  const pokemon = yield* decodePokemon(json);
  return pokemon;
});

// run the program
Effect.runPromise(
  program.pipe(
    Effect.catchTags({
      FetchError: () => Effect.succeed("FetchError"),
      JsonError: () => Effect.succeed("JsonError"),
      ParseError: () => Effect.succeed("ParseError"),
    }),
  ),
).then(console.log);

