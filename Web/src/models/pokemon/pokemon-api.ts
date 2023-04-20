export interface PokemonAPI {
  abilites?: [{
    ability?: {
      name?: string;
      url?: string;
    };
    is_hidden?: boolean;
    slot?: number;
  }];
  base_experience?: number;
  forms?: [{
    name?: string;
    url?: string;
  }];
  game_indices?: [{
    game_index?: number;
    version?: {
      name?: string;
      url?: string;
    };
  }];
  height?: number;
  held_items?: [{
    item?: {
      name?: string;
      url?: string;
    };
    version_details: [{
      rarity?: number;
      version?: {
        name?: string;
        url?: string;
      };
    }];
  }];
  id?: number;
  is_default?: boolean;
  location_area_encounters?: string;
  moves?: [{
    move?: {
      name?: string;
      url?: string;
    };
    version_group_details?: [{
      level_learned_at?: number;
      move_learn_method?: {
        name?: string;
        url?: string;
      };
      version_group?: {
        name?: string;
        url?: string;
      };
    }];
  }];
  name?: string;
  order?: number;
  past_types?: [{}];
  species?: {
    name?: string;
    url?: string;
  };
  sprites?: {
    back_default?: string;
    back_female?: string;
    back_shiny?: string;
    back_shiny_female?: string;
    front_default?: string;
    front_female?: string;
    front_shiny?: string;
    front_shiny_female?: string;
    other?: {
      dream_world?: {
        front_default?: string;
        front_female?: string;
      };
      home?: {
        front_default?: string;
        front_female?: string;
        front_shiny?: string;
        front_shiny_female?: string;
      };
      ['official-artwork']?: {
        front_default?: string;
        front_shiny?: string;
      };
      versions?: versions;
    };
  };
  stats?: [{
    base_stat?: number;
    effort?: number;
    stat?: {
      name?: string;
      url?: string;
    };
  }];
  types?: [{
    slot?: number;
    type?: {
      name?: string;
      url?: string;
    }
  }];
  weight?: number;
}

interface versions {
  ['generation-i']?: version_games; 
  ['generation-ii']?: version_games;
  ['generation-iii']?: version_games;
  ['generation-iv']?: version_games;
  ['generation-v']?: version_games;
  ['generation-vi']?: version_games;
  ['generation-vii']?: version_games;
  ['generation-viii']?: version_games;
}

interface version_games {
  ['red-blue']?: version_sprites;
  yellow?: version_sprites;
  crystal?: version_sprites;
  gold?: version_sprites;
  silver?: version_sprites;
  emerald?: version_sprites;
  ['ruby-sapphire']?: version_sprites;
  ['diamond-pearl']?: version_sprites;
  ['heartgold-soulsilver']?: version_sprites;
  platinum?: version_sprites;
  ['black-white']?: version_sprites;
  ['omegaruby-alphasapphire']?: version_sprites;
  ['x-y']?: version_sprites;
  icons?: version_sprites;
  ['ultra-sun-ultra-moon']?: version_sprites;
}

interface version_sprites {
  back_default?: string;
  back_female?: string;
  back_gray?: string;
  back_shiny?: string;
  back_shiny_transparent?: string;
  back_transparent?: string;
  front_default?: string;
  front_female?: string;
  front_gray?: string;
  front_shiny?: string;
  front_shiny_transparent?: string;
  front_transparent?: string;
}
