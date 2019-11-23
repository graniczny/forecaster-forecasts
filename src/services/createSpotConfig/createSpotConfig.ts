import httpStatusCodes from 'http-status-codes';
import uuid from 'uuid/v4';

import { StandardReturnToRouter } from '../../interfaces';
import SpotConfig, { ISpotConfig } from '../../models/SpotConfig';

export default async function createSpotConfig(
  spotConfig: Partial<ISpotConfig>
): Promise<StandardReturnToRouter> {
  try {
    const newSpotConfig = new SpotConfig({ id: uuid(), ...spotConfig });
    await newSpotConfig.save();
    console.log(`[createSpotConfig()] spot configuration created!`);
  } catch (err) {
    console.error(
      `[createSpotConfig()] there was an error while creating spot configuration, error: ${err}`
    );
    return {
      status: httpStatusCodes.BAD_REQUEST,
      error: err.message
    };
  }
  return {
    status: httpStatusCodes.OK
  };
}
