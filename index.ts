import { Effect } from "effect";
import { PokeApi } from "./PokeApi";

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  const pokemon = yield* pokeApi.getPokemon;
  return pokemon;
});

const runnable = program.pipe(Effect.provideService(PokeApi, PokeApi.Live));

const main = runnable.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
    ParseError: () => Effect.succeed("Parse error"),
  }),
);

Effect.runPromise(main).then(console.log);

