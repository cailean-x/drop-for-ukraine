import { message, notification } from "antd";
import { GeocodeResult } from "../types";

export const iconColor = "#1890ff";

export const formatListingPrice = (price: number, round = true) => {
  const formattedListingPrice = round ? Math.round(price / 100) : price / 100;
  return `${formattedListingPrice}`;
};

export const displaySuccessNotification = (
  message: string,
  description?: string
) => {
  return notification["success"]({
    message,
    description,
    placement: "topLeft",
    style: {
      marginTop: 50,
    },
  });
};

export const displayErrorMessage = (error: string) => {
  return message.error(error);
};

export const geocode = async (address: string): Promise<GeocodeResult> => {
  const URL = "https://maps.googleapis.com/maps/api/geocode/json";
  const KEY = "AIzaSyABmFXFGmv-solwrlfLSBJbVT0KlH3IqEU";
  const result = await fetch(`${URL}?address=${encodeURIComponent(address)}&key=${KEY}`);
  return result.json();
}