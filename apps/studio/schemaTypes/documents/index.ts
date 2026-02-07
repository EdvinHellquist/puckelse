import { page } from "./page";
import { homePage } from "./homePage";
import { news } from "./news";
import { settings } from "./settings";
import { komIgangPage } from "./kom-igang-page";
import { sponsorerPage } from "./sponsorerPage";
import { freestyleSpiritPage } from "./freestyleSpiritPage";
import { season } from "./season";
import { legendSkier } from "./legendSkier";

export const documents = [page, news, season, legendSkier];
export const singletons = [homePage, komIgangPage, settings, sponsorerPage, freestyleSpiritPage];

