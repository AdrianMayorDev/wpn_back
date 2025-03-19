import { IHowLongToBeatData, IMetacriticData } from '@/interfaces/gameModel.interface';
import { launch } from 'puppeteer';

class ScrappingService {
  private readonly gameTitle: string;
  private readonly queryGetMetacriticGame: string;
  private readonly HLTBurl = `https://howlongtobeat.com/api/ouch/b0299c4a0bf5c22b`;

  constructor(gameTitle: string) {
    this.gameTitle = gameTitle.replace(/[^a-zA-Z0-9 ]/g, '');
    this.queryGetMetacriticGame = `https://backend.metacritic.com/finder/metacritic/autosuggest/${gameTitle}`;
  }

  async scrapMetacritc(): Promise<IMetacriticData> {
    const response = await fetch(this.queryGetMetacriticGame);
    const dataTest = await response.json();
    const gamesResults = dataTest.data.items;

    let gameItem = gamesResults.find((item: { type: string; title: string; id: string }) => {
      const titleToCompare = item.title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
      return item.type === 'game-title' && titleToCompare.toLocaleLowerCase() === this.gameTitle.toLowerCase();
    });

    if (!gameItem) gameItem = gamesResults[0];
    const gameID = gameItem ? gameItem.id : null;

    const url = `https://www.metacritic.com/game/` + gameID;

    // Lunch puppeteer with headless mode
    const browser = await launch({ headless: true });
    const page = await browser.newPage();

    // Simular un navegador real
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    );

    // Navitage to the URL
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extraer datos con selectores CSS
    const data = await page.evaluate(() => {
      const userScore =
        document.querySelector(".c-productScoreInfo_scoreContent [title*='User score'].c-siteReviewScore span")
          ?.innerHTML ?? '0';

      return {
        userScore: parseFloat(userScore),
      };
    });

    // Cerrar navegador
    await browser.close();

    const gameGenres = gameItem.genres.map((genre: { name: string }) => genre.name);
    console.info('gameGenresRaw ', gameItem.genres);
    console.info('gameGenres', gameGenres);
    const gamePlatforms = gameItem.platforms.map((platform: { name: string }) => platform.name);
    console.info('gamePlatformsRaw ', gameItem.platforms);
    console.info('gamePlatforms', gamePlatforms);

    const dataToSend: IMetacriticData = {
      metacriticId: gameID,
      pressScore: gameItem.criticScoreSummary.score,
      releasedDate: gameItem.releaseDate,
      userScore: data.userScore,
      title: gameItem.title,
      genres: gameGenres,
      platforms: gamePlatforms,
    };
    return dataToSend;
  }

  async scrapHowLongToBeat(): Promise<IHowLongToBeatData> {
    const payload = {
      searchType: 'games',
      searchTerms: this.gameTitle.split(' '),
      searchPage: 1,
      size: 20,
      searchOptions: {
        games: {
          userId: 0,
          platform: '',
          sortCategory: 'popular',
          rangeCategory: 'main',
          rangeTime: { min: null, max: null },
          gameplay: { perspective: '', flow: '', genre: '', difficulty: '' },
          rangeYear: { min: '', max: '' },
          modifier: '',
        },
        users: { sortCategory: 'postcount' },
        lists: { sortCategory: 'follows' },
        filter: '',
        sort: 0,
        randomizer: 0,
      },
      useCache: true,
    };
    const response = await fetch(this.HLTBurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.6',
        Origin: 'https://howlongtobeat.com',
        Referer: 'https://howlongtobeat.com',
        'Sec-CH-UA': `"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"`,
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': `"Windows"`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1',
      },
      body: JSON.stringify(payload),
    });

    const dataTest = await response.json();
    const gamesResults = dataTest.data;

    const gameItem = gamesResults.find((item: { game_type: string; game_name: string; game_id: string }) => {
      const titleToCompare = item.game_name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
      return item.game_type === 'game' && titleToCompare === this.gameTitle.toLowerCase();
    });
    const gameID = gameItem ? gameItem.game_id : null;

    const data = {
      howLongToBeatId: gameID,
      title: gameItem.game_name,
      mainStory: gameItem.comp_main,
      mainExtra: gameItem.comp_plus,
      completionist: gameItem.comp_100,
      combined: gameItem.comp_all,
      isSinglePlayer: gameItem.comp_lvl_sp,
      isCoop: gameItem.comp_lvl_co,
      isMulti: gameItem.comp_lvl_mp,
      howLongToBeatReview: gameItem.review_score,
    };

    return data;
  }
}

export default ScrappingService;
