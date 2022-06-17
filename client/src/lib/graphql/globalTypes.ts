/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ListingType {
  DWELLING = "DWELLING",
  INDUSTRIAL = "INDUSTRIAL",
}

export enum ListingsFilter {
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
}

export interface ConnectStripeInput {
  code: string;
}

export interface GeometryType {
  type: string;
  coordinates: [number, number];
}

export interface GeometryProps {
  phoneFormatted: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  crossStreet: string;
  postalCode: number;
  state: string;
}

export interface CreateBookingInput {
  id: string;
  checkIn: string;
}

export interface HostListingInput {
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  price: number;
}

export interface ListingOnMapInput {
  type: string;
  geometry: GeometryType;
  properties: GeometryProps;
}

export interface LogInInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
