import mongoConnection from "../../db/db-config";
import BesEventConfigModel, {
  DEFAULT_EVENT_YEAR,
  getPrefixFromYear,
  BesEventConfigKey,
} from "../../db/models/bes_event_config";

export default class BesEventConfigService {
  async getCurrentEventConfig() {
    await mongoConnection.connect();
    const config = await BesEventConfigModel.findOne({
      key: BesEventConfigKey.CurrentEvent,
      isActive: true,
    }).lean();
    return config || null;
  }

  async getPrefixFromDb() {
    const config = await this.getCurrentEventConfig();
    if (config?.eventYear) {
      return getPrefixFromYear(config.eventYear);
    }
    return null;
  }

  async setEventYear(year: number) {
    await mongoConnection.connect();
    if (!year || year < 2000 || year > 2100) {
      return null;
    }
    const prefix = getPrefixFromYear(year);
    const updated = await BesEventConfigModel.findOneAndUpdate(
      { key: BesEventConfigKey.CurrentEvent },
      { eventYear: year, prefix, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return updated;
  }
}

export async function getPrefixReferenceNumber() {
  try {
    const service = new BesEventConfigService();
    const dbPrefix = await service.getPrefixFromDb();
    if (dbPrefix) return dbPrefix;
  } catch (e) {
    console.error("error while reading bes event prefix", e?.message);
  }
  return getPrefixFromYear(DEFAULT_EVENT_YEAR);
}