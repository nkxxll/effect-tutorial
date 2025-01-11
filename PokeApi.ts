import { Context, Effect, Layer, Schema } from "effect";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";
import { PokemonCollection } from "./PokemonCollection";

const make = Effect.gen(function* () {
  const pokemonCollection = yield* PokemonCollection;
  const buildPokeApiUrl = yield* BuildPokeApiUrl;

  return {
    getPokemon: Effect.gen(function* () {
      const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] });

      const response = yield* Effect.tryPromise({
        try: () => fetch(requestUrl),
        catch: () => new FetchError(),
      });

      if (!response.ok) {
        return yield* new FetchError();
      }

      const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
      });

      return yield* Schema.decodeUnknown(Pokemon)(json);
    }),
  };
});

export class PokeApi extends Effect.Service<PokeApi>()("PokeApi", {
  effect: make,
  dependencies: [PokemonCollection.Default, BuildPokeApiUrl.Default],
}) {}
