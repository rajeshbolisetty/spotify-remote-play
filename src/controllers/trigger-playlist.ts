import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { getConfig } from "../config";
import assert from "node:assert";

const { spotify } = getConfig();

export async function triggerPlayListOnDevice(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = await getAccessTokenFromRefresh();

    const { devices } = await getDevices(accessToken);

    const device = devices.find(
      (item: any) => item.name.toLowerCase() === spotify.deviceName?.toLowerCase(),
    );

    if (!device) {
      res.status(200).send({
        message: 'Device not found'
      });
      return;
    }

    await transferPlayBack(device.id, accessToken);

    const { items } = await getPlayLists(accessToken);

    const firstPlayList = items.find(
      (item: any) => item.name === spotify.playListName,
    );

    await playPlaylist(accessToken, device.id, firstPlayList.id);

    res.status(200).send({
      message: 'Successfully played'
    });
  } catch (error) {
    next(error);
  }
}

export async function stopSpotifyPlayOnDevice(
  req: Request,
  res: Response,
  next: NextFunction,) {
  try {
    const accessToken = await getAccessTokenFromRefresh();

    const { devices } = await getDevices(accessToken);

    const device = devices.find(
      (item: any) => item.name.toLowerCase() === spotify.deviceName?.toLowerCase(),
    );

    if (!device) {
      res.status(200).send({
        message: 'Device not found'
      });
      return;
    }

    await stopPlayback(accessToken, device.id)

    res.sendStatus(204)
  }
  catch (error) {
    next(error)
  }
}

async function getAccessTokenFromRefresh(): Promise<string> {
  assert(spotify.refreshToken);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: spotify.refreshToken,
  });

  const basic = Buffer.from(
    `${spotify.clientId}:${spotify.clientSecret}`,
  ).toString("base64");

  const { data } = await axios.post(
    spotify.endPoints.getToken,
    body.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
    },
  );

  return data.access_token;
}

async function getDevices(accessToken: string) {
  const { data } = await axios.get(spotify.endPoints.devices, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

async function transferPlayBack(deviceId: string, accessToken: string) {
  const { data } = await axios.put(
    spotify.endPoints.transferPlayback,
    { device_ids: [deviceId], play: true },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return data;
}

async function getPlayLists(accessToken: string) {
  const { data } = await axios.get(spotify.endPoints.getPlayLists, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

async function playPlaylist(
  accessToken: string,
  deviceId: string,
  playlistId: string,
) {
  const url = `${spotify.endPoints.playPlayList}?device_id=${encodeURIComponent(
    deviceId,
  )}`;

  await axios.put(
    url,
    {
      context_uri: `spotify:playlist:${playlistId}`,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
}

async function stopPlayback(accessToken: string, deviceId: string) {
  const url = `${spotify.endPoints.stopPlayback}?device_id=${encodeURIComponent(
    deviceId,
  )}`;

  await axios.put(
    url,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
}