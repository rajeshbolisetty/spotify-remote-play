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

    const iphone = devices.find(
      (item: any) => item.name === spotify.deviceName,
    );

    if (!iphone) {
      res.sendStatus(200);
      return;
    }

    await transferPlayBack(iphone.id, accessToken);

    const { items } = await getPlayLists(accessToken);

    const firstPlayList = items.find(
      (item: any) => item.name === spotify.playListName,
    );

    await playPlaylist(accessToken, iphone.id, firstPlayList.id);

    res.sendStatus(200);
  } catch (error) {
    next(error);
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
