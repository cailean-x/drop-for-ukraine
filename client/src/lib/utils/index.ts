import { message, notification } from "antd";

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

export const geocode = async (address: string): Promise<Common.GeocodeResult> => {
  const URL = "https://maps.googleapis.com/maps/api/geocode/json";
  const KEY = process.env.REACT_APP_GOOGLEMAPS_API_KEY;
  const result = await fetch(`${URL}?address=${encodeURIComponent(address)}&key=${KEY}`);
  return result.json();
}