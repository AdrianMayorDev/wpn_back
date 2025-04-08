enum GameFields {
  ALL = '*',
  GAME_ID = 'game_id',
  GAME_RELEASE_DATE = 'game_release_date',
  STEAM_GAME_ID = 'steam_game_id',
  METACRITIC_GAME_ID = 'metacritic_game_id',
  HOW_LONG_TO_BEAT_GAME_ID = 'howlongtobeat_game_id',
  HEADER_URL = 'header_url',
  GAME_TITLE = 'game_title',
  MAIN_STORY_TIME = 'main_story_time',
  MAIN_PLUS_EXTRAS_TIME = 'main_plus_extras_time',
  COMPLETIONIST_TIME = 'completionist_time',
  COMBINED_TIME = 'combined_time',
  METACRITIC_SCORE = 'metacritic_score',
  USERS_SCORE = 'users_score',
  HOW_LONG_TO_BEAT_REVIEW_SCORE = 'howlongtobeat_review_score',
  RATIO_USERS_MAIN_STORY = 'ratio_users_main_story',
  RATIO_USERS_MAIN_EXTRA = 'ratio_users_main_extra',
  RATIO_USERS_COMPLETIONIST = 'ratio_users_completionist',
  RATIO_USERS_COMBINED = 'ratio_users_combined',
  RATIO_METACRITIC_MAIN_STORY = 'ratio_metacritic_main_story',
  RATIO_METACRITIC_MAIN_EXTRA = 'ratio_metacritic_main_extra',
  RATIO_METACRITIC_COMPLETIONIST = 'ratio_metacritic_completionist',
  RATIO_METACRITIC_COMBINED = 'ratio_metacritic_combined',
  GAME_IS_MULTI = 'game_is_multi',
  GAME_IS_COOP = 'game_is_coop',
  GAME_IS_SINGLE_PLAYER = 'game_is_single_player',
  GAME_GENRES = 'game_genres',
  GAME_PLATFORMS = 'game_platforms',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

interface IGameData {
  gameId: string;
  gameTitle: string;
  steamGameId: number;
  headerUrl: string;
  gameReleaseDate: string;
  gameGenres: string[];
  gamePlatforms: string[];
  metacriticGameId: number;
  howLongToBeatGameId: number;
  mainStoryTime: number;
  mainPlusExtrasTime: number;
  completionistTime: number;
  combinedTime: number;
  metacriticScore: number;
  usersScore: number;
  howLongToBeatReviewScore: number;
  ratioUsersMainStory: number;
  ratioUsersMainExtra: number;
  ratioUsersCompletionist: number;
  ratioUsersCombined: number;
  ratioMetacriticMainStory: number;
  ratioMetacriticMainExtra: number;
  ratioMetacriticCompletionist: number;
  ratioMetacriticCombined: number;
  gameIsMulti: boolean;
  gameIsCoop: boolean;
  gameIsSinglePlayer: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IGameDataDB {
  [GameFields.GAME_ID]: string;
  [GameFields.GAME_TITLE]: string;
  [GameFields.STEAM_GAME_ID]: number;
  [GameFields.METACRITIC_GAME_ID]: number;
  [GameFields.HOW_LONG_TO_BEAT_GAME_ID]: number;
  [GameFields.HEADER_URL]: string;
  [GameFields.METACRITIC_SCORE]: number;
  [GameFields.USERS_SCORE]: number;
  [GameFields.MAIN_STORY_TIME]: number;
  [GameFields.MAIN_PLUS_EXTRAS_TIME]: number;
  [GameFields.COMPLETIONIST_TIME]: number;
  [GameFields.COMBINED_TIME]: number;
  [GameFields.RATIO_USERS_MAIN_STORY]: number;
  [GameFields.RATIO_USERS_MAIN_EXTRA]: number;
  [GameFields.RATIO_USERS_COMPLETIONIST]: number;
  [GameFields.RATIO_USERS_COMBINED]: number;
  [GameFields.RATIO_METACRITIC_MAIN_STORY]: number;
  [GameFields.RATIO_METACRITIC_MAIN_EXTRA]: number;
  [GameFields.RATIO_METACRITIC_COMPLETIONIST]: number;
  [GameFields.RATIO_METACRITIC_COMBINED]: number;
  [GameFields.CREATED_AT]: Date;
  [GameFields.UPDATED_AT]: Date;
}

const fieldMapping: Record<string, GameFields> = {
  gameId: GameFields.GAME_ID,
  gameTitle: GameFields.GAME_TITLE,
  steamGameId: GameFields.STEAM_GAME_ID,
  headerUrl: GameFields.HEADER_URL,
  gameReleaseDate: GameFields.GAME_RELEASE_DATE,
  gameGenres: GameFields.GAME_GENRES,
  gamePlatforms: GameFields.GAME_PLATFORMS,
  metacriticGameId: GameFields.METACRITIC_GAME_ID,
  howlongtobeatGameId: GameFields.HOW_LONG_TO_BEAT_GAME_ID,
  mainStoryTime: GameFields.MAIN_STORY_TIME,
  mainPlusExtrasTime: GameFields.MAIN_PLUS_EXTRAS_TIME,
  completionistTime: GameFields.COMPLETIONIST_TIME,
  combinedTime: GameFields.COMBINED_TIME,
  metacriticScore: GameFields.METACRITIC_SCORE,
  usersScore: GameFields.USERS_SCORE,
  howlongtobeatReviewScore: GameFields.HOW_LONG_TO_BEAT_REVIEW_SCORE,
  ratioUsersMainStory: GameFields.RATIO_USERS_MAIN_STORY,
  ratioUsersMainExtra: GameFields.RATIO_USERS_MAIN_EXTRA,
  ratioUsersCompletionist: GameFields.RATIO_USERS_COMPLETIONIST,
  ratioUsersCombined: GameFields.RATIO_USERS_COMBINED,
  ratioMetacriticMainStory: GameFields.RATIO_METACRITIC_MAIN_STORY,
  ratioMetacriticMainExtra: GameFields.RATIO_METACRITIC_MAIN_EXTRA,
  ratioMetacriticCompletionist: GameFields.RATIO_METACRITIC_COMPLETIONIST,
  ratioMetacriticCombined: GameFields.RATIO_METACRITIC_COMBINED,
  gameIsMulti: GameFields.GAME_IS_MULTI,
  gameIsCoop: GameFields.GAME_IS_COOP,
  gameIsSinglePlayer: GameFields.GAME_IS_SINGLE_PLAYER,
  createdAt: GameFields.CREATED_AT,
  updatedAt: GameFields.UPDATED_AT,
};

const mapGamesToDbFields = (data: IGameData): IGameDataDB => {
  const mappedData: any = {} as IGameDataDB;
  for (const key in data) {
    if (fieldMapping[key]) {
      mappedData[fieldMapping[key]] = data[key as keyof IGameData];
    }
  }
  return mappedData;
};

const mapGamesToModel = (data: IGameDataDB): IGameData => {
  const mappedData: any = {} as IGameDataDB;
  for (const key in data) {
    const modelKey = Object.keys(fieldMapping).find((k) => fieldMapping[k] === key);
    if (modelKey) {
      mappedData[modelKey] = data[key as keyof IGameDataDB];
    }
  }
  return mappedData;
};

interface IMetacriticData {
  metacriticId: number;
  title: string;
  pressScore: number;
  userScore: number;
  releasedDate: string;
  genres: string[];
  platforms: string[];
}

interface IHowLongToBeatData {
  howLongToBeatId: number;
  title: string;
  mainStory: number;
  mainExtra: number;
  completionist: number;
  combined: number;
  isSinglePlayer: boolean;
  isCoop: boolean;
  isMulti: boolean;
  howLongToBeatReview: number;
}

interface ISteamGameData {
  appid: number;
  name: string;
  playtimeForever: number;
  imgIconUrl: string;
  playtimeWindowsForever: number;
  playtimeMacForever: number;
  playtimeLinuxForever: number;
  playtimeDeckForever: number;
  rtimeLastPlayed: number;
  playtimeDisconnected: number;
}

export {
  IGameData,
  IMetacriticData,
  ISteamGameData,
  IHowLongToBeatData,
  GameFields,
  IGameDataDB,
  mapGamesToDbFields,
  mapGamesToModel,
};
