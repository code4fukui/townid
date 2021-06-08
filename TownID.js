import { CSV } from "https://js.sabae.cc/CSV.js";

let pref = null;
let city = null;
let town = {}; // cache
const init = async () => {
  if (!pref) {
    const base = "https://code4fukui.github.io/TownID/";
    pref = await fetchCSV(base + "data/pref.csv"); //  0.6kb
    city = await fetchCSV(base + "data/city.csv"); // 55kb
  }
};

const fetchCSV = async (url) => CSV.toJSON(await CSV.fetch(url));

class TownID {
  static async find(spref, scity, stown) {
    await init();
    const npref = pref.find(p => p.pref == spref)?.code;
    if (!npref) {
      return null;
    }
    const pcity = city.find(c => c.city == scity && c.code.startsWith(npref));
    if (!pcity) {
      return null;
    }
    const ntown = pcity.code;
    if (!ntown) {
      return null;
    }
    if (!town[ntown]) {
      town[ntown] = await fetchCSV("data/town/" + ntown + ".csv");
    }
    const townid = town[ntown].find(t => t.town == stown)?.townid;
    if (!townid) {
      return null;
    }
    return pcity.prefix + townid;
  }
  static async getPrefs() {
    await init();
    return pref.map(p => p.pref);
  }
  static async getCities(spref) {
    await init();
    const npref = pref.find(p => p.pref == spref)?.code;
    if (!npref) {
      return null;
    }
    return city.filter(c => c.code.startsWith(npref)).map(c => c.city);
  }
  static async getTowns(spref, scity) {
    await init();
    const npref = pref.find(p => p.pref == spref)?.code;
    if (!npref) {
      return null;
    }
    const pcity = city.find(c => c.city == scity && c.code.startsWith(npref));
    if (!pcity) {
      return null;
    }
    const ntown = pcity.code;
    if (!ntown) {
      return null;
    }
    if (!town[ntown]) {
      town[ntown] = await fetchCSV("data/town/" + ntown + ".csv");
    }
    return town[ntown].map(t => t.town);
  }
}
export { TownID };