import { showToast, Toast } from "@raycast/api";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { PokeAPI, PokemonV2Pokemon } from "../types";

function showFailureToast() {
  showToast(
    Toast.Style.Failure,
    "Something went wrong",
    "Please try again later",
  );
}

export const getPokemon = async (
  id: number,
  language: number,
): Promise<PokemonV2Pokemon[]> => {
  const query = JSON.stringify({
    query: `query pokemon($language_id: Int, $pokemon_id: Int) {
      pokemon_v2_pokemon(where: {id: {_eq: $pokemon_id}}) {
        base_experience
        id
        name
        height
        weight
        pokemon_v2_encounters {
          pokemon_v2_locationarea {
            name
            pokemon_v2_locationareanames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
          pokemon_v2_version {
            id
            name
            pokemon_v2_versiongroup {
              name
              pokemon_v2_generation {
                name
                pokemon_v2_generationnames(where: {language_id: {_eq: 9}}) {
                  name
                }
              }
            }
            pokemon_v2_versionnames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
        }
        pokemon_v2_pokemonabilities {
          is_hidden
          pokemon_v2_ability {
            pokemon_v2_abilitynames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
        }
        pokemon_v2_pokemonmoves(order_by: {level: asc}) {
          level
          move_id
          move_learn_method_id
          order
          pokemon_v2_move {
            accuracy
            name
            move_effect_chance
            power
            pp
            pokemon_v2_machines {
              machine_number
              version_group_id
            }
            pokemon_v2_movedamageclass {
              pokemon_v2_movedamageclassnames(where: {language_id: {_eq: 9}}) {
                name
              }
            }
            pokemon_v2_moveeffect {
              pokemon_v2_moveeffecteffecttexts(where: {language_id: {_eq: $language_id}}) {
                short_effect
              }
            }
            pokemon_v2_movenames(where: {language_id: {_eq: $language_id}}) {
              name
            }
            pokemon_v2_type {
              name
              pokemon_v2_typenames(where: {language_id: {_eq: $language_id}}) {
                name
              }
            }
          }
          pokemon_v2_movelearnmethod {
            name
            pokemon_v2_movelearnmethodnames(where: {language_id: {_eq: 9}}) {
              name
            }
          }
          pokemon_v2_versiongroup {
            id
            generation_id
            name
            pokemon_v2_versions {
              name
              pokemon_v2_versionnames(where: {language_id: {_eq: $language_id}}) {
                name
              }
            }
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          effort
          pokemon_v2_stat {
            name
            pokemon_v2_statnames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
        }
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
            pokemon_v2_typenames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
        }
        pokemon_v2_pokemonspecy {
          base_happiness
          capture_rate
          gender_rate
          growth_rate_id
          hatch_counter
          is_baby
          is_legendary
          is_mythical
          name
          pokemon_shape_id
          pokemon_v2_pokemondexnumbers {
            pokedex_number
            pokemon_v2_pokedex {
              pokemon_v2_pokedexversiongroups {
                version_group_id
                pokemon_v2_versiongroup {
                  name
                  pokemon_v2_versions {
                    id
                    name
                    pokemon_v2_versionnames(where: {language_id: {_eq: $language_id}}) {
                      name
                    }
                  }
                }
              }
            }
          }
          pokemon_v2_evolutionchain {
            pokemon_v2_pokemonspecies(order_by: {order: asc}) {
              id
              name
              evolves_from_species_id
              pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $language_id}}) {
                genus
                name
                language_id
              }
            }
          }
          pokemon_v2_pokemonegggroups {
            pokemon_v2_egggroup {
              name
              pokemon_v2_egggroupnames(where: {language_id: {_eq: $language_id}}) {
                name
              }
            }
          }
          pokemon_v2_pokemons(order_by: {id: asc}, where: {pokemon_v2_pokemonforms: {form_name: {_nin: ["totem", "starter"]}}}) {
            name
            height
            weight
            pokemon_v2_pokemonforms {
              form_name
              pokemon_id
              pokemon_v2_pokemonformnames(where: {language_id: {_eq: $language_id}}) {
                name
                pokemon_name
              }
            }
            pokemon_v2_pokemonabilities {
              is_hidden
              pokemon_v2_ability {
                pokemon_v2_abilitynames(where: {language_id: {_eq: $language_id}}) {
                  name
                }
              }
            }
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
                pokemon_v2_typenames(where: {language_id: {_eq: $language_id}}) {
                  name
                }
              }
            }
          }
          pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: $language_id}}) {
            flavor_text
            pokemon_v2_version {
              id
              name
              pokemon_v2_versiongroup {
                name
                pokemon_v2_generation {
                  name
                  pokemon_v2_generationnames(where: {language_id: {_eq: 9}}) {
                    name
                  }
                }
              }
              pokemon_v2_versionnames(where: {language_id: {_eq: $language_id}}) {
                name
              }
            }
          }
          pokemon_v2_pokemonspeciesnames {
            genus
            name
            language_id
          }
        }
      }
    }`,
    variables: {
      language_id: language,
      pokemon_id: id,
    },
  });

  const config: AxiosRequestConfig = {
    method: "post",
    url: "https://beta.pokeapi.co/graphql/v1beta",
    headers: {
      "Content-Type": "application/json",
    },
    data: query,
    timeout: 10000,
  };

  try {
    const { data }: AxiosResponse<PokeAPI> = await axios(config);

    if (Array.isArray(data.errors) && data.errors.length) {
      showFailureToast();

      return [];
    }

    return data.data.pokemon_v2_pokemon;
  } catch (e) {
    showFailureToast();

    return [];
  }
};
