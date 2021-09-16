
import { singletonHook } from 'react-singleton-hook';
import { useState, useEffect } from 'react';

const initSettings = false;
const initDevice = false;
const initGallery = false;
const initPin = "";
const initGame = "";
const initVolume = 0.7;

let globalSetPin = () => { throw new Error('you must useStateManager before setting its state'); };

export const useStateManager = singletonHook((initSettings, initDevice, initVolume, initGallery, initPin, initGame), () => {
    const [settings, setSettings] = useState(initSettings);
    const [volume, setVolume] = useState(initVolume);
    const [device, setDevice] = useState(initDevice);
    const [gallery, setGallery] = useState(initGallery);
    const [pin, setPin] = useState(initPin);
    const [game, setGame] = useState(initGame);
    globalSetPin = setPin;
    return {settings, pin, device, gallery, game, volume, setSettings, setDevice, setGallery, setGame, setVolume};
});

export const setPin = pin => globalSetPin(pin);