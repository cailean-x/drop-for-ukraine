require("dotenv").config();

import { ObjectId } from "mongodb";
import { connectDatabase } from "../src/database";
import { Listing, ListingType, User } from "../src/lib/types";

const listings: Listing[] = [
  {
    _id: new ObjectId("5d378db94e84753160e08b30"),
    title: "Logistics company Brothers Magnus, near Wildflecken",
    description:
      "We accept everything except food and medicine. We are open Mon to Fri from 9:00 am to 5:00 pm. Please call before visiting: +49 345 56 78.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963548/TH_Assets/HelpUkraine25_ib8d19.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.Apartment,
    address: "Paul-Nevermann-Platz 4, Wildflecken, Bavaria, GE",
    country: "Germany",
    admin: "Bavaria",
    city: "Wildflecken",
    bookings: [],
    bookingsIndex: {},
    price: 12424,
    numOfGuests: 3,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b31"),
    title:
      "Warehouses of the metallurgical company Forte Metall, the outskirts of Essen, not far from the TV tower.",
    description:
      "Hello, we accept goods including medicines. We do not accept food and civilian clothing. You can visit us on Mon, Tue and Fri from 9:00 am to midnight.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963548/TH_Assets/HelpUkraine21_hrtqeq.jpg",
    host: "5d378db94e84753160e08b55",
    type: ListingType.Apartment,
    address: "Jenaer Strasse 65, Essen, North Rhine-Westphalia, GE",
    country: "Germany",
    admin: "North Rhine-Westphalia",
    city: "Essen",
    bookings: [],
    bookingsIndex: {},
    price: 15806,
    numOfGuests: 3,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b32"),
    title: "Garment factory Master thread opens its warehouses to help Ukraine",
    description:
      "We are pleased to announce that from now on you can help Ukraine with humanitarian goods by bringing goods to our warehouses near Coburg. Just bring what you need. ATTENTION: WE DO NOT ACCEPT DWELLINGHOLD PRODUCTS OR USED CLOTHES. Call us for more information on tel.: +49 777 123 45.We are waiting for you!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963548/TH_Assets/HelpUkraine19_tuceed.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.House,
    address: "Borstelmannsweg 5, Coburg, Bavaria, GE",
    country: "Germany",
    admin: "Bavaria",
    city: "Coburg",
    bookings: [],
    bookingsIndex: {},
    price: 4055,
    numOfGuests: 2,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b33"),
    title:
      "Logistics company Wessel Logistics opens a warehouse for humanitarian aid to Ukraine.",
    description:
      "Wessel Logistics in Düsseldorf opened a collection point for humanitarian aid to Ukraine in one of the warehouses. You can come and give us humanitarian aid for Ukraine. WE DO NOT ACCEPT FOOD.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963548/TH_Assets/HelpUkraine16_j52px3.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.Apartment,
    address: "Park Str. 93, Düsseldorf, North Rhine-Westphalia, GE",
    country: "Germany",
    admin: "North Rhine-Westphalia",
    city: "Düsseldorf",
    bookings: [],
    bookingsIndex: {},
    price: 21292,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b34"),
    title:
      "Johnson Spirits factory is open to receive humanitarian aid for Ukraine",
    description:
      "Hello, we accept goods including medicines. We do not accept food and civilian clothing. You can visit us on Mon, Tue and Fri from 9:00 am to midnight.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963547/TH_Assets/HelpUkraine15_aqztjz.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.House,
    address: "Lietzenburger Straße 82, Luckau, BR, GE",
    country: "Germany",
    admin: "Brandenburg",
    city: "Luckau",
    bookings: [],
    bookingsIndex: {},
    price: 20930,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b35"),
    title: "Wellington Company opens its doors for humanitarian aid to Ukraine",
    description:
      "We collect humanitarian aid for Ukraine. Call us for information on +49 555 343 34 67. You will not find a similar place anywhere else in Luckau. We accept goods from 10:00 to 20:00 every day except weekends.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963546/TH_Assets/HelpUkraine12_ckq9wh.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.House,
    address: "Lietzenburger Straße 82, Luckau, BR, GE",
    country: "Germany",
    admin: "Brandenburg",
    city: "Luckau",
    bookings: [],
    bookingsIndex: {},
    price: 16836,
    numOfGuests: 2,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b36"),
    title: "Habsburg company in Malczyn",
    description:
      "We collect humanitarian aid for Ukraine. Call us for information on +49 555 343 34 67. You will not find a similar place anywhere else in Luckau. We accept goods from 10:00 to 20:00 every day except weekends.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963546/TH_Assets/HelpUkraine10_rg858v.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.House,
    address: "Chausseestr. 49, Malchin, MV, GE",
    country: "Germany",
    admin: "Mecklenburg-Vorpommern",
    city: "Malchin",
    bookings: [],
    bookingsIndex: {},
    price: 2577,
    numOfGuests: 1,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b37"),
    title: "Our hangar accepts humanitarian aid for Ukraine",
    description:
      "We send humanitarian aid to Ukraine. From Mon to Fri you can bring us the cargo necessary for Ukraine. Opening hours: 08:00 am - 16:00 pm.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963546/TH_Assets/HelpUkraine11_rajcbc.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "Wallstrasse 68, Kruft, RP, GE",
    country: "Germany",
    admin: "Rhineland-Palatinate",
    city: "Kruft",
    bookings: [],
    bookingsIndex: {},
    price: 23903,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b38"),
    title:
      "Charles de Pierre provides one of his storage facilities for the needs of Ukraine",
    description:
      "From Mon to Fri from 09:00 am to 18:00 pm you can bring us humanitarian aid to Ukraine. NO FOOD!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963546/TH_Assets/HelpUkraine13_acevc7.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "51 boulevard Aristide Briand, Le Grand-Quevilly, Normandy",
    country: "France",
    admin: "Normandy",
    city: "Le Grand-Quevilly",
    bookings: [],
    bookingsIndex: {},
    price: 21982,
    numOfGuests: 3,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b39"),
    title: "Sausison group - cargo transportation company",
    description:
      "We accept humanitarian aid on Tuesdays, Thursdays and Saturdays from 09:00 to 14:00 and from 17:00 to 20:00. We do not accept food.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963546/TH_Assets/HelpUkraine9_xjz7ip.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.Apartment,
    address: "44 avenue Jules Ferry, Soissons, Hauts-de-France",
    country: "France",
    admin: "Hauts-de-France",
    city: "Soissons",
    bookings: [],
    bookingsIndex: {},
    price: 18126,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b3a"),
    title: "Logistic company Jules Verne",
    description:
      "We are pleased to announce that one of our warehouses is now ready to receive your assistance to Ukraine. You can bring us the goods on any day of the week and we will arrange its shipment to Ukraine. We work from 13:00 to 18:00.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963546/TH_Assets/HelpUkraine4_qcflqi.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "15 rue Charles Corbeau, Fleury-les-Aubrais, Centre-Val de Loire",
    country: "France",
    admin: "Centre-Val de Loire",
    city: "Fleury-les-Aubrais",
    bookings: [],
    bookingsIndex: {},
    price: 16162,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b3b"),
    title: "Warehouse of the Blur moonlight company",
    description:
      "The only collection point for humanitarian aid in St. Louis for Ukraine. Call us for more information: 0325 95 3971",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963546/TH_Assets/HelpUkraine14_spxadt.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.House,
    address: "33 avenue du Marechal Juin, Saint-Louis, Grand Est",
    country: "France",
    admin: "Grand Est",
    city: "Saint-Louis",
    bookings: [],
    bookingsIndex: {},
    price: 11688,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b3c"),
    title: "French julienne company",
    description:
      "We accept your help to Ukraine. We are open from 10:00 am to 3:00 pm. Call 3345 64356 54.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963545/TH_Assets/HelpUkraine5_abxz3w.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.House,
    address: "22 avenue Jean Portalis, Tremblay-en-France, Île-de-France",
    country: "France",
    admin: "Île-de-France",
    city: "Tremblay-en-France",
    bookings: [],
    bookingsIndex: {},
    price: 16843,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b3d"),
    title:
      "Johnson Spirits factory is open to receive humanitarian aid for Ukraine",
    description:
      "Hello, we accept goods including medicines. We do not accept food and civilian clothing. You can visit us on Mon, Tue and Fri from 9:00 am to midnight.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963544/TH_Assets/HelpUkraine6_vlhd4x.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "85 rue du Président Roosevelt, Sartrouville, France",
    country: "France",
    admin: "Île-de-France",
    city: "Sartrouville",
    bookings: [],
    bookingsIndex: {},
    price: 3078,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b3e"),
    title: "Wellington Company opens its doors for humanitarian aid to Ukraine",
    description:
      "We accept humanitarian aid on Tuesdays, Thursdays and Saturdays from 09:00 to 14:00 and from 17:00 to 20:00. We do not accept food.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963544/TH_Assets/HelpUkraine2_rgtcnx.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.Apartment,
    address: "98 rue Pierre Motte, Sainte-Anne, Grande-Terre",
    country: "France",
    admin: "Grande-Terre",
    city: "Sainte-Anne",
    bookings: [],
    bookingsIndex: {},
    price: 12127,
    numOfGuests: 2,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b3f"),
    title:
      "Logistics company Wessel Logistics opens a warehouse for humanitarian aid to Ukraine.",
    description:
      "We are pleased to announce that from now on you can help Ukraine with humanitarian goods by bringing goods to our warehouses.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652963544/TH_Assets/HelpUkraine2_rgtcnx.jpg",
    host: "5d378db94e84753160e08b58",
    type: ListingType.House,
    address: "94 rue Petite Fusterie,Boulogne-sur-Mer, Hauts-de-France",
    country: "France",
    admin: "Hauts-de-France",
    city: "Boulogne-sur-Mer",
    bookings: [],
    bookingsIndex: {},
    price: 19242,
    numOfGuests: 2,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b40"),
    title: "The logistic company Miss Van de Hor",
    description:
      "Feel free to visit us and don't forget goods for Ukraine. Joine the humanitarian mission with us. DON'T BRING ANY FOOD.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975521/TH_Assets/war16_mytq5p.jpg",
    host: "5d378db94e84753160e08b58",
    type: ListingType.House,
    address: "75 rue Marie de Médicis, Béziers, Occitanie",
    country: "France",
    admin: "Occitanie",
    city: "Béziers",
    bookings: [],
    bookingsIndex: {},
    price: 18127,
    numOfGuests: 2,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b41"),
    title: "Logistic company Lions warehouse",
    description:
      "We are pleased to announce that from now on you can help Ukraine with humanitarian goods by bringing goods to our warehouses.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975520/TH_Assets/war9_nqo6uw.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.House,
    address: "96 rue Adolphe Wurtz, Le Puy, Auvergne-Rhône-Alpes",
    country: "France",
    admin: "Auvergne-Rhône-Alpes",
    city: "Le Puy",
    bookings: [],
    bookingsIndex: {},
    price: 22707,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b42"),
    title: "Our hangar accepts humanitarian aid for Ukraine",
    description:
      "We are pleased to announce that from now on you can help Ukraine with humanitarian goods by bringing goods to our warehouses near Coburg. Just bring what you need. ATTENTION: WE DO NOT ACCEPT DWELLINGHOLD PRODUCTS OR USED CLOTHES. Call us for more information on tel.: +49 777 123 45.We are waiting for you!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975520/TH_Assets/war10_dntjce.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.Apartment,
    address: "37 boulevard d'Alsace, Vénissieux, Auvergne-Rhône-Alpes",
    country: "France",
    admin: "Auvergne-Rhône-Alpes",
    city: "Vénissieux",
    bookings: [],
    bookingsIndex: {},
    price: 11845,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b43"),
    title:
      "Logistics company Wessel Logistics opens a warehouse for humanitarian aid to Ukraine.",
    description:
      "The only collection point for humanitarian aid in St. Louis for Ukraine. Call us for more information: 0325 95 3971",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975520/TH_Assets/war11_ba7oks.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "73 rue Sébastopol, Sainte-Geneviève-des-Bois, Île-de-France",
    country: "France",
    admin: "Île-de-France",
    city: "Sainte-Geneviève-des-Bois",
    bookings: [],
    bookingsIndex: {},
    price: 13623,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b44"),
    title: "French julienne company",
    description:
      "From Mon to Fri from 09:00 am to 18:00 pm you can bring us humanitarian aid to Ukraine. NO FOOD!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975520/TH_Assets/war6_b9vzpr.jpg",
    host: "5d378db94e84753160e08b58",
    type: ListingType.House,
    address: "37 rue de la Mare aux Carats, Montpellier, Occitanie",
    country: "France",
    admin: "Occitanie",
    city: "Montpellier",
    bookings: [],
    bookingsIndex: {},
    price: 6879,
    numOfGuests: 3,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b45"),
    title: "Wellington Company opens its doors for humanitarian aid to Ukraine",
    description:
      "We accept humanitarian aid on Tuesdays, Thursdays and Saturdays from 09:00 to 14:00 and from 17:00 to 20:00. We do not accept food.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975520/TH_Assets/warehous1_tlfbuw.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.House,
    address: "84 Quai des Belges, Martigues, Provence-Alpes-Côte d'Azur",
    country: "France",
    admin: "Provence-Alpes-Côte d'Azur",
    city: "Martigues",
    bookings: [],
    bookingsIndex: {},
    price: 14879,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b46"),
    title: "The logistic company Miss Van de Hor",
    description:
      "From Mon to Fri from 09:00 am to 18:00 pm you can bring us humanitarian aid to Ukraine. NO FOOD!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975520/TH_Assets/war5_wckpyx.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.House,
    address: "66 Boulevard de Normandie, Fontenay-sous-Bois, Île-de-France",
    country: "France",
    admin: "Île-de-France",
    city: "Fontenay-sous-Bois",
    bookings: [],
    bookingsIndex: {},
    price: 2778,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b47"),
    title:
      "Charles de Pierre provides one of his storage facilities for the needs of Ukraine",
    description:
      "We accept your help to Ukraine. We are open from 10:00 am to 3:00 pm. Call 3345 64356 54.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/war12_b1svvo.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.Apartment,
    address: "21 rue de Groussay, Rochefort, Nouvelle-Aquitaine",
    country: "France",
    admin: "Nouvelle-Aquitaine",
    city: "Rochefort",
    bookings: [],
    bookingsIndex: {},
    price: 17777,
    numOfGuests: 3,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b48"),
    title: "Chic condo in Camden",
    description:
      "Chic, cosy condo situated in Camden. Situated in a secluded and private neighbourhood with easy acces to public transit.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975520/TH_Assets/war3_sjmccf.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.Apartment,
    address: "3807 North Bend River Rd, London, United Kingdom",
    country: "United Kingdom",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 19462,
    numOfGuests: 1,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b49"),
    title: "Beautiful apartment in central London",
    description:
      "Beautiful and modern apartment situated in central London and minutes away from the London Underground (railway system).",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/war2_a5ziwp.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.Apartment,
    address: "1738 Old House Dr, London, United Kingdom",
    country: "United Kingdom",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 9425,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b4a"),
    title: "Bright furnished home",
    description:
      "Relax in this brightly lit, recently furnished, single bedroom home located in the outskirts of Stratford.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/war14_cpcvrg.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.House,
    address: "82 South Crescent, London, United Kingdom",
    country: "United Kingdom",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 1918,
    numOfGuests: 1,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b4b"),
    title: "Luxurious mansion in Cadogan Square",
    description:
      "Enjoy your stay in London in this beautiful and historic mansion right in the outskirts of Cadogan Square. Accommodation includes a private terrace, spacious entertainment area, seven bedrooms, and a beautiful outdoor garden.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/war13_yghgkx.jpg",
    host: "5d378db94e84753160e08b55",
    type: ListingType.House,
    address: "200 South Bend River Rd, London, United Kingdom",
    country: "United States",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 11349,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b4c"),
    title: "Beautiful 2 bedroom townhouse",
    description:
      "Located on a quiet peaceful residential street, this 2 bedroom townhouse is a perfect accommodation for those wishing to enjoy their stay in London without breaking the bank.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/jennifer-aniston-e-tornata-a-new-yokr_glkfrr.jpg",
    host: "5d378db94e84753160e08b55",
    type: ListingType.House,
    address: "44  Greyfriars Ave, London, United Kingdom",
    country: "United Kingdom",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 23483,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b4d"),
    title: "Magnificent suburban house in central London",
    description:
      "Large suburban house in central London. Fully furnished with outdoor patio, heating insulation and two spacious decks. Walking distance to everything you might need in your stay in London!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/war17_gxvj89.jpg",
    host: "5d378db94e84753160e08b57",
    type: ListingType.House,
    address: "20 Peachfarm Rd, London, United Kingdom",
    country: "United Kingdom",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 8721,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b4e"),
    title: "Tranquil, spacious condo apartment",
    description:
      "Tranquil, spacious condo apartment with a modern look and feel. Apartment accomodates up to 4 guests with 2 beds and 2 baths.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/war15_eoo4ah.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.Apartment,
    address: "20 Windsor St, London, United Kingdom",
    country: "United Kingdom",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 5884,
    numOfGuests: 1,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b4f"),
    title: "Charming spacious flat in Kensington",
    description:
      "Spacious, charming flat located close to the center of Kensington. Consists of a large en suite bedroom, atmospheric lighting and beautiful wall paintings across the flat. A truly picturesque accommodation.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652975519/TH_Assets/war18_b4mod0.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.Apartment,
    address: "15 Whitehorse Av, London, United Kingdom",
    country: "United Kingdom",
    admin: "England",
    city: "London",
    bookings: [],
    bookingsIndex: {},
    price: 19649,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b50"),
    title: "Single bedroom located in the heart of downtown San Fransisco",
    description:
      "Furnished and spacious single bedroom location situated minutes away from the nearest Muni train stop. Perfect for the independent traveller.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652976644/TH_Assets/war23_avzo4k.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "200 Sunnyside Rd, San Fransisco, California",
    country: "United States",
    admin: "California",
    city: "San Francisco",
    bookings: [],
    bookingsIndex: {},
    price: 22501,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b51"),
    title: "Downtown and modern San Fransisco studio apartment",
    description:
      "Downtown, modern, fully furnished, and sleek San Fransisco studio apartment.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652976644/TH_Assets/war24_suteot.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "102 Parkdale Av, San Fransisco, California",
    country: "United States",
    admin: "California",
    city: "San Francisco",
    bookings: [],
    bookingsIndex: {},
    price: 4051,
    numOfGuests: 5,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b52"),
    title: "Modern apartment steps away from the beach",
    description:
      "Beautiful modern apartment located a few minutes away from the beach. The perfect location for a relaxing and comfortable vacation in San Fransisco!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652976643/TH_Assets/war21_spzqqz.jpg",
    host: "5d378db94e84753160e08b59",
    type: ListingType.Apartment,
    address: "2 Bridgewater Rd, San Fransisco, California",
    country: "United States",
    admin: "California",
    city: "San Francisco",
    bookings: [],
    bookingsIndex: {},
    price: 9162,
    numOfGuests: 2,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b53"),
    title: "Spacious 2 story beach house",
    description:
      "Spacious 2 story house with extended balcony and magnificent ocean views from every window. Numerous restaurants exist only a walking distance away.",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652976643/TH_Assets/war19_ktxvbi.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.House,
    address: "100 Punta Nizuc Rd., Cancún, Mexico",
    country: "Mexico",
    admin: "Quintana Roo",
    city: "Cancún",
    bookings: [],
    bookingsIndex: {},
    price: 24842,
    numOfGuests: 4,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b54"),
    title: "Beachfront suite",
    description:
      "Beautiful beachfront suite located in Cancún hotel. Location consists of a large outdoor pool, parking, hotel convenience store, room service, and parking!",
    image:
      "https://res.cloudinary.com/artem-pustovoit/image/upload/v1652976643/TH_Assets/war20_pz9oxy.jpg",
    host: "5d378db94e84753160e08b56",
    type: ListingType.Apartment,
    address: "100 Punta Nizuc Rd., Cancún, Mexico",
    country: "Mexico",
    admin: "Quintana Roo",
    city: "Cancún",
    bookings: [],
    bookingsIndex: {},
    price: 23012,
    numOfGuests: 1,
  },
];
const users: User[] = [
  {
    _id: "5d378db94e84753160e08b55",
    token: "token_************",
    name: "James J.",
    avatar:
      "https://res.cloudinary.com/tiny-house/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1560648533/mock/users/user-profile-1_mawp12.jpg",
    contact: "james@tinyhouse.com",
    walletId: "acct_************",
    income: 723796,
    bookings: [],
    listings: [
      new ObjectId("5d378db94e84753160e08b31"),
      new ObjectId("5d378db94e84753160e08b4b"),
      new ObjectId("5d378db94e84753160e08b4c"),
    ],
  },
  {
    _id: "5d378db94e84753160e08b56",
    token: "token_************",
    name: "Elizabeth A.",
    avatar:
      "https://res.cloudinary.com/tiny-house/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1560649052/mock/users/user-profile-2_arwtdy.jpg",
    contact: "elizabeth@tinyhouse.com",
    walletId: "acct_************",
    income: 256144,
    bookings: [],
    listings: [
      new ObjectId("5d378db94e84753160e08b37"),
      new ObjectId("5d378db94e84753160e08b38"),
      new ObjectId("5d378db94e84753160e08b3a"),
      new ObjectId("5d378db94e84753160e08b3b"),
      new ObjectId("5d378db94e84753160e08b3d"),
      new ObjectId("5d378db94e84753160e08b41"),
      new ObjectId("5d378db94e84753160e08b43"),
      new ObjectId("5d378db94e84753160e08b4a"),
      new ObjectId("5d378db94e84753160e08b50"),
      new ObjectId("5d378db94e84753160e08b51"),
      new ObjectId("5d378db94e84753160e08b53"),
      new ObjectId("5d378db94e84753160e08b54"),
    ],
  },
  {
    _id: "5d378db94e84753160e08b57",
    token: "token_************",
    name: "Andrew D.",
    avatar:
      "https://res.cloudinary.com/tiny-house/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1560649280/mock/users/user-profile-3_omxctk.jpg",
    contact: "andrew@tinyhouse.com",
    walletId: "acct_************",
    income: 272359,
    bookings: [],
    listings: [
      new ObjectId("5d378db94e84753160e08b30"),
      new ObjectId("5d378db94e84753160e08b32"),
      new ObjectId("5d378db94e84753160e08b34"),
      new ObjectId("5d378db94e84753160e08b35"),
      new ObjectId("5d378db94e84753160e08b36"),
      new ObjectId("5d378db94e84753160e08b3c"),
      new ObjectId("5d378db94e84753160e08b3e"),
      new ObjectId("5d378db94e84753160e08b47"),
      new ObjectId("5d378db94e84753160e08b48"),
      new ObjectId("5d378db94e84753160e08b4d"),
    ],
  },
  {
    _id: "5d378db94e84753160e08b58",
    token: "token_************",
    name: "Danielle C.",
    avatar:
      "https://res.cloudinary.com/tiny-house/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1560650165/mock/users/user-profile-4_wxi6om.jpg",
    contact: "danielle@tinyhouse.com",
    walletId: "acct_************",
    income: 465043,
    bookings: [],
    listings: [
      new ObjectId("5d378db94e84753160e08b3f"),
      new ObjectId("5d378db94e84753160e08b40"),
      new ObjectId("5d378db94e84753160e08b44"),
    ],
  },
  {
    _id: "5d378db94e84753160e08b59",
    token: "token_************",
    name: "Sarah K.",
    avatar:
      "https://res.cloudinary.com/tiny-house/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1560650436/mock/users/user-profile-5_tm8hhl.jpg",
    contact: "sarah@tinyhouse.com",
    walletId: "acct_************",
    income: 104347,
    bookings: [],
    listings: [
      new ObjectId("5d378db94e84753160e08b33"),
      new ObjectId("5d378db94e84753160e08b39"),
      new ObjectId("5d378db94e84753160e08b42"),
      new ObjectId("5d378db94e84753160e08b45"),
      new ObjectId("5d378db94e84753160e08b46"),
      new ObjectId("5d378db94e84753160e08b49"),
      new ObjectId("5d378db94e84753160e08b4e"),
      new ObjectId("5d378db94e84753160e08b4f"),
      new ObjectId("5d378db94e84753160e08b52"),
    ],
  },
];

const seed = async () => {
  try {
    console.log("[seed] : running...");

    const db = await connectDatabase();

    for (const listing of listings) {
      await db.listings.insertOne(listing);
    }

    for (const user of users) {
      await db.users.insertOne(user);
    }

    console.log("[seed] : success");
  } catch {
    throw new Error("failed to seed database");
  }
};

seed();
