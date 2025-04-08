import { IHowLongToBeatData, IMetacriticData } from '@/interfaces/gameModel.interface';
import { logger } from '@/utils/logger';
import * as puppeteer from 'puppeteer';
import { launch } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

class ScrappingService {
  private apiUrl: string | null = null;

  private validateGameTitle(gameTitle: string) {
    if (!gameTitle) {
      throw new Error('Game title is required');
    }
    return gameTitle.replace(/[^a-zA-Z0-9 ]/g, '');
  }

  async captureApiUrlOnce(): Promise<void> {
    if (this.apiUrl) {
      logger.info('API URL already captured, skipping...');
      return;
    }

    const browser = await launch({
      headless: false, // Cambiar a true para producción
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Opciones para evitar problemas en headless
      defaultViewport: { width: 1280, height: 800 }, // Configurar viewport explícito
    });
    const page = await browser.newPage();

    try {
      await page.setRequestInterception(true);
      page.on('request', (request: puppeteer.HTTPRequest) => {
        void request.continue();
      });

      page.on('response', (response) => {
        const url = response.url();
        if (url.includes('https://howlongtobeat.com/api/ouch/')) {
          logger.info('Captured API URL:', url);
          this.apiUrl = url; // Guardar la URL capturada
        }
      });

      // Navegar al dominio base
      await page.goto('https://howlongtobeat.com', { waitUntil: 'domcontentloaded' });

      // Hacer clic en el cuadro de búsqueda para activar la llamada
      await page.waitForSelector('.MainNavigation_search_box__UUnYc');
      await page.click('.MainNavigation_search_box__UUnYc');

      // Esperar específicamente la respuesta de la API
      await page.waitForResponse(
        (response) => response.url().includes('https://howlongtobeat.com/api/ouch/'),
        { timeout: 10000 } // Tiempo máximo de espera
      );
      // Esperar un tiempo para capturar la llamada
      // await page.waitForTimeout(5000);

      if (!this.apiUrl) {
        throw new Error('API URL not captured');
      }
    } catch (error) {
      logger.error('Error capturing API URL:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapMetacritc(gameTitle: string): Promise<IMetacriticData> {
    gameTitle = this.validateGameTitle(gameTitle);
    const queryGetMetacriticGame = `https://backend.metacritic.com/finder/metacritic/autosuggest/${gameTitle}`;

    const response = await fetch(queryGetMetacriticGame);
    const dataTest = await response.json();
    const gamesResults = dataTest.data.items;

    let gameItem = gamesResults.find((item: { type: string; title: string; id: string }) => {
      const titleToCompare = item.title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
      return item.type === 'game-title' && titleToCompare.toLocaleLowerCase() === gameTitle.toLowerCase();
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

    const gameGenres = gameItem.genres?.map((genre: { name: string }) => genre.name);
    console.info('gameGenresRaw ', gameItem.genres);
    console.info('gameGenres', gameGenres);
    const gamePlatforms = gameItem.platforms?.map((platform: { name: string }) => platform.name);
    console.info('gamePlatformsRaw ', gameItem.platforms);

    const dataToSend: IMetacriticData = {
      metacriticId: gameID,
      pressScore: gameItem.criticScoreSummary.score,
      releasedDate: gameItem.releaseDate,
      userScore: data.userScore,
      title: gameItem.title,
      genres: gameGenres ?? [],
      platforms: gamePlatforms ?? [],
    };
    return dataToSend;
  }

  async scrapHowLongToBeat(gameTitle: string): Promise<IHowLongToBeatData> {
    gameTitle = this.validateGameTitle(gameTitle);
    const payload = {
      searchType: 'games',
      searchTerms: gameTitle.split(' '),
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
    if (!this.apiUrl) {
      throw new Error('API URL is not defined. Ensure captureApiUrlOnce() is called first.');
    }
    const response = await fetch(this.apiUrl, {
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
    logger.info('gamesResults', gamesResults);

    if (!gamesResults || gamesResults.length === 0) {
      logger.info(`No results found for gameTitle: ${gameTitle}`);
      const emptyData: IHowLongToBeatData = {
        howLongToBeatId: 0,
        title: gameTitle,
        mainStory: 0,
        mainExtra: 0,
        completionist: 0,
        combined: 0,
        isSinglePlayer: false,
        isCoop: false,
        isMulti: false,
        howLongToBeatReview: 0,
      };

      return emptyData;
    }
    const filteredResults = gamesResults.filter((item: { game_type: string }) => item.game_type !== 'dlc' || 'compil');

    logger.info('gamesResults', filteredResults);
    const gameItem = filteredResults.find(
      (item: { game_type: string; game_name: string; game_alias?: string; game_id: string }) => {
        const titleToCompare = item.game_name
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[^a-zA-Z0-9]/g, ''); // Eliminar caracteres especiales y espacios

        // Normalizar el alias del juego en la API (game_alias)
        const aliasToCompare = item.game_alias
          ? item.game_alias
              .toLowerCase()
              .replace(/&/g, 'and')
              .replace(/[^a-zA-Z0-9]/g, '')
          : null; // Eliminar caracteres especiales y espacios si existe alias

        // Normalizar el título del juego proporcionado
        const normalizedGameTitle = gameTitle
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[^a-zA-Z0-9]/g, ''); // Eliminar caracteres especiales y espacios

        logger.info('comparing titleToCompare', titleToCompare);
        logger.info('comparing aliasToCompare', aliasToCompare);
        logger.info('comparing normalizedGameTitle', normalizedGameTitle);

        if (filteredResults.length === 1) {
          const difference = Math.abs(titleToCompare.length - normalizedGameTitle.length);
          if (difference <= 1) {
            logger.info('Assuming match due to single-character difference');
            return true;
          } else {
            const logFilePath = path.join(__dirname, 'mismatched_titles.log');
            const logEntry = `Possible mismatch:\nGame Item: ${JSON.stringify(item)}\nProvided Title: ${gameTitle}\nNormalized Title: ${normalizedGameTitle}\nTitle to Compare: ${titleToCompare}\n\n`;

            fs.appendFileSync(logFilePath, logEntry, 'utf8');
            logger.warn(`Logged possible mismatch to ${logFilePath}`);
            return true;
          }
        }

        // Comparar las cadenas normalizadas
        return titleToCompare === normalizedGameTitle || aliasToCompare === normalizedGameTitle;
      }
    );
    const gameID = gameItem ? gameItem.game_id.toString() : null;

    logger.info('gameItem', gameItem);

    if (!gameItem) {
      const logFilePath = path.join(__dirname, 'unmatched_titles.log');
      const logEntry = `Unmatched Title:\nProvided Title: ${gameTitle}\nNormalized Title: ${gameTitle
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-zA-Z0-9]/g, '')}\nFiltered Results: ${JSON.stringify(filteredResults, null, 2)}\n\n`;

      fs.appendFileSync(logFilePath, logEntry, 'utf8');
      logger.warn(`Logged unmatched title to ${logFilePath}`);

      // Devolver un objeto vacío o predeterminado
      return {
        howLongToBeatId: 0,
        title: gameTitle,
        mainStory: 0,
        mainExtra: 0,
        completionist: 0,
        combined: 0,
        isSinglePlayer: false,
        isCoop: false,
        isMulti: false,
        howLongToBeatReview: 0,
      };
    }

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

  // async scrapHowLongToBeat(gameTitle: string): Promise<IHowLongToBeatData> {
  //   if (!this.apiUrl) {
  //     throw new Error('API URL is not defined. Ensure captureApiUrlOnce() is called first.');
  //   }

  //   gameTitle = this.validateGameTitle(gameTitle);

  //   const payload = {
  //     searchType: 'games',
  //     searchTerms: gameTitle.split(' '),
  //     searchPage: 1,
  //     size: 20,
  //     searchOptions: {
  //       games: {
  //         userId: 0,
  //         platform: '',
  //         sortCategory: 'popular',
  //         rangeCategory: 'main',
  //         rangeTime: { min: null, max: null },
  //         gameplay: { perspective: '', flow: '', genre: '', difficulty: '' },
  //         rangeYear: { min: '', max: '' },
  //         modifier: '',
  //       },
  //       users: { sortCategory: 'postcount' },
  //       lists: { sortCategory: 'follows' },
  //       filter: '',
  //       sort: 0,
  //       randomizer: 0,
  //     },
  //     useCache: true,
  //   };
  //   logger.info('this.apiUrl', this.apiUrl);
  //   const response = await fetch(this.apiUrl, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'User-Agent':
  //         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  //       Accept: '*/*',
  //       'Accept-Encoding': 'gzip, deflate, br, zstd',
  //       'Accept-Language': 'en-US,en;q=0.6',
  //       Origin: 'https://howlongtobeat.com',
  //       Referer: 'https://howlongtobeat.com',
  //     },
  //     body: JSON.stringify(payload),
  //   });

  //   const dataTest = await response.json();
  //   const gamesResults = dataTest.data;

  //   const gameItem = gamesResults.find((item: { game_type: string; game_name: string; game_id: string }) => {
  //     const titleToCompare = item.game_name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
  //     return item.game_type === 'game' && titleToCompare === gameTitle.toLowerCase();
  //   });

  //   if (!gameItem) {
  //     throw new Error('Game not found in API response');
  //   }

  //   return {
  //     howLongToBeatId: gameItem.game_id,
  //     title: gameItem.game_name,
  //     mainStory: gameItem.comp_main,
  //     mainExtra: gameItem.comp_plus,
  //     completionist: gameItem.comp_100,
  //     combined: gameItem.comp_all,
  //     isSinglePlayer: gameItem.comp_lvl_sp,
  //     isCoop: gameItem.comp_lvl_co,
  //     isMulti: gameItem.comp_lvl_mp,
  //     howLongToBeatReview: gameItem.review_score,
  //   };
  // }
}

export default ScrappingService;
