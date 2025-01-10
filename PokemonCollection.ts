import { Context, type Array } from "effect";

export class PokemonCollection extends Context.Tag("PokemonCollection")<
  PokemonCollection,
  /// 👇 A list of names of your favorite Pokémon
  Array.NonEmptyArray<string>
>() {
  static readonly Live = PokemonCollection.of([
    "staryu",
    "perrserker",
    "flaaffy",
  ]);
}
